# Generated by Django 5.0.4 on 2024-04-28 10:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deliveries', '0001_initial'),
        ('users', '0006_customer_username_restaurant_username_rider_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='customer_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.customer'),
        ),
        migrations.AlterField(
            model_name='order',
            name='restaurant_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='users.restaurant'),
        ),
        migrations.AlterField(
            model_name='order',
            name='rider_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='users.rider'),
        ),
    ]
