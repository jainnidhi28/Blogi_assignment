from django.db import models
from django.conf import settings

class Post(models.Model):
    BLOG_TYPE_CHOICES = [
        ("tech", "Tech"),
        ("travel", "Travel"),
        ("food", "Food"),
        ("education", "Education"),
        ("lifestyle", "Lifestyle"),
    ]
    title = models.CharField(max_length=255)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=BLOG_TYPE_CHOICES, default="tech")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)

    def __str__(self):
        return self.title
