from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('staff', 'Staff'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Person(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nome Completo")
    position = models.CharField(max_length=100, verbose_name="Posição/Cargo", null=True, blank=True)
    email = models.EmailField(unique=True, verbose_name="E-mail", null=True, blank=True)
    phone = models.CharField(max_length=20, verbose_name="Telefone", null=True, blank=True)
    photo = models.ImageField(upload_to='avatars/', null=True, blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Valor Hora")
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
    LOG_TYPE_CHOICES = [
        ('work', 'Work'),
        ('sick', 'Sick Day'),
        ('holiday', 'Holiday'),
        ('missing', 'Missing'),
    ]
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='logs')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='logs')
    clock_in = models.DateTimeField(verbose_name="Entrada")
    clock_out = models.DateTimeField(null=True, blank=True, verbose_name="Saída")
    is_completed = models.BooleanField(default=False)
    comments = models.TextField(null=True, blank=True, verbose_name="Observações")
    log_type = models.CharField(max_length=10, choices=LOG_TYPE_CHOICES, default='work', verbose_name="Tipo")

    def __str__(self):
        return f"{self.person.name} @ {self.location.name} ({self.clock_in})"

    class Meta:
        verbose_name = "Registro de Tempo"
        verbose_name_plural = "Registros de Tempo"
        ordering = ['-clock_in']
class AuditEntry(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Usuário")
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50) # TimeLog, Person, etc.
    object_id = models.IntegerField(null=True)
    object_repr = models.CharField(max_length=255) # e.g. "Joao @ Cafe (10:00)"
    changes = models.JSONField(null=True, blank=True) # {"old": {...}, "new": {...}}
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro de Auditoria"
        verbose_name_plural = "Registros de Auditoria"
        ordering = ['-timestamp']
