# Generated by Django 5.0.4 on 2024-06-13 13:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_restaurant_orarioapertura_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='orarioApertura',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 6, 13, 13, 27, 39, 501691, tzinfo=datetime.timezone.utc), null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='orarioChiusura',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 6, 13, 13, 27, 39, 501691, tzinfo=datetime.timezone.utc), null=True),
        ),
    ]
