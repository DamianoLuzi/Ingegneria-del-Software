from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Customer, BaseUser, Rider, Restaurant
from main.models import Item
import json
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from datetime import datetime

# Create your views here.
def home(request):
  return HttpResponse("Hello, world!")

@api_view(['POST'])
def login(request):
    print("login request ", request.data)
    try:
        #baseUser = BaseUser.objects.get(username = request.data['username'])
        if request.data['ruolo'] == 'cliente':
          user = Customer.objects.get(username=request.data['username'])
          #user = Customer.objects.get(user = baseUser)
        elif request.data['ruolo'] == 'ristorante':
          user = Restaurant.objects.get(name=request.data['username'])
          #user = Restaurant.objects.get(user = baseUser)
        else:
          user = Rider.objects.get(username=request.data['username'])
          #user = Rider.objects.get(user = baseUser)
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
        print("login response", user_data_dict)
        return Response([user_data_dict[0]['fields']])

    except Customer.DoesNotExist or Restaurant.DoesNotExist or Rider.DoesNotExist:
        return HttpResponse({'User not found'}, status=404)
    except Exception as e:
       return HttpResponse({'User not found'}, status=500)
       return Response([{"error":'Internal Server Error'}])


""" @api_view(['POST'])
def login(request):
  body = request.data
  print("login body", body)
  try:
    base_user = BaseUser()
    user = base_user.get_user_by_role(body['ruolo'], body['username'])
    print("login \n", user)
    return HttpResponse(user, status = 200)
  except Exception as e:
    print("login exception", e) """

  
@api_view(['POST'])
def signup(request):
  if request.method == 'POST':
    print("signup request", request.data)   
    role = request.data.get('ruolo', None)
    if role not in ['cliente', 'ristorante', 'rider']:
        return Response({'error': 'Invalid role'}, status=400)
    user = BaseUser(username=request.data['username'])
    if role == 'cliente':
        user.is_customer = True
        user.save()
        customer = Customer(user=user, username=request.data['username'], password=request.data['password'], email=request.data['email'],balance=request.data.get('balance', 0))
        customer.save()
        print("customer JSON\n", customer.to_json())
        return JsonResponse(customer.to_json(), status = 200)
    elif role == 'ristorante':
        user.is_restaurant = True
        user.save()
        restaurant = Restaurant(user=user, name=request.data['username'],username=request.data['username'], password=request.data['password'],position = request.data['posizione'], email=request.data['email'],balance=request.data.get('balance', 0))
        restaurant.save()
    elif role == 'rider':
        user.is_rider = True
        user.save()
        rider = Rider(user=user,username=request.data['username'], position = request.data['posizione'], password = request.data['password'], status='available' ,balance=request.data.get('balance', 0))
        rider.save()
    
    print("base user", user)
    return Response({'message': 'User created successfully'}, status=200)
  
@api_view(['GET','PUT'])
def balance(request, user_name):
  print("GET balance", request.data)
  if request.method == 'GET':
    #user_name = kwargs.get('user_name')
    print('username', user_name)
    try:
      try:
        customer = Customer.objects.get(username = user_name)
        return HttpResponse(customer.balance, status  = 200)
      except:
        try:
          res = Restaurant.objects.get(name = user_name)
          return HttpResponse(res.balance, status  = 200)
        except:
          try:
            rider = Rider.objects.get(username = user_name)
            return HttpResponse(rider.balance, status  = 200)
          except Exception as e:
            return HttpResponse({'error':str(e)}, status = 404)

    except Exception as e:
      return HttpResponse({'error':str(e)}, status = 500)
  if request.method == 'PUT':
    print("PUT request.user", request.data)
    print("balance PUT", request.data)
    username = request.data['username'] 
    #user_name = kwargs.get('user_name')
    print(' kwargs username', user_name, username)
    try:
      try:
        customer = Customer.objects.get(username = user_name)
        customer.balance = request.data['balance']
        customer.save()
        return HttpResponse(customer, status  = 200)
      except:
        try:
          res = Restaurant.objects.get(name = user_name)
          res.balance = request.data['balance']
          res.save()
          return HttpResponse(res, status  = 200)
        except:
          try:
            rider = Rider.objects.get(username = user_name)
            rider.balance = request.data['balance']
            rider.save()
            return HttpResponse(rider, status  = 200)
          except Exception as e:
            return HttpResponse({'error':str(e)}, status = 404)
    except Exception as e:
      return HttpResponse({'error':str(e)}, status = 500)

@api_view(['GET','PUT'])
def account(request, user_name):
  print("account user_name", user_name)
  user = BaseUser.objects.get(username = user_name)
  if request.method == "GET":
    print("account GET", user_name)
    return HttpResponse(user, status = 200)
  elif request.method == "PUT":
    print("account PUT", request.data)
    if user.is_customer:
      return HttpResponse(user, status = 202)
    elif user.is_restaurant:
      return HttpResponse(user, status = 203)
    elif user.is_rider:
      return HttpResponse(user, status = 204)
    
    return HttpResponse(user, status = 201)
     
   
   