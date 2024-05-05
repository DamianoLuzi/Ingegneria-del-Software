from django.db import models

# Create your models here.

class BaseUser(models.Model):
  ruolo = models.CharField(max_length=50, default="user")
  username = models.CharField(max_length=100, blank=True, null=True, default="base user")
  password = models.CharField(max_length=100, default='')
  email = models.CharField(max_length=100, default='email')
  balance = models.FloatField(default=0.0)
  phone = models.CharField(max_length=20, default="00000", null=True, blank =True)
  class Meta:
     abstract = True
  def __str__(self):
    return self.ruolo +" "+str(self.pk)
  
  @classmethod
  def get_user_by_role(cls, role, username):
    if role == 'cliente':
      return Customer.objects.get(username = username)
    elif role == 'ristorante':
      return Restaurant.objects.get(username = username)
    else:
      return Rider.objects.get(username = username)

  def update_balance(self, balance):
    self.balance = balance
    self.save()

  @classmethod
  def authenticate_user(cls, username, role):
    try:
      print("login role\n", role, "\nlogin username\n", username)
      if role == 'cliente':
        u = Customer.objects.get(username=username)
        print("authenticate user case", u)
        return u
      elif role == 'ristorante':
        return Restaurant.objects.get(username=username)
      elif role == 'rider':
        return Rider.objects.get(username=username)
    except (Customer.DoesNotExist, Restaurant.DoesNotExist, Rider.DoesNotExist):
        return None

  @classmethod 
  def create_user(cls, role, **kwargs):
    if role == 'cliente':
        user = Customer( 
          username=kwargs['username'],
          password=kwargs['password'],
          ruolo = role,
          email=kwargs['email'],
          balance=kwargs.get('balance', 0))
    elif role == 'ristorante':
        user = Restaurant(
          name=kwargs['username'],
          username=kwargs['username'],
          ruolo = role,
          password=kwargs['password'],
          position = kwargs['posizione'],
          email=kwargs['email'],
          balance=kwargs.get('balance', 0))
    elif role == 'rider':
        user = Rider.objects.create(
          username=kwargs['username'],
          position = kwargs['posizione'], 
          ruolo = role,
          password = kwargs['password'],
          status='available' ,
          balance=kwargs.get('balance', 0))
    user.save()
    return user
  
  @classmethod
  def update_user(cls, role, username, data):
    try:
      user = cls.get_user_by_role(role, username)
      print("user to be updated\t", user.to_json())
      user.username = data['username']
      user.password = data['password']
      user.email = data['email']
      user.save()
      return user
    except Exception as e:
      print("exception\n", str(e))
      return None
    
class Customer(BaseUser):
  posizione = models.CharField(max_length=20, default="", null=True, blank =True)
  def __str__(self):
    return str(self.username+' '+str(self.pk))
  
  def to_json(self):
    print("customer\n\n", {
      'username': self.username,
      'password': self.password,
      'email': self.email,
      'ruolo': self.ruolo
    })
    return {
      'username': self.username,
      'password': self.password,
      'email': self.email,
      'ruolo': self.ruolo
    }
  
class Restaurant(BaseUser):
  name = models.CharField(max_length=100, default="restaurant name")
  position = models.CharField(max_length=100)
  orarioApertura=models.DateField(blank=True, null=True)
  orarioChiusura=models.DateField(blank=True, null=True)

  def __str__(self):
    return str(self.name+' '+str(self.balance)) 
  
  def to_json(self):
    return {
      'name': self.name,
      'username': self.username,
      'password': self.password,
      'email': self.email,
      'ruolo': self.ruolo,
      'posizione': self.position
    }
  
class Rider(BaseUser):
  status = models.CharField(max_length=100)
  position  = models.CharField(max_length=100)

  def __str__(self):
    return str(str(self.ruolo)+ ' '+ self.status)
  
  def to_json(self):
    return {
      'username': self.username,
      'password': self.password,
      'ruolo': self.ruolo,
      'posizione': self.position
    }