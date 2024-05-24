# Generated by Django 5.0.4 on 2024-05-18 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deliveries', '0002_order_delivery_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='items_list',
            field=models.JSONField(default=[]),
        ),
        migrations.AlterField(
            model_name='order',
            name='delivery_time',
            field=models.IntegerField(default=29),
        ),
    ]