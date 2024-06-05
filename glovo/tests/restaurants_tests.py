from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from urllib.parse import urlencode
from users.models import BaseUser, Customer, Restaurant, Rider, BankAccount
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import json


class CustomerTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.restaurant = Restaurant.objects.create(
            ruolo="ristorante",
            username="ristorante1",
            password="Rest97*",
            email="rest@gmail.com",
            indirizzo="123 Oxford Street"
        )

        self.bank_account = BankAccount.objects.create(
            active=True,
            credit=100.0,
            content_type=ContentType.objects.get_for_model(self.restaurant),
            object_id=self.restaurant.pk
        )

    def test_update_opening_hours(self):
        updated_data = {
            "orarioApertura": "08:00",
            "orarioChiusura": "22:00"
        }
        user = Restaurant.update_user('ristorante','ristorante1', updated_data)
        self.assertEqual(user.orarioApertura.strftime('%H:%M'), "08:00")
        self.assertEqual(user.orarioChiusura.strftime('%H:%M'), "22:00")
        print(self.restaurant.to_json())