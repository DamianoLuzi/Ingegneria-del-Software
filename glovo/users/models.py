from django.db import models

# Create your models here.

class BaseUser(models.Model):
  is_customer = models.BooleanField(default=False)
  is_restaurant = models.BooleanField(default=False)
  is_rider = models.BooleanField(default=False)
  username = models.CharField(max_length=100, blank=True, null=True, default="user")

  def __str__(self):
    if self.is_customer:
      return 'customer '+str(self.pk)#+' - '+str(self.customer)
    elif self.is_restaurant:
      return 'restaurant '+str(self.pk)#+' - '+str(self.restaurant)
    else:
      return 'rider '+str(self.pk)#+' - '+str(self.rider)
    
class Customer(models.Model):
  user = models.OneToOneField(BaseUser, on_delete=models.CASCADE, primary_key=True, default=None)
  username = models.CharField(max_length=100, blank=True, null=True, default="customer")
  password = models.CharField(max_length=100, default='')
  email = models.CharField(max_length=100)
  balance = models.FloatField(default=0.0)
  phone = models.CharField(max_length=20, default="00000", null=True, blank =True)
  posizione = models.CharField(max_length=20, default="", null=True, blank =True)
  def __str__(self):
    return str(self.username)
  
class Restaurant(models.Model):
  user = models.OneToOneField(BaseUser, on_delete=models.CASCADE, primary_key=True, default=None)
  username = models.CharField(max_length=100, blank=True, null=True, default="restaurant")
  name = models.CharField(max_length=100, blank=True, default='restaurant')
  password = models.CharField(max_length=100, default='')
  email = models.CharField(max_length=100)
  balance = models.FloatField(default=0.0)
  position = models.CharField(max_length=100)
  phone = models.CharField(max_length=20,default="00000000")
  orarioApertura=models.DateField(blank=True, null=True)
  orarioChiusura=models.DateField(blank=True, null=True)
  def __str__(self):
    return str(self.name+' '+str(self.balance)) 
  
class Rider(models.Model):
  user = models.OneToOneField(BaseUser, on_delete=models.CASCADE, primary_key=True, default=None)
  username = models.CharField(max_length=100, blank=True, null=True, default="rider")
  password = models.CharField(max_length=100, default='')
  status = models.CharField(max_length=100)
  position  = models.CharField(max_length=100)
  balance = models.FloatField()
  phone = models.CharField(max_length=20,default="00000000", null=True, blank=True)
  def __str__(self):
    return str(str(self.user)+ ' '+ self.status)