from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Customer, BaseUser, Item, Restaurant, Rider
import json
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
@api_view(['GET'])
def home(request):
  if request.method == 'GET':
    return Response({"message": 'Home Page!'})
  
@api_view(['GET'])
def restaurants(request):
  if request.method == 'GET':
    restaurants = Restaurant.objects.all()
    return Response({"restaurants": restaurants})
  
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
        print("uodate", user_data_dict)
        return Response([user_data_dict[0]['fields']])

    except Customer.DoesNotExist or Restaurant.DoesNotExist or Rider.DoesNotExist:
        return HttpResponse({'User not found'}, status=404)
    except Exception as e:
       return Response([{"error":'Internal Server Error'}])
  
@api_view(['POST'])
def signup(request):
  if request.method == 'POST':
    user = BaseUser()
    return Response({})
  
@api_view(['GET'])
def users(request):
  try:
    users = BaseUser.objects.all()
    print("users")
    return HttpResponse(
      serialize('json',users), status= 200)
  except:
    return Response({"message":'unable to fetch'})
  
@api_view(['GET'])
def restaurants(request):
  try:
    restaurants = Restaurant.objects.all()
    data = serialize('json', restaurants)
    print("restaurants", data)
    return HttpResponse(data, status= 200)
  except:
    return Response({"message":'unable to fetch'})
  
@api_view(['GET'])
def items(request):
  try:
    items =Item.objects.all()
    data = serialize('json', items)
    print("items", data)
    return HttpResponse(data, status= 200)
  except:
    return Response({"message":'unable to fetch'})
  
@api_view(['GET', 'POST'])
def menu(request,**kwargs):
  restaurant_name = kwargs.get('restaurant_name')
  print("restaurant menu", restaurant_name)
  try:
    res = Restaurant.objects.get(name = restaurant_name)
    products = Item.objects.filter(restaurant = res.pk)
    serialized_products = serialize('json', products)
    print("serialized")
    return HttpResponse(serialized_products, status = 200)
  except Restaurant.DoesNotExist:
    return HttpResponse(status=404)