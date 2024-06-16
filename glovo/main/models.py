from django.db import models
from users.models import  Restaurant
# Create your models here.

class Item(models.Model):
  restaurant=models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True, blank = True)  #if restaurant is deleted -> item is deleted
  price = models.FloatField()
  name = models.CharField(max_length=100,default='item')
  description = models.CharField(max_length=100, default='')
  def __str__(self):
    return str(self.name+' - '+str(self.restaurant))
  
  def to_json(self):
    return ({  
      'pk': str(self.pk) ,
      'name': self.name,
      'price':self.price,
      'description': self.description,
      'restaurant': Restaurant.objects.get(pk = self.restaurant.pk).username,
    })
  
  @classmethod
  def delete_item(cls,id):
    try:
      item = cls.objects.get(pk = id)
      aux = item
      item.delete()
      return aux
    except Exception as e:
      return None
  @classmethod
  def get_restaurant_items(cls,restaurant_name):
    try:
      res = Restaurant.objects.get(name = restaurant_name)
      products = cls.objects.filter(restaurant = res.pk)
      if products is not None:
        return products
    except Restaurant.DoesNotExist or cls.DoesNotExist:
      return None
  
  @classmethod
  def add_new_product(cls,restaurant_name, data):
    try:
      res = Restaurant.objects.get(username = restaurant_name)
      newProduct = cls(
        restaurant_id = res.pk,
        name = data['name'],
        description = data['description'],
        price= data['price']
      )
      newProduct.save()
      return newProduct
    except Exception:
      return None
    
  @classmethod
  def update_product(cls, item_id, restaurant_name, data):
    try:
      print(restaurant_name)
      res = Restaurant.objects.get(username = restaurant_name)
      item = cls.objects.get(pk = item_id)
      item.restaurant = res
      item.name = data['name']
      item.description = data['description']
      item.price= data['price']
      item.save()
      return item
    except Exception as e:
      print("PUT exception\n", str(e))
      return None
      


  
