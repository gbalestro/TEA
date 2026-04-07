from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Person, Location, TimeLog
from .serializers import PersonSerializer, LocationSerializer, TimeLogSerializer

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class TimeLogViewSet(viewsets.ModelViewSet):
    queryset = TimeLog.objects.all()
    serializer_class = TimeLogSerializer

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

        logs = []
        for p_id in person_ids:
            log = TimeLog.objects.create(
                person_id=p_id,
                location_id=location_id,
                clock_in=clock_in_time,
                clock_out=clock_out_time,
                is_completed=bool(clock_out_time)
            )
            logs.append(TimeLogSerializer(log).data)

        return Response(logs, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def clock_out(self, request, pk=None):
        """Individual clock out"""
        log = self.get_object()
        log.clock_out = timezone.now()
        log.is_completed = True
        log.save()
        return Response(TimeLogSerializer(log).data)

    @action(detail=False, methods=['post'])
    def clock_out_all(self, request):
        """Clock out everyone who is currently active"""
        active_logs = TimeLog.objects.filter(clock_out__isnull=True)
        count = active_logs.count()
        for log in active_logs:
            log.clock_out = timezone.now()
            log.is_completed = True
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

        for p in people:
            p_logs = logs.filter(person=p)
            total_duration = sum((log.clock_out - log.clock_in).total_seconds() for log in p_logs)
            hours = total_duration / 3600.0
            total_hours += hours
            
            locais_count = p_logs.values('location').distinct().count()

            photo_url = request.build_absolute_uri(p.photo.url) if p.photo else None

            report_data.append({
                'id': p.id,
                'nome': p.name,
                'posicao': p.position or 'Colaborador',
                'foto': photo_url,
                'horas': hours,
                'locais': locais_count
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
                'clock_in': log.clock_in.strftime("%Y-%m-%dT%H:%M"),
                'clock_out': log.clock_out.strftime("%Y-%m-%dT%H:%M") if log.clock_out else None,
            })

        return Response({
            'total_hours': total_hours,
            'collaborators_count': people.count(),
            'average_hours': total_hours / people.count() if people.count() > 0 else 0,
            'breakdown': report_data,
            'raw_logs': raw_logs
        })

