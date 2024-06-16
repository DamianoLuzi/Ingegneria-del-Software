from django.contrib import admin
from .models import Customer, Restaurant, Rider, BankAccount

# Register your models here.

admin.site.register(Customer)
#admin.site.register(BaseUser)
admin.site.register(Rider)
admin.site.register(Restaurant)
admin.site.register(BankAccount)
