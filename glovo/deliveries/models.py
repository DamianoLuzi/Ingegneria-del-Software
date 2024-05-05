from django.db import models
from main.models import Item
from users.models import Restaurant, Rider, BaseUser
from users.models import Customer
from django.core.exceptions import ObjectDoesNotExist
import random
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
    print("models orders\n", orders)
    return orders
    """ try: 
      user = BaseUser.get_user_by_role(role, username)
      #print("filter query\n\n",**f"{role}_id")
      print("Order user\n", user.to_json())
      try:
        roles_dict = {
          'cliente':'customer',
          'ristorante':'restaurant',
          'rider':'rider'
        }
        r = roles_dict['role']
        try:
          orders = cls.objects.filter(restaurant_id = user.pk)
        except ObjectDoesNotExist:
          try:
            orders = cls.objects.filter(customer_id = user.pk)
          except ObjectDoesNotExist:
            try:
              orders = cls.objects.filter(rider_id = user.pk)
            except ObjectDoesNotExist:
              return None
        #orders = Order.objects.filter(**{f"{r}_id": user.pk})
        print("fetched orders\n", orders)
        if orders is not None:
          return orders
      except Order.DoesNotExist:
        return []
    except Exception:
      return None """
    
  def to_json(self):
    print("cstmr id\n",self.customer_id.pk)
    print("\ncustomer\n",Customer.objects.get(pk = self.customer_id.pk))
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
