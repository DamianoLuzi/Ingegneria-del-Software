from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import BaseUser 
from django.http import HttpResponse, JsonResponse
from django.core.mail import send_mail
import random
import string
# Create your views here.
def home(request):
  return HttpResponse("Hello, world!")

@api_view(['POST'])
def login(request):
    try:
      user = BaseUser.authenticate_user(request.data['username'], request.data['password'])
      if user:
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
        if user != None:
            text = f"Ciao {user.username},\n la tua iscrizione e andata a buon fine!\nTi ringraziamo per aver scelto il nostro servizio"
            send_mail( subject="Sign Up", message=text, recipient_list=[user.email], from_email='nerf.an120@gmail.com',  fail_silently=False)
            return JsonResponse(user.to_json(), status=200)
        else:
            return Response({'error': 'Error saving user'}, status=500)
  
@api_view(['GET','PUT'])
def balance(request, user_name, user_role):
  if request.method == 'GET':
    try:
      user = BaseUser.get_user_by_role(user_role, user_name)
      return JsonResponse(user.to_json(), status = 200, safe= False)
    except Exception as e:
      return HttpResponse({'error':str(e)}, status = 500)
  if request.method == 'PUT':
    try:
      user = BaseUser.get_user_by_role(user_role, user_name)
      user.update_balance(request.data['balance'])
      return JsonResponse(user.to_json(), status = 200, safe = False)
    except Exception as e:
      return HttpResponse({'error':str(e)}, status = 500)

@api_view(['GET','PUT','DELETE','POST'])
def account(request, user_name, user_role):
  if request.method == 'PUT':
    updatedUser = BaseUser.update_user(user_role,user_name, request.data)
    if updatedUser is not None:
       return JsonResponse(updatedUser.to_json(),status = 200, safe = False)
  elif request.method == 'GET':
    user = BaseUser.get_user_by_role(user_name, user_name)
    if user is not None:
      return user.to_json()
  elif request.method == 'DELETE' or request.method == 'POST':
    user = BaseUser.delete_user(user_name, user_role)
    if user is not None:
      return JsonResponse(user.to_json(), status=201, safe=False)
    
@api_view(['PUT'])
def password_reset(request, user_name, user_role):
  if request.method == 'PUT':
    new_password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    text = f"Ciao {user_name},\n la tua password di recupero è {new_password}!\nTi ringraziamo per aver scelto il nostro servizio"
    updatedUser = BaseUser.reset_user_password(user_name,user_role,new_password)
    if updatedUser is not None:
      send_mail(subject="Password Reset", message=text, recipient_list=[updatedUser.email], from_email='nerf.an120@gmail.com',  fail_silently=False)
      return JsonResponse(updatedUser.to_json(), status = 200, safe=False)
    else:
      return Response({'error': 'Invalid role'})
    



