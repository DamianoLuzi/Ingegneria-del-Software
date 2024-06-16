from django.test import TestCase, Client
from django.urls import reverse, resolve
from rest_framework.test import APIClient, APITestCase
from urllib.parse import urlencode
from users.models import BaseUser, Customer, Restaurant, Rider, BankAccount
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import json

""" 
    Running tests creates a separate database to ensure that tests
    don't affect your actual data. This test database is an isolated environment 
    where all the necessary operations for testing are performed. 
    Once the tests are completed, Django destroys this test database and this message will be printed:
    
    'The message Destroying test database for alias 'default'...'  
"""

class CustomerTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = Customer.objects.create(
            ruolo="cliente",
            username="cliente1",
            password="AiueBD97",
            email="test@gmail.com",
            telefono="+39 3332224888"
        )
        self.restaurant = Restaurant.objects.create(
            ruolo="ristorante",
            username="ristorante1",
            password="Rest97*",
            email="rest@gmail.com",
            indirizzo="123 Oxford Street"
        )
        self.rider = Rider.objects.create(
            ruolo="rider",
            username="rider1",
            password="Ride#2023",
            email="rider@gmail.com",
            status="available"
        )

        #BankAccount associated to self.customer/cliente1
        self.bank_account = BankAccount.objects.create(
            active=True,
            credit=100.0,
            content_type=ContentType.objects.get_for_model(self.customer),
            object_id=self.customer.pk
        )

    def test_get_user_by_role(self):
        user = Customer.get_user_by_role("cliente", "cliente1")
        self.assertEqual(user.username, "cliente1")

    def test_update_balance(self):
        response = self.client.put(
            reverse('balance', kwargs={'user_role': 'cliente', 'user_name': 'cliente1'}),
            data=json.dumps({'balance': 200.0}),
            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.get_balance(), 200.0)

    def test_authenticate_user(self):
        response = self.client.post(
            reverse('login'),
              {'username': 'cliente1', 'password': 'AiueBD97'}
            )
        self.assertEqual(response.status_code, 200)
        user = response.json()
        self.assertEqual(user['username'], 'cliente1')

    def test_create_user(self):
        payload = {
            'ruolo': 'cliente',
            'username': 'newcliente',
            'password': 'NewPass123',
            'email': 'newcliente@gmail.com',
            'balance': 50.0
        }
        response = self.client.post(
            reverse('signup'),
            data = json.dumps(payload),
            content_type='application/json'
        ) 
        self.assertEqual(response.status_code, 200)
        user = Customer.objects.get(username='newcliente')
        self.assertEqual(user.username, 'newcliente')
        self.assertEqual(user.get_balance(), 50.0)

    def test_update_user(self):
        updated_data = {
            'username': 'updateduser',
            'password': 'NewPass1234',
            'email': 'updateduser@gmail.com'
        }
        BaseUser.update_user('cliente', 'cliente1', updated_data)
        user = Customer.get_user_by_role("cliente","updateduser")
        self.assertEqual(user.username, 'updateduser')

    def test_reset_user_password(self):
        payload = {
            'password': 'NewPassword1234'
        }
        BaseUser.reset_user_password('cliente1','cliente',payload['password'])
        user = Customer.authenticate_user("cliente1", payload['password'])
        self.assertEqual(user.password, payload['password']) 
