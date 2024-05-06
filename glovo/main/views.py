from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from main.models import Item
from users.models import Restaurant, Rider, Customer, BaseUser
from deliveries.models import Order
import json
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from datetime import datetime
@api_view(['GET'])
def home(request):
  if request.method == 'GET':
    return Response({"message": 'Welcome back!'})
  
@api_view(['GET'])
def restaurants(request, **kwargs):
  if request.method == 'GET':
    restaurants = Restaurant.objects.all()
    restaurants_json = [restaurant.to_json() for restaurant in restaurants]
    print("res JSON", restaurants_json)
    return JsonResponse(restaurants_json, status=200, safe=False)
  
@api_view(['GET'])
def users(request):
  try:
    users = Order.objects.all()
    print("users")
    return HttpResponse(
      serialize('json',users), status= 200)
  except:
    return Response({"message":'unable to fetch'})

  
@api_view(['GET'])
def items(request):
  try:
    items = Order.objects.all()
    data = serialize('json', items)
    print("items", data)
    return HttpResponse(data, status= 200)
  except:
    return Response({"message":'unable to fetch'})
  
@api_view(['GET', 'POST'])
def menu(request,restaurant_name):
  if request.method == "GET":
    try:
      products = Item.get_restaurant_items(restaurant_name)
      if products is not None:
        products_json = [product.to_json() for product in products]
        return JsonResponse(products_json, status = 200, safe = False)
    except Restaurant.DoesNotExist or Item.DoesNotExist:
      return HttpResponse(status=404)
  if request.method == "POST":
    try:
      newProduct = Item.add_new_product(restaurant_name, request.data)
      if newProduct is not None:
        return JsonResponse(newProduct.to_json(), status = 200)
    except Exception as e:
      return HttpResponse(e, status = 500)
    return HttpResponse(newProduct, status=200)
  
@api_view(['GET','PUT','DELETE','POST'])
def menu_details(request, restaurant_name, id):
  if request.method == "DELETE":
    try:
      item_to_delete = Item.delete_item(id)
      if item_to_delete is not None:
        return JsonResponse(item_to_delete.to_json(), status = 201)
    except Exception as e:
      return HttpResponse({'error':str(e)}, status = 500)
  if request.method == 'PUT':
    try:
      updatedProduct = Item.update_product(id, restaurant_name, request.data)
      if updatedProduct is not None:
        return JsonResponse(updatedProduct.to_json(), status = 200)
      else:
        return HttpResponse({'error':'updating error'}, status = 500)
    except Exception as e:
      return HttpResponse(e, status = 500)
     