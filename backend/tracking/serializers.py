from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Person, Location, TimeLog, UserProfile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        role = profile_data.get('role', 'staff')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        # Create profile
        UserProfile.objects.get_or_create(user=user, defaults={'role': role})
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        role = profile_data.get('role')
        if role:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.role = role
            profile.save()
        
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
            
        return super().update(instance, validated_data)

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class TimeLogSerializer(serializers.ModelSerializer):
    person_details = PersonSerializer(source='person', read_only=True)
    location_details = LocationSerializer(source='location', read_only=True)

    class Meta:
        model = TimeLog
        fields = '__all__'
