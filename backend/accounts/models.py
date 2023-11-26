from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models

class PetPalUserManager(BaseUserManager):
    def create_user(self, email, password, role, **extrafields):
        if not email:
            raise ValueError("Please provide a valid email address")
        
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extrafields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, role, **extrafields):
        user = self.create_user(
            email=email,
            password=password,
            role=role,
            **extrafields
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

# Create your models here.
class PetPalUser(AbstractUser):
    class Meta:
        verbose_name = 'PetPal User'
    
    class Role(models.TextChoices):
        SEEKER = "SEEKER", 'Seeker'
        SHELTER = "SHELTER", 'Shelter'

    base_role = Role.SEEKER
    username = None

    # Set during signup and "required"
    email = models.EmailField(max_length=255, unique=True) # email as username
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=7, choices=Role.choices, default=base_role)
    
    # Set during user profile update
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=50, blank=True)
    province = models.CharField(max_length=50, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    description = models.TextField(blank=True)
    is_notif_comment = models.BooleanField(default=True)
    is_notif_status = models.BooleanField(default=True)
    is_notif_petlisting = models.BooleanField(default=True)

    objects = PetPalUserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class ShelterManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=PetPalUser.Role.SHELTER)

class Shelter(PetPalUser):
    base_role = PetPalUser.Role.SHELTER
    shelter = ShelterManager()

    class Meta:
        proxy = True

class SeekerManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=PetPalUser.Role.SEEKER)

class Seeker(PetPalUser):
    base_role = PetPalUser.Role.SEEKER
    seeker = SeekerManager()

    class Meta:
        proxy = True