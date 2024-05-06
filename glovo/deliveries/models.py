from django.db import models
from main.models import Item
from users.models import Restaurant, Rider, BaseUser
from users.models import Customer
from django.core.exceptions import ObjectDoesNotExist
import random
import json
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
  
  @classmethod
  def get_orders_by_user(cls, role, username):
    try:
      try:
        user = Restaurant.objects.get(name=username)
        orders = cls.objects.filter(restaurant_id = user.pk)
      except ObjectDoesNotExist:
        try:
          user = Customer.objects.get(username=username)
          orders = cls.objects.filter(customer_id = user.pk)
        except ObjectDoesNotExist:
          try:
            user = Rider.objects.get(username=username)
            orders = cls.objects.filter(rider_id = user.pk)
          except ObjectDoesNotExist:
            return None     
    except Exception as e:
      return None
    return orders
    
  @classmethod
  def create_new_order(cls, items, order_price, restaurant_username, customer_username):
      try:
          restaurant = Restaurant.objects.get(username=restaurant_username)
          customer = Customer.objects.get(username=customer_username)
          #no particular logic -> just fetching the first available rider
          rider = Rider.objects.filter(status='available').first()
          #logic might eventually handle order creation without available riders -> delayed rider assignment
          if rider is None:
              return None, "No riders available at the moment"
          
          items_names = [item['name'] for item in items]
          serialized_items = json.dumps(items_names)
          
          new_order = cls.objects.create(
              restaurant_id=restaurant,
              customer_id=customer,
              rider_id=rider,
              items=serialized_items,
              price=float(order_price),
              status='in progress...',
              destination=''
          )
          if customer.balance >= order_price:
            customer.balance -= float(order_price)
            customer.save()
            restaurant.balance += float(order_price) * 80 / 100
            restaurant.save()
            rider.balance += float(order_price) * 20 / 100
            rider.status = 'assigned'
            rider.save()
            return new_order, None
          else:
            return None, "Insufficient Credit Balance! Top up your card first."
      except Exception as e:
          return None, str(e)
      
  @classmethod
  def update_order_status(cls, order_id, user_role, username):
      try:
          order = cls.objects.get(pk=order_id)
          user = BaseUser.get_user_by_role(user_role, username)
          if isinstance(user, Restaurant):
              order.status = 'in transit'
          elif isinstance(user, Rider):
              order.status = 'delivered'
          else:
              order.status = 'completed'
          order.save()
          return order, None
      except Exception as e:
          return None, str(e)
    
  def to_json(self):
    return ({  
      'pk': str(self.pk) ,
      'created_at': self.created_at,
      'customer': Customer.objects.get(pk = self.customer_id.pk).username,
      'destination': self.destination,
      'items': self.items,
      'price':self.price,
      'restaurant': Restaurant.objects.get(pk = self.restaurant_id.pk).username,
      'rider': Rider.objects.get(pk = self.rider_id.pk).username,
      'status':self.status,
      'updated_at': self.updated_at,
      "delivery_time": random.randint(0,30)
    })
  
class OrderDetails:
  order = models.ForeignKey(Order, on_delete=models.CASCADE)
  item = models.ForeignKey(Item, on_delete=models.CASCADE)
