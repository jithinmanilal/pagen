from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from django.contrib.auth import get_user_model
from .serializers import UserCreateSerializer, UserSerializer, SavePasswordSerializer
from .models import SavePassword
import string
import random
from drf_yasg.utils import swagger_auto_schema

User = get_user_model()



class RegisterView(APIView):
    """
    This view allows you to register a new user.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        print(data)
        serializer = UserCreateSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.create(serializer.validated_data)
        return Response(status=status.HTTP_201_CREATED)


class RetrieveUserView(APIView):    
    """
    This view allows you to get authenticated user's details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = UserSerializer(user)
        return Response(user.data, status=status.HTTP_200_OK)
    

class GenerateRandomPassword(APIView):
    """
    This view allows you to generate a random password.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            data = request.data
            p_length = int(data['p_length'])
            cap_length = int(data['cap_length'])
            num_length = int(data['num_length'])
            schar_length = int(data['schar_length'])

            if p_length < cap_length + num_length + schar_length:
                return Response({"error": "Invalid password configuration"}, status=status.HTTP_400_BAD_REQUEST)
            elif p_length < 8 or p_length > 36:
                return Response({"error": "Password length must be between 8 and 36 characters."}, status=status.HTTP_400_BAD_REQUEST)

            l_length = p_length - (cap_length + num_length + schar_length)

            s1 = string.ascii_lowercase
            s2 = string.ascii_uppercase
            s3 = string.digits
            s4 = string.punctuation

            s1 = ''.join(random.sample(s1, l_length))
            s2 = ''.join(random.sample(s2, cap_length))
            s3 = ''.join(random.sample(s3, num_length))
            s4 = ''.join(random.sample(s4, schar_length))

            password = s1 + s2 + s3 + s4
            password = ''.join(random.sample(password, len(password)))

            return Response({"password": password}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Handle any unexpected exceptions
            return Response({"error": "An error occurred while generating the password."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SavePasswordView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SavePasswordSerializer
    
    def get(self, request):
        """
        This view allows you to get all the passwords saved by the user.
        """
        user = request.user
        queryset = SavePassword.objects.filter(user=user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        This view allows you to save a password.
        """
        try:
            # title = request.data.get('title')
            # password = request.data.get('password')
            serializer = self.serializer_class(data=request.data)
            
            if serializer.is_valid():
                serializer.save(user=request.user)  # Automatically populate 'user'
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UpdateDeletePasswordView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SavePasswordSerializer
    queryset = SavePassword.objects.all()

    def get_queryset(self):
        """
        Return the queryset for this view.
        """
        return self.queryset

    def put(self, request, pk):
        """
        This view allows you to update a password as necessary.
        """
        try:
            obj = SavePassword.objects.get(pk=pk)
            serializer = self.serializer_class(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except SavePassword.DoesNotExist:
            return Response("Not found in the database.", status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """
        This view allows you to delete a password as necessary.
        """
        try:
            obj = SavePassword.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except SavePassword.DoesNotExist:
            return Response("Not found in the database.", status=status.HTTP_404_NOT_FOUND)