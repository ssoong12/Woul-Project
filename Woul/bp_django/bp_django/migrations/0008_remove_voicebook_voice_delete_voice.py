# Generated by Django 4.2 on 2023-06-27 08:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("bp_django", "0007_alter_dialogue_meaning_alter_dialogue_text"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="voicebook",
            name="voice",
        ),
        migrations.DeleteModel(
            name="Voice",
        ),
    ]
