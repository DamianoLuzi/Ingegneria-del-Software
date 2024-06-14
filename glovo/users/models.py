from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from datetime import datetime
from django.utils import timezone
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
    content_type = ContentType.objects.get_for_model(self)
    bank_account = BankAccount.objects.get(object_id = self.pk, content_type = content_type)
    bank_account.credit = balance
    bank_account.save()
    self.save()

  def get_balance(self):
    try:
      content_type = ContentType.objects.get_for_model(self)
      return BankAccount.objects.get(object_id = self.pk, content_type = content_type).credit
    except BankAccount.DoesNotExist:
      return float(0)

  @classmethod
  def authenticate_user(cls, username):
    #only checking whether user exists, might eventually add password check as well
    user = None
    try:
        user = Customer.objects.get(username=username)
    except Customer.DoesNotExist:
        pass
    if not user:
        try:
            user = Restaurant.objects.get(username=username)
        except Restaurant.DoesNotExist:
            pass
    if not user:
        try:
            user = Rider.objects.get(username=username)
        except Rider.DoesNotExist:
            pass
    return user

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
          indirizzo = kwargs['posizione'],
          email=kwargs['email'])
    elif role == 'rider':
        user = Rider.objects.create(
          username=kwargs['username'],
          email=kwargs['email'],
          ruolo = role,
          password = kwargs['password'],
          status='available' )
    user.save()
    content_type = ContentType.objects.get_for_model(user)
    if not BankAccount.objects.filter(content_type=content_type, object_id=user.pk).exists():
        # Creating associated bank account
        bank_account = BankAccount(
            active=True,
            credit=kwargs.get('balance', 0),
            content_type=content_type,
            object_id=user.pk)
        bank_account.save()    
    return user
  
  @classmethod
  def update_user(cls, role, username, data):
    try:
      user = cls.get_user_by_role(role, username)
      print("user before update\n",user.to_json())
      user.username = data.get('username', username)
      user.password = data.get('password', 'pw')
      user.email = data.get('email','email@test.com')
      if user.ruolo == "ristorante":
        user = Restaurant.update_opening_hours(user, data)
      user.save()
      print("updated user\n",user.to_json())
      return user
    except Exception as e:
      print("exception\n", str(e))
      return None
    
  @classmethod
  def delete_user(cls, username, role):
    try:
      user = cls.get_user_by_role(role, username)
      bank_account = BankAccount.objects.get(object_id = user.pk)
      aux = user
      user.delete()
      bank_account.delete()
      return aux
    except Exception as e:
      print("exception\n", str(e))
      return None
  @classmethod
  def reset_user_password(cls,user_name,user_role,new_password):
    try:
      user = cls.get_user_by_role( user_role,user_name)
      user.password = new_password
      user.save()
      return user
    except Exception as e:
      print("password reset error\n", str(e))
      return None

    
class BankAccount(models.Model):
  active = models.BooleanField()
  credit = models.FloatField()
  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')
  class Meta:
    unique_together = ('content_type', 'object_id')

  def __str__(self):
    user = self.content_type
    return "active" if self.active else 'inactive' +" "+str(self.object_id) + " " + str(user)
    
class Customer(BaseUser):
  ristoranti_preferiti = models.JSONField(default=[])
  prodotti_preferiti = models.JSONField(default=[])
  def __str__(self):
    return str(self.username+' '+str(self.pk))
  
  def to_json(self):
    return {
      'username': self.username,
      'password': self.password,
      'email': self.email,
      'ruolo': self.ruolo,
      'balance': self.get_balance(),
      'favourite_restaurants' : self.ristoranti_preferiti,
      'favourite_items' : self.prodotti_preferiti
    }
  
class Restaurant(BaseUser):
  name = models.CharField(max_length=100, default="restaurant name")
  indirizzo = models.CharField(max_length=100)
  orarioApertura=models.DateTimeField(blank=True, null=True, default=timezone.now())
  orarioChiusura=models.DateTimeField(blank=True, null=True, default=timezone.now())

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
    user.save()
    print("updated restaurant\n",user.to_json())
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

  def __str__(self):
    return str(self.username+ ' '+ self.status)
  
  def to_json(self):
    return {
      'username': self.username,
      'password': self.password,
      'ruolo': self.ruolo,
      'balance': self.get_balance()
    }
