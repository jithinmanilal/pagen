from django.contrib import admin
from .models import User, SavePassword

# Register your models here.
admin.site.register(User)
admin.site.register(SavePassword)