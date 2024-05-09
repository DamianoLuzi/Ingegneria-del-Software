from django.urls import path
from . import views

urlpatterns = [
  path('',views.home, name = 'home'), 
  path('login',views.login, name = 'login'),
  path('signup',views.signup, name = 'signup'),
  path('<str:user_role>/<str:user_name>/balance', views.balance, name='balance'),
  path("<str:user_role>/<str:user_name>/account", views.account, name="account" ),
  path("<str:user_role>/<str:user_name>/password_reset", views.password_reset, name="account" )
]