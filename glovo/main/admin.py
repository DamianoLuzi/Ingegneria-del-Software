from django.contrib import admin
from .models import BaseUser, Customer, Item, Rider, Restaurant, Order
# Register your models here.

admin.site.register(Order)
admin.site.register(Restaurant)
admin.site.register(Rider)
admin.site.register(Item)
admin.site.register(Customer)
admin.site.register(BaseUser)