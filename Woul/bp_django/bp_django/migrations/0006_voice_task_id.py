# Generated by Django 4.2 on 2023-06-26 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bp_django", "0005_remove_answer_question_inner_id_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="voice",
            name="task_id",
            field=models.CharField(max_length=50, null=True),
        ),
    ]