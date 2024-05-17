from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from datetime import datetime
# Create your models here.
class BaseUser(models.Model):
  ruolo = models.CharField(max_length=50, default="user")
  username = models.CharField(max_length=100, blank=True, null=True, default="base user")
  password = models.CharField(max_length=100, default='')
  email = models.CharField(max_length=100, default='email')
  #balance = models.OneToOneField(BankAccount)
  telefono = models.CharField(max_length=20, default="+39 3332224888", null=True, blank =True)
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
    bank_account = BankAccount.objects.get(object_id = self.pk)
    bank_account.credit = balance
    bank_account.save()
    #self.balance = balance
    self.save()

  def get_balance(self):
    try:
      return BankAccount.objects.get(object_id = self.pk).credit
    except BankAccount.DoesNotExist:
      return float(0)

  @classmethod
  def authenticate_user(cls, username, role):
    print("username role\n", username, role)
    try:
      #checking whether user exists, might eventually add password check as well
      if role == 'cliente':
        return Customer.objects.get(username=username)
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
          email=kwargs['email'])
    elif role == 'ristorante':
        user = Restaurant(
          name=kwargs['username'],
          username=kwargs['username'],
          ruolo = role,
          password=kwargs['password'],
          position = kwargs['posizione'],
          email=kwargs['email'])
    elif role == 'rider':
        user = Rider.objects.create(
          username=kwargs['username'],
          position = kwargs['posizione'], 
          ruolo = role,
          password = kwargs['password'],
          status='available' )
    user.save()
    #creating associated bank account
    bank_account = BankAccount(
        active=True,
        credit=kwargs.get('balance', 0),
        content_type=ContentType.objects.get_for_model(user),
        object_id=user.pk)
    bank_account.save()
    
    return user
  
  @classmethod
  def update_user(cls, role, username, data):
    print("account PUT\n", data)
    try:
      user = cls.get_user_by_role(role, username)
      user.username = data['username']
      user.password = data['password']
      user.email = data['email']
      if user.ruolo == "ristorante":
        user = Restaurant.update_opening_hours(user, data)
      user.save()
      print("updated user\n", user.to_json())
      return user
    except Exception as e:
      print("exception\n", str(e))
      return None
    
  @classmethod
  def delete_user(cls, username, role):
    try:
      user = cls.get_user_by_role(role, username)
      print("user to be deleted\t", user.to_json())
      bank_account = BankAccount.objects.get(object_id = user.pk)
      aux = user
      user.delete()
      bank_account.delete()
      return aux
    except Exception as e:
      print("exception\n", str(e))
      return None
  @classmethod
  def reset_password(cls,user_name,user_role,new_password):
    print("reset pw\n", user_name, user_role)
    try:
      user = cls.get_user_by_role( user_role,user_name)
      print("reset pw\n", user.to_json())
      user.password = new_password
      user.save()
      return user
    except Exception as e:
      print("password reset error\n", str(e))
      return None

    
class BankAccount(models.Model):
 # user = models.ForeignKey('BaseUser', on_delete=models.CASCADE)
  active = models.BooleanField()
  credit = models.FloatField()
  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')

  def __str__(self):
    return "active" if self.active else 'inactive' +" "+str(self.object_id)
    
class Customer(BaseUser):
  posizione = models.CharField(max_length=20, default="", null=True, blank =True)
  def __str__(self):
    return str(self.username+' '+str(self.pk))
  
  def to_json(self):
    return {
      'username': self.username,
      'password': self.password,
      'email': self.email,
      'ruolo': self.ruolo,
      'balance': self.get_balance()
    }
  
class Restaurant(BaseUser):
  name = models.CharField(max_length=100, default="restaurant name")
  indirizzo = models.CharField(max_length=100)
  orarioApertura=models.DateTimeField(blank=True, null=True, auto_now_add=True)
  orarioChiusura=models.DateTimeField(blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return self.username+' '+str(self.pk)
  
  @classmethod
  def get_all_restaurants(cls):
    return cls.objects.all()
  
  @classmethod
  def update_opening_hours(cls,user, data):
    current_date = datetime.now().date()
    orario_apertura_time = datetime.strptime(data['orarioApertura'], '%H:%M').time()
    orario_chiusura_time = datetime.strptime(data['orarioChiusura'], '%H:%M').time()
    print("combined \n", datetime.combine(current_date, orario_apertura_time))
    user.orarioApertura = datetime.combine(current_date, orario_apertura_time)
    user.orarioChiusura = datetime.combine(current_date, orario_chiusura_time)
    print("updated opening hours\n", user.to_json())
    return user
    
  def to_json(self):
    return {
      'name': self.name,
      'username': self.username,
      'password': self.password,
      'email': self.email,
      'ruolo': self.ruolo,
      'indirizzo': self.indirizzo,
      'balance': self.get_balance(),
      'orarioApertura':datetime.fromisoformat(str(self.orarioApertura)).strftime('%H:%M'),
      'orarioChiusura':datetime.fromisoformat(str(self.orarioChiusura)).strftime('%H:%M')
    }
  
class Rider(BaseUser):
  status = models.CharField(max_length=100)
  #position  = models.CharField(max_length=100)

  def __str__(self):
    return str(self.username+ ' '+ self.status)
  
  def to_json(self):
    return {
      'username': self.username,
      'password': self.password,
      'ruolo': self.ruolo,
      #'posizione': self.position,
      'balance': self.get_balance()
    }
