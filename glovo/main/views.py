from rest_framework.response import Response
from rest_framework.decorators import api_view
from main.models import Item
from users.models import Restaurant, Customer 
from deliveries.models import Order
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
@api_view(['GET'])
def home(request):
  if request.method == 'GET':
    return Response({"message": 'Bentornato!'})
  
@api_view(['GET'])
def restaurants(request, **kwargs):
  if request.method == 'GET':
    restaurants = Restaurant.get_all_restaurants()
    restaurants_json = [restaurant.to_json() for restaurant in restaurants]
    return JsonResponse(restaurants_json, status=200, safe=False)
  
@api_view(['GET'])
def users(request):
  try:
    users = Order.objects.all()
    return HttpResponse(
      serialize('json',users), status= 200)
  except:
    return Response({"message":'unable to fetch'})

  
@api_view(['GET'])
def items(request):
  try:
    items = Order.objects.all()
    data = serialize('json', items)
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
     
     
@api_view(['GET','POST','DELETE'])
def favourite_products(request, role, username):
    if request.method == "POST":
      try:
          customer = Customer.objects.get(username=username)
          if request.data not in customer.prodotti_preferiti:
            customer.prodotti_preferiti.append(request.data)
          customer.save()
          return JsonResponse(request.data, status = 200, safe=False)
      except Exception as e:
          return HttpResponse(e, status = 500)
    if request.method == "GET":
      try:
        customer = Customer.objects.get(username=username)
        return JsonResponse(customer.prodotti_preferiti, status=200, safe=False)
      except Exception as e:
        return HttpResponse(e, status = 500)
    if request.method == "DELETE":
      try:
        item = request.data
        customer = Customer.objects.get(username=username)
        if item in customer.prodotti_preferiti:
          customer.prodotti_preferiti.remove(item)
        customer.save()
        return JsonResponse(customer.prodotti_preferiti, status=200, safe=False)
      except Exception as e:
        return HttpResponse(e, status = 500)


@api_view(['GET','POST','DELETE'])
def favourite_restaurants(request, role, username):
    if request.method == "POST":
      try:
          customer = Customer.objects.get(username=username)
          if request.data not in customer.ristoranti_preferiti:
            customer.ristoranti_preferiti.append(request.data)
          customer.save()
          return JsonResponse(request.data, status = 200, safe=False)
      except Exception as e:
          return HttpResponse(e, status = 500)
    if request.method == "GET":
      try:
        customer = Customer.objects.get(username=username)
        return JsonResponse(customer.ristoranti_preferiti, status=200, safe=False)
      except Exception as e:
        return HttpResponse(e, status = 500)
    if request.method == "DELETE":
      try:
        item = request.data
        customer = Customer.objects.get(username=username)
        if item in customer.ristoranti_preferiti:
          customer.ristoranti_preferiti.remove(item)
        customer.save()
        return JsonResponse(customer.ristoranti_preferiti, status=200, safe=False)
      except Exception as e:
        return HttpResponse(e, status = 500)
