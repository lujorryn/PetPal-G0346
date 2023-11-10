from django.core.management.base import BaseCommand
from applications.models import Application
from django.core.management import call_command
from accounts.models import PetPalUser
from petlistings.models import PetListing

import random
from faker import Faker

fake = Faker()

class Command(BaseCommand):
    def handle(self, *args, **options):
        if not PetPalUser.objects.exists():
            call_command("createusers")

        if not PetListing.objects.exists():
            call_command("create_petlisting")

        listing = PetListing.objects.first()
        seeker = PetPalUser.objects.first()

        Application.objects.create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            address=fake.address(),
            phone=fake.phone_number(),
            email=seeker.email,
            contact_pref=random.choice(['P', 'T', 'E']),
            pet_number=random.randint(1, 10),
            has_children=random.choice([True, False]),
            experience=random.choice(['EX', 'IN', 'NE']),
            residence_type=random.choice(['C', 'A', 'H']),
            status=random.choice(['P', 'A', 'D', 'W']),
            seeker=seeker,
            petlisting=listing,
        )
        print(listing.pk)
        self.stdout.write(self.style.SUCCESS(f'Dummy application created successfully'))
