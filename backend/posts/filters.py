import django_filters
from .models import Post

class PostFilter(django_filters.FilterSet):
    author__email = django_filters.CharFilter(field_name="author__email", lookup_expr="iexact")

    class Meta:
        model = Post
        fields = ['type', 'author__email']
