from django.urls import path
from . import views

urlpatterns = [
  path('',views.home, name = 'home'), 
  #path('login',views.login, name = 'login'),
  # path('signup',views.signup, name = 'signup'),
  path('restaurants', views.restaurants, name='restaurants'),
  path('items', views.items, name='iitems'),
  path('users', views.users, name='users'),
  path('<str:restaurant_name>/menu', views.menu, name='menu'),
  path('<str:restaurant_name>/menu/<str:id>', views.menu_details, name="menu_details")
  #path('<str:user_name>/orders', views.orders, name='orders'),
  #path('<str:user_name>/balance', views.balance, name='balance')
]