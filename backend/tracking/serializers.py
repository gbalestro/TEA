from rest_framework import serializers
from .models import Person, Location, TimeLog

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
