from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'is_completed',
        'created_at',
        'owner'
    )

    list_filter = (
        'is_completed',
        'created_at'
    )

# Register your models here.
