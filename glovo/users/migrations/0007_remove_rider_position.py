# Generated by Django 5.0.4 on 2024-05-17 20:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_restaurant_orarioapertura_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rider',
            name='position',
        ),
    ]