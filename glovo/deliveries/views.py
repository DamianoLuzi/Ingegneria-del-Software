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
    orders_json = [order.to_json() for order in orders]
    return JsonResponse(orders_json, status = 200, safe=False)
  
  if request.method == 'POST':
    items = request.data['items']
    order_price = request.data['price']
    restaurant_username = items[0]['restaurant']
    customer_username = request.data['user']['username']

    new_order, error = Order.create_new_order(items, order_price, restaurant_username, customer_username)
    if new_order:
        return JsonResponse(new_order.to_json(), status=200)
    else:
        return HttpResponse({error}, status=500)

  if request.method == 'PUT':
    order_id = request.data['pk']   
    order, error = Order.update_order_status(order_id, user_role, user_name)
    if order:
        return JsonResponse(order.to_json(), status=200)
    else:
        return HttpResponse({error}, status=500)

@api_view(['GET'])
def order_details(request, id):
  order = Order.objects.get(pk = id)
  return JsonResponse(order.to_json(), status = 200, safe = False)