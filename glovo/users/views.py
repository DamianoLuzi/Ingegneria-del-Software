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
        user = BaseUser.authenticate_user(request.data['username'], request.data['ruolo'])
        print("login base user", user)
        if user:
            print("authenticated user\n", user.to_json())
            return JsonResponse(user.to_json(), status = 200)
        else:
            return HttpResponse({'User not found'}, status=404)
    except Exception as e:
        return HttpResponse({'Error authenticating user'}, status=500)
  
@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        role = request.data.get('ruolo', None)
        if role not in ['cliente', 'ristorante', 'rider']:
            return Response({'error': 'Invalid role'}, status=400)
        user = BaseUser.create_user(role, **request.data)
        print(f"{role.capitalize()} JSON\n", user.to_json())
        return JsonResponse(user.to_json(), status=200)
  
@api_view(['GET','PUT'])
def balance(request, user_name):
  print("GET balance", request.data)
  if request.method == 'GET':
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
def account(request, user_name, user_role):
  print("account user_name", user_name)
  if request.method == 'PUT':
    updatedUser = BaseUser.update_user(user_role,user_name, request.data)
    if updatedUser is not None:
       return JsonResponse(updatedUser.to_json(),status = 200, safe = False)
  elif request.method == 'GET':
    user = BaseUser.get_user_by_role(user_name, user_name)
    if user is not None:
      return user.to_json()