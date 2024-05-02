from django.db import models
from django.contrib.auth.models import AbstractUser,User
from datetime import datetime
from users.models import BaseUser, Customer, Restaurant
# Create your models here.

""" 
  class BaseUser(models.Model):
  is_customer = models.BooleanField(default=False)
  is_restaurant = models.BooleanField(default=False)
  is_rider = models.BooleanField(default=False)

  def __str__(self):
    if self.is_customer:
      return 'customer '+str(self.pk)#+' - '+str(self.customer)
    elif self.is_restaurant:
      return 'restaurant '+str(self.pk)#+' - '+str(self.restaurant)
    else:
      return 'rider '+str(self.pk)#+' - '+str(self.rider) """

""" class Customer(models.Model):
  user = models.OneToOneField(BaseUser, on_delete=models.CASCADE, primary_key=True)
  username = models.CharField(max_length=100, blank=True, default='Customer')
  password = models.CharField(max_length=100, default='')
  email = models.CharField(max_length=100)
  balance = models.FloatField(default=0.0)
  def __str__(self):
    return str(self.username) """ 

""" class Restaurant(BaseUser):
  name = models.CharField(max_length=100, blank=True, default='restaurant')
  password = models.CharField(max_length=100, default='')
  email = models.CharField(max_length=100)
  balance = models.FloatField(default=0.0)
  position = models.CharField(max_length=100)
  def __str__(self):
    return str(self.name+' '+self.balance) 
  
class Rider(BaseUser):
  username = models.CharField(max_length=100, blank=True, default='rider')
  status = models.CharField(max_length=100)
  position  = models.CharField(max_length=100)
  balance = models.FloatField()
  def __str__(self):
    return str(self.username+ ' '+ self.status) """


""" class Order(models.Model):
  restaurant_id = models.ForeignKey(Restaurant, on_delete=models.DO_NOTHING)
  customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE) #cascade: if user is deleted -> order is deleted
  rider_id = models.ForeignKey(Rider, on_delete=models.DO_NOTHING)
  items = models.CharField(max_length=1000)
  price = models.FloatField(default=0.0)
  destination= models.CharField(max_length=100)
  status = models.CharField(max_length=100)
  payment = models.ForeignKey(Payment, on_delete=models.CASCADE, blank=True, null= True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  def __str__(self):
    return str(str(self.items)+'-'+str(self.restaurant_id)+'-'+str(self.destination)) """
  

class Item(models.Model):
  restaurant=models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True, blank = True)  #if restaurant is deleted -> item is deleted
  price = models.FloatField()
  name = models.CharField(max_length=100,default='item')
  description = models.CharField(max_length=100, default='')
  def __str__(self):
    return str(self.name+' - '+str(self.restaurant))

""" class OrderDetails:
  order = models.ForeignKey(Order, on_delete=models.CASCADE)
  item = models.ForeignKey(Item, on_delete=models.CASCADE) """

  