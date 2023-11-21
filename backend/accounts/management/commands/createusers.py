from django.core.management.base import BaseCommand, CommandError
from accounts.models import PetPalUser, Shelter, Seeker

def _create_users():
    PetPalUser.objects.all().delete()
    PetPalUser.objects.create_user(email="test@utoronto.ca", password="123", role=PetPalUser.Role.SEEKER)
    PetPalUser.objects.create_user(email="test@gmail.ca", password="123", role=PetPalUser.Role.SEEKER)
    PetPalUser.objects.create_user(email="test1@utoronto.ca", password="123", role=PetPalUser.Role.SHELTER)
    PetPalUser.objects.create_user(email="test2@utoronto.ca", password="123", role=PetPalUser.Role.SHELTER)
    PetPalUser.objects.create_user(email="test3@utoronto.ca", password="123", role=PetPalUser.Role.SHELTER)
    num_users = PetPalUser.objects.all().count()
    num_shelter = Shelter.shelter.all().count()
    num_seeker = Seeker.seeker.all().count()
    return  num_users, num_shelter, num_seeker

class Command(BaseCommand):
    help = 'Create some random users for petpal'
    
    def handle(self, *_args, **_options):
        num_users, num_shelter, num_seeker = _create_users()
        self.stdout.write(self.style.SUCCESS(f'Created {num_users} users, {num_shelter} shelters and {num_seeker} seekers'))