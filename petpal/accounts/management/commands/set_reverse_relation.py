from django.core.management.base import BaseCommand
from comments.models import Comment

class Command(BaseCommand):
    help = 'Set reverse relation for comments'

    def handle(self, *args, **options):
        comments = Comment.objects.all()

        for comment in comments:
            comment.notification.comment_set.add(comment)
            comment.save()

        self.stdout.write(self.style.SUCCESS('Reverse relation set successfully'))