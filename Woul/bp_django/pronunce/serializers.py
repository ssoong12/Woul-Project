# serializers.py
from rest_framework import serializers
from bp_django.models import Word, UserWord

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'

class UserWordSerializer(serializers.ModelSerializer):
    word = WordSerializer()

    class Meta:
        model = UserWord
        fields = '__all__'
