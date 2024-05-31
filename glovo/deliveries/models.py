from django.db import models
from main.models import Item
from users.models import Restaurant, Rider, BaseUser, BankAccount
from users.models import Customer
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import random
import json
# Create your models here.

class Order(models.Model):
  restaurant_id = models.ForeignKey(Restaurant, on_delete=models.DO_NOTHING, null=True, blank=True)
  customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True) #cascade: if user is deleted -> order is deleted
  rider_id = models.ForeignKey(Rider, on_delete=models.DO_NOTHING, null=True, blank=True)
  items = models.CharField(max_length=1000)
  prodotti = models.JSONField(default=[])
  price = models.FloatField(default=0.0)
  status = models.CharField(max_length=100)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  delivery_time = models.IntegerField(default = random.randint(0,30))

  def __str__(self):
    return str(str(self.items)+'-'+str(self.restaurant_id))
  
  @classmethod
  def get_orders_by_user(cls, role, username):
    try:
      try:
        user = Restaurant.objects.get(username=username)
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
          restaurant = BaseUser.get_user_by_role('ristorante', restaurant_username)
          customer = BaseUser.get_user_by_role('cliente', customer_username)
          #no particular logic -> just fetching the first available rider
          rider = Rider.objects.filter(status='available').first()
          #logic might eventually handle order creation without available riders -> delayed rider assignment
          ##Rider.notify_rider(rider)
          ##def notify_rider(rider)
          ##text = f"Ciao {rider.username},\n Hai una nuova consegna da effettuare!"
          ##send_mail(subject="Delivery", message=text, recipient_list=[rider.email], from_email='nerf.an120@gmail.com',  fail_silently=False)
          if rider is None:
              return None, "No riders available at the moment"
          #items_names = [item['name'] for item in items]
          #storing a json array -> needs to be updated in class diagrams
          serialized_items = json.dumps(items)     

          # Fetching the customer's bank account
          customer_content_type = ContentType.objects.get_for_model(customer)
          customer_bank_account = BankAccount.objects.get(content_type=customer_content_type, object_id=customer.pk)

          if customer_bank_account.credit < order_price:
              return None, "Insufficient Credit Balance! Top up your card first."
          
          new_order = Order(
              restaurant_id=restaurant,
              customer_id=customer,
              rider_id=rider,
              items=serialized_items,
              prodotti = items,
              price=float(order_price),
              status='in progress...'
          )
          if customer.get_balance() >= order_price:
            customer.update_balance(customer.get_balance() - order_price)
            customer.save()
            restaurant.update_balance( restaurant.get_balance() + float(order_price) * 80 / 100)
            restaurant.save()
            rider.update_balance( rider.get_balance() + float(order_price) * 20 / 100)
            rider.status = 'assigned'
            rider.save()
            new_order.save()
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
              user.status = "available"
              user.save()
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
      'price':self.price,
      'restaurant': Restaurant.objects.get(pk = self.restaurant_id.pk).username,
      'rider': Rider.objects.get(pk = self.rider_id.pk).username,
      'status':self.status,
      'prodotti':self.prodotti,
      'updated_at': self.updated_at,
      "delivery_time": self.delivery_time
    })
  

