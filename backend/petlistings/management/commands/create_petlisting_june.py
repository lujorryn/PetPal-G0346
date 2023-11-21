import random
from django.core.management.base import BaseCommand
from petlistings.models import PetListing
from accounts.models import PetPalUser

class Command(BaseCommand):
    help = 'Create a dummy pet listing'

    def handle(self, *args, **options):
        if not PetPalUser.objects.exists():
            self.stdout.write(self.style.ERROR('No users found. Please create some users first.'))

        # Choose a random user as the owner
        owner = PetPalUser.objects.order_by('?').first()

        PetListing.objects.create(
            name='Dummy Pet',
            category=random.choice(['D', 'C', 'O']),
            breed='Mixed Breed',
            age=random.randint(1, 10),
            gender=random.choice(['M', 'F', 'X']),
            size=random.choice(['L', 'M', 'S']),
            status=random.choice(['AV', 'AD', 'PE', 'WI']),
            med_history='No known medical history',
            behaviour='Friendly and playful',
            special_needs='None',
            description='This is a dummy pet listing for testing purposes.',
            owner=owner
        )