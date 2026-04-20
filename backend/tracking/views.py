from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Person, Location, TimeLog, UserProfile, AuditEntry
from .serializers import PersonSerializer, LocationSerializer, TimeLogSerializer, UserSerializer, AuditEntrySerializer

def log_audit(user, action, instance, changes=None):
    """Helper to create an AuditEntry record."""
    AuditEntry.objects.create(
        user=user if (user and user.is_authenticated) else None,
        action=action,
        model_name=instance.__class__.__name__,
        object_id=instance.id,
        object_repr=str(instance),
        changes=changes
    )


class IsAdminRole(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and hasattr(request.user, 'profile') and request.user.profile.role == 'admin'

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        role = 'staff'
        if hasattr(user, 'profile'):
            role = user.profile.role
            
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'role': role
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [IsAdminRole()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        old = PersonSerializer(self.get_object()).data
        instance = serializer.save()
        log_audit(self.request.user, 'update', instance, {'old': dict(old), 'new': PersonSerializer(instance).data})

    def perform_destroy(self, instance):
        old = PersonSerializer(instance).data
        log_audit(self.request.user, 'delete', instance, {'old': dict(old)})
        instance.delete()

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

class TimeLogViewSet(viewsets.ModelViewSet):
    queryset = TimeLog.objects.all()
    serializer_class = TimeLogSerializer

    def perform_update(self, serializer):
        old = TimeLogSerializer(self.get_object()).data
        instance = serializer.save()
        log_audit(self.request.user, 'update', instance, {'old': old, 'new': TimeLogSerializer(instance).data})

    def perform_destroy(self, instance):
        old = TimeLogSerializer(instance).data
        log_audit(self.request.user, 'delete', instance, {'old': old})
        instance.delete()

    def get_permissions(self):
        # Allow anyone to clock in/out if they know the person/location ID (kiosk mode)
        if self.action in ['clock_in_bulk', 'clock_out', 'clock_out_all', 'list']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['post'])
    def clock_in_bulk(self, request):
        """
        Custom action to clock-in multiple people at once.
        Payload: { 
           'person_ids': [1, 2], 
           'location_id': 1, 
           'clock_in': '2026-04-07 14:00' (optional) 
        }
        """
        person_ids = request.data.get('person_ids', [])
        location_id = request.data.get('location_id')
        clock_in_time = request.data.get('clock_in')
        clock_out_time = request.data.get('clock_out')

        if not person_ids or not location_id:
            return Response({'error': 'person_ids and location_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not clock_in_time or clock_in_time == 'Now':
            clock_in_time = timezone.now()
        
        if not clock_out_time:
            clock_out_time = None

        log_type = request.data.get('log_type', 'work')
        
        logs = []
        for p_id in person_ids:
            # If it's not a work entry, we auto-complete it immediately
            final_clock_out = clock_out_time
            is_comp = bool(clock_out_time)
            
            if log_type != 'work':
                is_comp = True
                if not final_clock_out:
                    final_clock_out = clock_in_time # Mark as 0-duration day entry

            log = TimeLog.objects.create(
                person_id=p_id,
                location_id=location_id,
                clock_in=clock_in_time,
                clock_out=final_clock_out,
                is_completed=is_comp,
                comments=request.data.get('comments'),
                log_type=log_type
            )
            logs.append(TimeLogSerializer(log).data)

        return Response(logs, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def clock_out(self, request, pk=None):
        """Individual clock out"""
        log = self.get_object()
        clock_out_time = request.data.get('clock_out')
        
        if clock_out_time:
            log.clock_out = clock_out_time
        else:
            log.clock_out = timezone.now()
            
        comments = request.data.get('comments')
        if comments:
            log.comments = comments
            
        log_type = request.data.get('log_type')
        if log_type:
            log.log_type = log_type
            
        log.is_completed = True
        log.save()
        return Response(TimeLogSerializer(log).data)

    @action(detail=False, methods=['post'])
    def clock_out_all(self, request):
        """Clock out everyone who is currently active"""
        clock_out_time = request.data.get('clock_out')
        
        if not clock_out_time:
            clock_out_time = timezone.now()
            
        active_logs = TimeLog.objects.filter(clock_out__isnull=True)
        count = active_logs.count()
        comments = request.data.get('comments')
        log_type = request.data.get('log_type')
        for log in active_logs:
            log.clock_out = clock_out_time
            log.is_completed = True
            if comments:
                log.comments = comments
            if log_type:
                log.log_type = log_type
            log.save()
        return Response({'message': f'{count} logs closed successfully'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def report(self, request):
        """Generates the aggregated hours report for a date range"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        person_id = request.query_params.get('person_id')
        location_id = request.query_params.get('location_id')

        if not start_date or not end_date:
            return Response({'error': 'start_date and end_date are required'}, status=status.HTTP_400_BAD_REQUEST)

        logs = TimeLog.objects.filter(
            clock_in__date__gte=start_date,
            clock_in__date__lte=end_date,
            is_completed=True,
            clock_out__isnull=False
        )

        if person_id:
            logs = logs.filter(person_id=person_id)
            
        if location_id:
            logs = logs.filter(location_id=location_id)

        report_data = []
        people = Person.objects.filter(logs__in=logs).distinct()

        total_hours = 0.0
        total_spending = 0.0

        for p in people:
            p_logs = logs.filter(person=p)
            
            # Only calculate hours and cost for WORK entries
            work_logs = p_logs.filter(log_type='work')
            total_duration = sum((log.clock_out - log.clock_in).total_seconds() for log in work_logs)
            hours = total_duration / 3600.0
            total_hours += hours
            
            # Count unique days for Sick, Holiday and Missing
            sick_days = p_logs.filter(log_type='sick').values_list('clock_in__date', flat=True).distinct().count()
            holiday_days = p_logs.filter(log_type='holiday').values_list('clock_in__date', flat=True).distinct().count()
            missing_days = p_logs.filter(log_type='missing').values_list('clock_in__date', flat=True).distinct().count()
            
            # Get unique location names for this person in this period
            venue_names = sorted(list(set(p_logs.values_list('location__name', flat=True))))
            locais_str = ", ".join(venue_names)

            photo_url = request.build_absolute_uri(p.photo.url) if p.photo else None
            
            # Calculate cost for this person
            rate = float(p.hourly_rate)
            person_cost = hours * rate
            total_spending += person_cost

            report_data.append({
                'id': p.id,
                'nome': p.name,
                'posicao': p.position or 'Colaborador',
                'foto': photo_url,
                'horas': hours,
                'hourly_rate': rate,
                'total_cost': person_cost,
                'locais': locais_str,
                'sick_days': sick_days,
                'holiday_days': holiday_days,
                'missing_days': missing_days
            })

        # Sort by total hours descending
        report_data = sorted(report_data, key=lambda k: k['horas'], reverse=True)

        raw_logs = []
        for log in logs.order_by('-clock_in'):
            raw_logs.append({
                'id': log.id,
                'person_id': log.person_id,
                'person_name': log.person.name,
                'location_id': log.location_id,
                'location_name': log.location.name,
                'clock_in': log.clock_in.strftime("%Y-%m-%dT%H:%M:%SZ"),
                'clock_out': log.clock_out.strftime("%Y-%m-%dT%H:%M:%SZ") if log.clock_out else None,
                'comments': log.comments,
                'log_type': log.log_type,
            })

        return Response({
            'total_hours': total_hours,
            'total_spending': total_spending,
            'collaborators_count': people.count(),
            'total_sick_days': logs.filter(log_type='sick').values_list('clock_in__date', flat=True).distinct().count(),
            'total_holiday_days': logs.filter(log_type='holiday').values_list('clock_in__date', flat=True).distinct().count(),
            'total_missing_days': logs.filter(log_type='missing').values_list('clock_in__date', flat=True).distinct().count(),
            'average_hours': total_hours / people.count() if people.count() > 0 else 0,
            'breakdown': report_data,
            'raw_logs': raw_logs
        })

class AuditEntryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only admin view of the audit trail."""
    serializer_class = AuditEntrySerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        qs = AuditEntry.objects.select_related('user').all()
        model = self.request.query_params.get('model')
        action_filter = self.request.query_params.get('action')
        if model:
            qs = qs.filter(model_name=model)
        if action_filter:
            qs = qs.filter(action=action_filter)
        return qs[:200]  # Cap at 200 most recent entries
