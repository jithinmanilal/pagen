from django.urls import path
from .views import RegisterView, RetrieveUserView, GenerateRandomPassword, SavePasswordView, UpdateDeletePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('detail/', RetrieveUserView.as_view(), name='user_detail'),
    path('generate/', GenerateRandomPassword.as_view(), name='generate_password'),
    path('password/', SavePasswordView.as_view(), name='save_password'),
    path('password/<int:pk>/', UpdateDeletePasswordView.as_view(), name='update_delete_password'),
]