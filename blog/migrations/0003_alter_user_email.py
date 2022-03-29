# Generated by Django 4.0.3 on 2022-03-25 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(error_messages={'unique': 'Email already exists .'}, max_length=254, unique=True, verbose_name='email address'),
        ),
    ]
