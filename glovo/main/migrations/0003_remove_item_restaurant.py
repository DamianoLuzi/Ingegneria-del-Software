# Generated by Django 5.0.4 on 2024-04-28 10:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_item_restaurant'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='restaurant',
        ),
    ]
