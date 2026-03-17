from django.contrib import admin
from .models import Person, Location, TimeLog
# Register your models here.
admin.site.register(Person)
admin.site.register(Location)
admin.site.register(TimeLog)