from django.test import TestCase, Client
from django.urls import reverse
from main.models import Item
from users.models import Restaurant, Rider, Customer, BankAccount
from deliveries.models import Order
from django.contrib.contenttypes.models import ContentType
import json

class OrderTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.customer = Customer.objects.create(
            pk = 1,
            ruolo="cliente",
            username="cliente1",
            password="AiueBD97",
            email="test@gmail.com",
            telefono="+39 3332224888"
        )
        self.restaurant = Restaurant.objects.create(
            pk = 2,
            ruolo="ristorante",
            username="ristorante1",
            password="Rest97*",
            email="rest@gmail.com",
            indirizzo="123 Main St"
        )
        self.rider = Rider.objects.create(
            pk = 3,
            ruolo="rider",
            username="rider1",
            password="Ride#2023",
            email="rider@gmail.com",
            status="available"
        )

        #BankAccount associated to self.customer
        self.customer_bank_account = BankAccount.objects.get_or_create(
            active=True,
            credit=10000.0,
            content_type=ContentType.objects.get_for_model(self.customer),
            object_id=self.customer.pk
        )
        
        # Create BankAccount associated to self.restaurant
        self.restaurant_bank_account = BankAccount.objects.get_or_create(
            active=True,
            credit=0.0,
            content_type=ContentType.objects.get_for_model(self.restaurant),
            object_id=self.restaurant.pk
        )
        
        #BankAccount associated to self.rider
        self.rider_bank_account = BankAccount.objects.get_or_create(
            active=True,
            credit=0.0,
            content_type=ContentType.objects.get_for_model(self.rider),
            object_id=self.rider.pk
        )
        self.item = Item.objects.create(
            name="Pizza",
            price=20.0
        )

    def test_create_new_order(self):
        items = [{"name": self.item.name, "price": self.item.price}]
        order_price = self.item.price
        new_order, error = Order.create_new_order(items, order_price, self.restaurant.username, self.customer.username)
        self.assertIsNotNone(new_order)
        self.assertIsNone(error)
        self.assertEqual(new_order.price, order_price)
        self.assertEqual(new_order.status, 'in progress...')
        self.assertEqual(len(new_order.prodotti), 1)
        self.assertEqual(new_order.customer_id, self.customer)
        self.assertEqual(new_order.restaurant_id, self.restaurant)
        self.assertEqual(new_order.rider_id, self.rider)
        self.assertEqual(new_order.prodotti[0]['name'], self.item.name)
 
    def test_insufficient_balance(self):
        self.customer.update_balance(10.0)
        self.customer.save()
        items = [{"name": self.item.name, "price": self.item.price}]
        order_price = self.item.price
        new_order, error = Order.create_new_order(items, order_price, self.restaurant.username, self.customer.username)
        
        self.assertIsNone(new_order)
        self.assertEqual(error, "Credito Insufficiente! Ricarica il tuo Wallet")

    def test_get_orders_by_user(self):
        items = [{"name": self.item.name, "price": self.item.price}]
        order_price = self.item.price
        order, error = Order.create_new_order(items, order_price, self.restaurant.username, self.customer.username)
        print("test get orders \n", order, error)
        customer_orders = Order.get_orders_by_user("cliente", self.customer.username)
        restaurant_orders = Order.get_orders_by_user("ristorante", self.restaurant.username)
        rider_orders = Order.get_orders_by_user("rider", self.rider.username)
        
        self.assertEqual(len(customer_orders), 1)
        self.assertEqual(len(restaurant_orders), 1)
        self.assertEqual(len(rider_orders), 1)

    def test_update_order_status(self):
        items = [{"name": self.item.name, "price": self.item.price}]
        order_price = self.item.price
        new_order, error = Order.create_new_order(items, order_price, self.restaurant.username, self.customer.username)
        print("new order\n", new_order, error)
        updated_order, error = Order.update_order_status(new_order.pk, "ristorante", self.restaurant.username)
        
        self.assertIsNone(error)
        self.assertEqual(updated_order.status, 'in transit')
        
        updated_order, error = Order.update_order_status(new_order.pk, "rider", self.rider.username)
        
        self.assertIsNone(error)
        self.assertEqual(updated_order.status, 'delivered')
        self.rider.refresh_from_db()
        self.assertEqual(self.rider.status, 'available')
        
        updated_order, error = Order.update_order_status(new_order.pk, "cliente", self.customer.username)
        
        self.assertIsNone(error)
        self.assertEqual(updated_order.status, 'completed')

