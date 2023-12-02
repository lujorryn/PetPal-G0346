import os
import django
# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "petpal.settings")
django.setup()

from django.core.serializers import serialize
from accounts.models import PetPalUser as User
from applications.models import Application
from comments.models import Comment
from petlistings.models import PetListing
from blogposts.models import BlogPost

def create_initial_data_json():
    print("Creating initial_data.json...")
    """Create initial_data json file for testing."""
    # Users
    seeker1 = User.objects.create_user(email="seeker1@example.com", password="123", role=User.Role.SEEKER)
    seeker2 = User.objects.create_user(email="seeker2@example.com", password="123", role=User.Role.SEEKER)
    seeker3 = User.objects.create_user(email="seeker3@example.com", password="123", role=User.Role.SEEKER)
    shelter1 = User.objects.create_user(email="shelter1@example.com", password="123", first_name="shelter 1", role=User.Role.SHELTER)
    shelter2 = User.objects.create_user(email="shelter2@example.com", password="123", first_name="shelter 2", role=User.Role.SHELTER)
    shelter3 = User.objects.create_user(email="shelter3@example.com", password="123", first_name="shelter 3", role=User.Role.SHELTER)
    
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
    petlisting5 = PetListing.objects.create(name="Pumpkin", category="C", breed="N/A", age=5,
                                            gender="M", size="L", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very cute cat.", owner=shelter3)
    petlisting6 = PetListing.objects.create(name="Pumpkin Pie", category="C", breed="N/A", age=7,
                                            gender="F", size="M", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very cute cat.", owner=shelter2)
    petlisting7 = PetListing.objects.create(name="Dori", category="D", breed="N/A", age=1,
                                            gender="F", size="S", med_history="None", behaviour="Friendly",
                                            special_needs="", description="A very cute dog.", owner=shelter1)
    
    # Applications
    app1 = Application.objects.create(first_name="John", last_name="Doe", address="123 Main St", phone="123-456-7890",
                                      email="seeker1@example.com", contact_pref="E", pet_number=1, has_children=False,
                                      experience="EX", residence_type="C", status="P", seeker=seeker1, shelter=shelter1, petlisting=petlisting1)
    app2 = Application.objects.create(first_name="John", last_name="Doe", address="123 Main St", phone="123-456-7890",
                                      email="seeker1@example.com", contact_pref="E", pet_number=1, has_children=False,
                                      experience="EX", residence_type="C", status="P", seeker=seeker1, shelter=shelter2, petlisting=petlisting2)
    app3 = Application.objects.create(first_name="Jane", last_name="Doe", address="123 Main St", phone="123-456-7890",
                                      email="seeker2@example.com", contact_pref="E", pet_number=2, has_children=False,
                                      experience="EX", residence_type="C", status="P", seeker=seeker2, shelter=shelter2, petlisting=petlisting2)
    
    # Comments
    # Both comments and reviews goes here
    comment1 = Comment.objects.create(content="I would love to see Buddy in person!", is_author_seeker=True, seeker=seeker1, shelter=shelter1, is_review=False, application=app1)
    comment2 = Comment.objects.create(content="Sure!, what time are you avaliable to visit our shelter?", is_author_seeker=False, seeker=seeker1, shelter=shelter1, is_review=False, application=app1)
    comment3 = Comment.objects.create(content="Are you guys open on weekends?", is_author_seeker=True, seeker=seeker1, shelter=shelter1, is_review=False, application=app1)
    comment4 = Comment.objects.create(content="Hi! May I get an update on my application?", is_author_seeker=True, seeker=seeker1, shelter=shelter2, is_review=False, application=app2)
    review1 = Comment.objects.create(content="Awesome!", is_author_seeker=True, seeker=seeker1, shelter=shelter1, is_review=True, rating=5)
    review2 = Comment.objects.create(content="I would definitely visit again", is_author_seeker=True, seeker=seeker2, shelter=shelter2, is_review=True, rating=5)
    review3 = Comment.objects.create(content="Very long response time to messages", is_author_seeker=True, seeker=seeker1, shelter=shelter3, is_review=True, rating=3)
    review4 = Comment.objects.create(content="We're very sorry for your inconvenience, we will try to improve next time.", is_author_seeker=False, seeker=seeker1, shelter=shelter3, is_review=True)

    blogpost1 = BlogPost.objects.create(title="Paws and Play: Nurturing a Joyful Bond with Your Furry Friend", content="Welcome to the enchanting world of pet companionship, where every paw-step and playful gesture contributes to the heartwarming symphony of a truly special connection. In the hustle and bustle of our daily lives, our four-legged friends bring a sense of joy, companionship, and unconditional love that is truly unparalleled. Here at our shelter, we are dedicated to providing a comprehensive guide to foster a paw-sitively happy and healthy bond with your furry friend.\nAt the core of every vibrant and active pet is a well-balanced diet and proper healthcare. Delve into our rich repository of insights on pet nutrition, exploring tailored recommendations for different breeds and life stages. From deciphering pet food labels to understanding the significance of routine veterinary care, we aim to empower you with the knowledge needed to keep your pet in the best shape possible.\nA harmonious bond with your pet extends beyond the basics of nutrition and healthcare. Discover a myriad of engaging activities and games designed not only to keep your pets physically stimulated but also to strengthen the emotional connection you share. Whether it's embarking on outdoor adventures, experimenting with interactive toys, or diving into training sessions, our blog is a treasure trove of ideas to keep tails wagging and spirits high.\nIn the vast tapestry of pet companionship, each thread weaves a unique and heartening tale. Join us as we share inspiring stories of rescued pets finding their forever homes, illustrating the transformative impact of these extraordinary relationships on both pets and their loving parents. These narratives serve as a reminder of the profound joy that adopting a furry friend can bring into our lives and the immeasurable positive change that comes with giving a home to a pet in need.\nAs you navigate the delightful journey of pet parenting, our blog strives to be your trusted companion. Beyond being a mere resource, it is a community hub where passionate pet lovers come together to celebrate the highs, navigate the challenges, and revel in the fulfillment that comes with having a furry friend by your side. Welcome to a world where every tail wag and contented purr serves as a testament to the enduring melody of unconditional love. Explore, learn, and be inspired on your quest to foster a paw-sitively happy and healthy bond with your cherished companion.", author=shelter1)
    blogpost2 = BlogPost.objects.create(title="Tales and Tidbits: A Pet-centric Journey into Furry Bliss", content="Step into a world where wagging tails, playful antics, and boundless affection shape the narrative of our blog. At our shelter, we invite you to embark on a heartwarming journey through the realms of pet care hacks, heartening tales, and expert advice, all designed to enhance the lives of you and your beloved pets. Whether you're a seasoned pet parent or a newcomer to the world of furry companionship, our blog is a haven where the shared language of love unites us all.\nDiscover the magic in simplicity as we unravel a collection of pet care hacks aimed at making your life as a pet parent more enjoyable and stress-free. From grooming shortcuts that keep your furry friend looking fabulous to clever feeding solutions that cater to their nutritional needs, our blog is your go-to source for creative yet practical tips. Dive into a world where pet care becomes a joyful ritual, allowing you more time to savor the moments of companionship that make your connection with your pet truly special.\nCelebrate the enchanting stories of companionship that define the heart and soul of our pet-centric community. From rescued pets finding their forever homes to the everyday adventures that create lasting memories, our blog is a storytelling sanctuary. These tales resonate with the universal emotions of love, loyalty, and the unique bond shared between pets and their human companions. Join us as we navigate the emotional landscape of pet parenthood, where each story unfolds as a testament to the extraordinary connections forged with our furry friends.\nAs you reach the end of this blog, we extend an invitation to join our community of pet enthusiasts. Our shelter is not just a repository of information; it's a shared space where experiences are exchanged, and the joys of pet parenthood are celebrated. Let the tales and tidbits inspire you, the hacks simplify your routine, and the expert advice empower you on your journey as a pet parent. Welcome to a world where every wag, purr, and paw print contributes to the narrative of blissful companionship. Here's to creating more heartwarming chapters together in the tapestry of our furry friends' lives!", author=shelter1)
    blogpost3 = BlogPost.objects.create(title="Paws & Pages: A Journey into Pet Enchantment", content="Welcome to a world where pet parenthood transforms into an enchanting adventure. At our shelter, we invite you to unleash a realm of pet-centric wisdom, where every post is a delightful journey filled with practical tips, heartwarming anecdotes, and a touch of pet magic. Whether you're a dedicated pet parent or considering the joy of furry companionship, our blog is your compass to navigate the intricacies of pet care, share in the joyous tales of pet-human bonds, and discover the enchantment that pets bring into our lives.\nEmbark on a paw-some adventure with each blog post, where practical tips are the compass guiding you through the maze of pet care. Dive into a wealth of knowledge designed to make your journey as a pet parent smoother and more enjoyable. From grooming hacks that make bath time a breeze to nutrition insights that cater to your pet's well-being, our blog is your trusted companion in navigating the day-to-day joys and challenges of life with your furry friends. Each post is crafted to be not just informative but a source of inspiration, making your pet-centric adventure all the more magical.\nAs we conclude this chapter, we extend an invitation to join our community of pet enthusiasts. Our shelter is not just a virtual space; it's a sanctuary where pet magic is celebrated, and the wonders of companionship are explored. May the practical tips enhance your pet parenting skills, the anecdotes warm your heart, and the sprinkle of pet magic make each post a joy to explore. Here's to a continuing journey filled with wagging tails, soft purrs, and the enduring enchantment of the pet-human bond. Embrace the magic of pet parenthood with us, one paw print at a time!", author=shelter2)
    
    # Notifications should be created automatically when comments, petlistings, and applications are created
    
    # If you want to create initial_data.json, uncomment the following lines as well as comment out "python3 petpal/script.py" in startup.sh and run "python3 petpal/script.py" in bash
    # data = serialize('json', [seeker1, seeker2, seeker3, shelter1, shelter2, shelter3, petlisting1, petlisting2, petlisting3, petlisting4, app1, app2, comment1, comment2, comment3])
    # with open('initial_data.json', 'w') as f:
    #     f.write(data)
        
if __name__ == '__main__':
    create_initial_data_json()