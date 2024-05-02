# Generated by Django 5.0.4 on 2024-04-28 07:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BaseUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_customer', models.BooleanField(default=False)),
                ('is_restaurant', models.BooleanField(default=False)),
                ('is_rider', models.BooleanField(default=False)),
                ('username', models.CharField(blank=True, default='user', max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('user', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='users.baseuser')),
                ('password', models.CharField(default='', max_length=100)),
                ('email', models.CharField(max_length=100)),
                ('balance', models.FloatField(default=0.0)),
                ('phone', models.CharField(default='00000', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('user', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='users.baseuser')),
                ('name', models.CharField(blank=True, default='restaurant', max_length=100)),
                ('password', models.CharField(default='', max_length=100)),
                ('email', models.CharField(max_length=100)),
                ('balance', models.FloatField(default=0.0)),
                ('position', models.CharField(max_length=100)),
                ('phone', models.CharField(default='00000000', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Rider',
            fields=[
                ('user', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='users.baseuser')),
                ('status', models.CharField(max_length=100)),
                ('position', models.CharField(max_length=100)),
                ('balance', models.FloatField()),
                ('phone', models.CharField(default='00000000', max_length=20)),
            ],
        ),
    ]
