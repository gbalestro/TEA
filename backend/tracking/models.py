from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=100) # Ex: Cozinha, Escritório

    def __str__(self):
        return self.name

class TimeLog(models.Model):
    # Relacionamento com Person (Epic: Goal Management)
    who = models.ManyToManyField(Person, related_name='logs')
    where = models.ForeignKey(Location, on_delete=models.CASCADE)
    clock_in = models.DateTimeField(auto_now_add=True)
    clock_out = models.DateTimeField(null=True, blank=True)
    
    # Para marcar como concluído ou importante
    is_completed = models.BooleanField(default=False)