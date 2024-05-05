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

  
@api_view(['POST'])
def login(request):
    print("login request ", request.data)
    try:
        if request.data['ruolo'] == 'cliente':
          user = Customer.objects.get(username=request.data['username'])
        elif request.data['ruolo'] == 'ristorante':
          user = Restaurant.objects.get(name=request.data['username'])
        else:
          user = Rider.objects.get(username=request.data['username'])
        print("user", user)
        if user.user.is_customer:
            user_role = 'cliente'
        elif user.user.is_restaurant:
            user_role = 'ristorante'
        else:
            user_role = 'rider'
        user_data = serialize('json', [user])
        user_data_dict = json.loads(user_data)
        print("udd ", user_data_dict)
        user_data_dict[0]['fields']['ruolo'] = user_role
        print("update", user_data_dict)
        return Response([user_data_dict[0]['fields']])

    except Customer.DoesNotExist or Restaurant.DoesNotExist or Rider.DoesNotExist:
        return HttpResponse({'User not found'}, status=404)
    except Exception as e:
       return HttpResponse({'User not found'}, status=500)
       return Response([{"error":'Internal Server Error'}])
  
@api_view(['POST'])
def signup(request):
  if request.method == 'POST':
    print("signup request", request.data)
        
    role = request.data.get('ruolo', None)
    if role not in ['cliente', 'ristorante', 'rider']:
        return Response({'error': 'Invalid role'}, status=400)
    user = BaseUser()
    if role == 'cliente':
        user.is_customer = True
        user.save()
        customer = Customer(user=user, username=request.data['username'], password=request.data['password'], email=request.data['email'],balance=request.data.get('balance', 0))
        customer.save()
    elif role == 'ristorante':
        user.is_restaurant = True
        user.save()
        restaurant = Restaurant(user=user, name=request.data['username'], password=request.data['password'],position = request.data['posizione'], email=request.data['email'],balance=request.data.get('balance', 0))
        restaurant.save()
    elif role == 'rider':
        user.is_rider = True
        user.save()
        rider = Rider(user=user,username=request.data['username'], position = request.data['posizione'], status='available' ,balance=request.data.get('balance', 0))
        rider.save()
    
    print("base user", user)
    
    return Response({'message': 'User created successfully'}, status=200)
  
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
    print("menu POST\n", request.data)
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
     