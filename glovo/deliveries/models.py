from django.db import models
from main.models import Item
from users.models import Restaurant, Rider
from users.models import Customer

# Create your models here.

class Order(models.Model):
  restaurant_id = models.ForeignKey(Restaurant, on_delete=models.DO_NOTHING, null=True, blank=True)
  customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True) #cascade: if user is deleted -> order is deleted
  rider_id = models.ForeignKey(Rider, on_delete=models.DO_NOTHING, null=True, blank=True)
  items = models.CharField(max_length=1000)
  price = models.FloatField(default=0.0)
  destination= models.CharField(max_length=100)
  status = models.CharField(max_length=100)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  def __str__(self):
    return str(str(self.items)+'-'+str(self.restaurant_id)+'-'+str(self.destination))
  
class OrderDetails:
  order = models.ForeignKey(Order, on_delete=models.CASCADE)
  item = models.ForeignKey(Item, on_delete=models.CASCADE)
