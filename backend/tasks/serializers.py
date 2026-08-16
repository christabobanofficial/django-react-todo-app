from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task


# =========================
# TASK SERIALIZER
# =========================
class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'is_completed',
            'created_at',
            'owner'
        ]

        read_only_fields = [
            'id',
            'created_at',
            'owner'
        ]


# =========================
# REGISTER SERIALIZER
# =========================
class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User
        fields = [
            'username',
            'password'
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )

        return user