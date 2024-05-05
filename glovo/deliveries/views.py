from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from main.models import Item
from users.models import Restaurant, Rider
from users.models import Customer, BaseUser
from deliveries.models import Order
import json
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse

from datetime import datetime
# Create your views here.
@api_view(['GET','POST','PUT'])
def orders(request,user_role, user_name):
  print("orders request", request.data)
  
  if request.method == 'GET':
    orders = Order.get_orders_by_user(user_role, user_name)
    print("GET orders\n", orders)
    serialized_orders = serialize('json', orders)
    orders_json = [order.to_json() for order in orders]
    #return HttpResponse(serialized_orders, status = 200)
    return JsonResponse(orders_json, status = 200, safe=False)
  
  if request.method == 'POST':
    print("orders POST req ", request.data)
    items = request.data['items']
    order_price = request.data['price']
    print("items", items[0], type(items[0]))
    print("order price", order_price, type(order_price))
    restaurant = Restaurant.objects.get(username = items[0]['restaurant'])
    user = Customer.objects.get(username = request.data['user']['username'])
    rider = Rider.objects.filter(status = 'available').first()
    if rider is None: return HttpResponse({'No riders available at the moment'}, status = 500)
    print("user", user)
    print("restaurant", restaurant)
    try:
      items_names = [item['name'] for item in items]
      serialized_items = json.dumps(items_names)
      print("ser it", serialized_items, type(serialized_items))
      new_order = Order(
      restaurant_id = restaurant,
      customer_id = user,
      rider_id = rider,
      items = serialized_items,
      price = float(order_price),
      status='in progress...',
      destination = '')
      if user.balance >= order_price:
        new_order.save()
        print("new order", new_order)
        #updating balances and status
        user.balance = user.balance - order_price
        user.save()
        restaurant.balance = restaurant.balance + order_price * 80/100
        restaurant.save()
        rider.balance = rider.balance + order_price * 20 /100
        rider.status = 'assigned'
        rider.save()
      else:
        return HttpResponse({'Insufficient Credit Balance,Top up your card first!'}, status = 500)
      return HttpResponse(new_order, status = 200)
    except Exception as e:
      print("ERROR ", str(e))
      return HttpResponse({'error':str(e)},status=500)
  if request.method == 'PUT':
    print("orders PUT", request.data)
    user_data = serialize('json', [user])
    print("user PUT", user_data)
    order = Order.objects.get(pk = request.data['pk'])
    if isinstance(user, Restaurant):  ##need to check that it is the irght restaurant as well
      order.status = 'in transit'
    elif isinstance(user, Rider):  ##need to check that it is the irght rider as well
      order.status = 'delivered'
    else: ##need to check that it is the irght user as well
      order.status = 'completed'
    order.save()
    serialized_order = serialize('json', [order])
    return HttpResponse(serialized_order, status=200)

@api_view(['GET'])
def order_details(request, id):
  order = Order.objects.get(pk = id)
  return JsonResponse(order.to_json(), status = 200, safe = False)