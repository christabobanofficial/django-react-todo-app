from django.urls import path
from .views import (
    RegisterView,
    TaskListCreateView,
    TaskDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),

    path('', TaskListCreateView.as_view(), name='task-list'),

    path('<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
]

#     path(
#         'login/',
#         TokenObtainPairView.as_view(),
#         name='login'
#     ),

#     path(
#         'token/refresh/',
#         TokenRefreshView.as_view(),
#         name='token-refresh'
#     ),

#     path(
#         '',
#         TaskListCreateView.as_view(),
#         name='task-list'
#     ),

#     path(
#         '<int:pk>/',
#         TaskDetailView.as_view(),
#         name='task-detail'
#     ),
# ]