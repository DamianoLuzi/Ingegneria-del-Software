# Generated by Django 5.0.4 on 2024-04-28 07:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('items', models.CharField(max_length=1000)),
                ('price', models.FloatField(default=0.0)),
                ('destination', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.customer')),
                ('restaurant_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='users.restaurant')),
                ('rider_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='users.rider')),
            ],
        ),
    ]
