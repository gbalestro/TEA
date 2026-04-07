
from django.db import models
from django.utils import timezone

class Person(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nome Completo")
    position = models.CharField(max_length=100, verbose_name="Posição/Cargo", null=True, blank=True)
    email = models.EmailField(unique=True, verbose_name="E-mail", null=True, blank=True)
    phone = models.CharField(max_length=20, verbose_name="Telefone", null=True, blank=True)
    photo = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Pessoa"
        verbose_name_plural = "Pessoas"

class Location(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nome do Local")
    address = models.CharField(max_length=255, verbose_name="Endereço", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Local"
        verbose_name_plural = "Locais"

class TimeLog(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='logs')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='logs')
    clock_in = models.DateTimeField(verbose_name="Entrada")
    clock_out = models.DateTimeField(null=True, blank=True, verbose_name="Saída")
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.person.name} @ {self.location.name} ({self.clock_in})"

    class Meta:
        verbose_name = "Registro de Tempo"
        verbose_name_plural = "Registros de Tempo"
        ordering = ['-clock_in']