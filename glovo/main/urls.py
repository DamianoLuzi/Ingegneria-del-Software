from django.urls import path
from . import views

urlpatterns = [
  path('',views.home, name = 'home'), 
  path('restaurants', views.restaurants, name='restaurants'),
  path('items', views.items, name='iitems'),
  path('users', views.users, name='users'),
  path('<str:restaurant_name>/menu', views.menu, name='menu'),
  path('<str:restaurant_name>/menu/<str:id>', views.menu_details, name="menu_details")
]