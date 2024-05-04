from django.db import models
from django.contrib.auth.models import AbstractUser,User
from datetime import datetime
from users.models import BaseUser, Customer, Restaurant
# Create your models here.

class Item(models.Model):
  restaurant=models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True, blank = True)  #if restaurant is deleted -> item is deleted
  price = models.FloatField()
  name = models.CharField(max_length=100,default='item')
  description = models.CharField(max_length=100, default='')
  def __str__(self):
    return str(self.name+' - '+str(self.restaurant))


  