from django.contrib import admin
from users.models import BaseUser, Customer, Rider, Restaurant
from .models import Item
from deliveries.models import Order
# Register your models here.

admin.site.register(Item)
