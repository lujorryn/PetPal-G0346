from django.core.serializers import serialize
from accounts.models import PetPalUserUser as User
from applications.models import Application
from comments.models import Comment
from petlistings.models import PetListing

def create_initial_data_json():
    """Create initial_data json file for testing."""
    # Users
    seeker1 = User.objects.create(email="seeker1@example.com", password="123", role=User.Role.SEEKER)
    seeker2 = User.objects.create(email="seeker2@example.com", password="123", role=User.Role.SEEKER)
    seeker3 = User.objects.create(email="seeker3@example.com", password="123", role=User.Role.SEEKER)
    shelter1 = User.objects.create(email="shelter1@example.com", password="123", role=User.Role.SHELTER)
    shelter2 = User.objects.create(email="shelter2@example.com", password="123", role=User.Role.SHELTER)
    shelter3 = User.objects.create(email="shelter3@example.com", password="123", role=User.Role.SHELTER)
    
    # Petlistings
    petlisting1 = PetListing.objects.create(name="Buddy", category="D", breed="Golden Retriver", age=3,
                                            gender="M", size="L", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very friendly dog.", owner=shelter1)
    petlisting2 = PetListing.objects.create(name="Lucky", category="D", breed="Golden Retriver", age=2,
                                            gender="M", size="L", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very playful dog.", owner=shelter2)
    petlisting3 = PetListing.objects.create(name="Fluffy", category="C", breed="N/A", age=3,
                                            gender="M", size="L", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very cute cat.", owner=shelter1)
    petlisting4 = PetListing.objects.create(name="Rocket", category="O", breed="Turtle", age=3,
                                            gender="M", size="L", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very fast turtle.", owner=shelter1)
    
    # Applications
    app1 = Application.objects.create(first_name="John", last_name="Doe", address="123 Main St", phone="123-456-7890",
                                      email="seeker1@example.com", contact_pref="E", pet_number=1, has_children=False,
                                      experience="EX", residence_type="C", status="P", seeker=seeker1, shelter=shelter1, petlisting=petlisting1)
    app2 = Application.objects.create(first_name="Jane", last_name="Doe", address="123 Main St", phone="123-456-7890",
                                      email="seeker2@example.com", contact_pref="E", pet_number=2, has_children=False,
                                      experience="EX", residence_type="C", status="P", seeker=seeker2, shelter=shelter2, petlisting=petlisting2)
    
    # Comments
    # Both comments and reviews goes here
    comment1 = Comment.objects.create(content="I would love to see Buddy in person!", is_author_seeker=True, seeker=seeker1, shelter=shelter1, is_review=False, application=app1)
    comment2 = Comment.objects.create(content="Sure!, what time are you avaliable to visit our shelter?", is_author_seeker=False, seeker=seeker1, shelter=shelter1, is_review=False, application=app1)
    comment3 = Comment.objects.create(content="Are you guys open on weekends?", is_author_seeker=True, seeker=seeker1, shelter=shelter1, is_review=False, application=app1)
    
    # Notifications should be created automatically when comments, petlistings, and applications are created
    
    data = serialize('json', [seeker1, seeker2, seeker3, shelter1, shelter2, shelter3, petlisting1, petlisting2, petlisting3, petlisting4, app1, app2, comment1, comment2, comment3])
    with open('initial_data.json', 'w') as f:
        f.write(data)