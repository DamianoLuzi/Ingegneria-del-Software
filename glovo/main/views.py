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
  
""" @api_view(['GET'])
def restaurants(request):
  try:
    restaurants = Restaurant.objects.all()
    data = serialize('json', restaurants)
    print("restaurants", data)
    return HttpResponse(data, status= 200)
  except:
    return Response({"message":'unable to fetch'}) """
  
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
def menu(request,**kwargs):
  restaurant_name = kwargs.get('restaurant_name')
  print("restaurant menu", restaurant_name)
  if request.method == "GET":
    try:
      products = Item.get_restaurant_items(restaurant_name)
      if products is not None:
        products_json = [product.to_json() for product in products]
        return JsonResponse(products_json, status = 200, safe = False)
    except Restaurant.DoesNotExist:
      return HttpResponse(status=404)
  if request.method == "POST":
    print("menu POST\n", request.data)
    try:
      newProduct = Item.add_new_product(restaurant_name, request.data)
      print("new Prod\n\n", newProduct)
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
      print("new Prod\n\n", updatedProduct)
      if updatedProduct is not None:
        return JsonResponse(updatedProduct.to_json(), status = 200)
      else:
        return HttpResponse({'error':'updating error'}, status = 500)
    except Exception as e:
      return HttpResponse(e, status = 500)
     

  
@api_view(['GET','POST','PUT'])
def orders(request,**kwargs):
  print("orders request", request.data)
  print("kwargs", kwargs)
  user_name = kwargs.get('user_name')
  print("user order", user_name)
  try:
      try:
        user = Restaurant.objects.get(name=user_name)
        orders = Order.objects.filter(restaurant_id = user.pk)
      except ObjectDoesNotExist:
        try:
          user = Customer.objects.get(username=user_name)
          orders = Order.objects.filter(customer_id = user.pk)
        except ObjectDoesNotExist:
          try:
            user = Rider.objects.get(username=user_name)
            orders = Order.objects.filter(rider_id = user.pk)
          except ObjectDoesNotExist:
            return HttpResponse({'error': 'User not found'}, status=404)      
  except Exception as e:
    return HttpResponse({'error':str(e)}, status = 500)
  
  if request.method == 'GET':
    serialized_orders = serialize('json', orders)
    print("serialized")
    return HttpResponse(serialized_orders, status = 200)
  
  if request.method == 'POST':
    print("orders POST req ", request.data)
    items = request.data['items']
    order_price = request.data['price']
    print("items", items[0], type(items[0]))
    print("order price", order_price, type(order_price))
    restaurant = Restaurant.objects.get(pk = items[0]['fields']['restaurant'])
    user = Customer.objects.get(username = request.data['user']['username'])
    rider = Rider.objects.filter(status = 'available').first()
    if rider is None: return HttpResponse({'No riders available at the moment'}, status = 500)
    print("user", user)
    print("restaurant", restaurant)
    try:
      items_names = [item['fields']['name'] for item in items]
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
    
    
  
""" @api_view(['GET','PUT'])
def balance(request, **kwargs):
  if request.method == 'GET':
    user_name = kwargs.get('user_name')
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
    print("balance PUT", request.data)
    username = request.data['username'] 
    try:
      try:
        customer = Customer.objects.get(username = username)
        customer.balance = request.data['balance']
        customer.save()
        return HttpResponse(customer, status  = 200)
      except:
        try:
          res = Restaurant.objects.get(name = username)
          res.balance = request.data['balance']
          res.save()
          return HttpResponse(res, status  = 200)
        except:
          try:
            rider = Rider.objects.get(username = username)
            rider.balance = request.data['balance']
            rider.save()
            return HttpResponse(rider, status  = 200)
          except Exception as e:
            return HttpResponse({'error':str(e)}, status = 404)
    except Exception as e:
      return HttpResponse({'error':str(e)}, status = 500)
   
    """