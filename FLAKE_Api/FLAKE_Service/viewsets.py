from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Administrador, Persona, Tutor, horario, Aula, Instituciones, asistencia, Estudiante, Notas,AsistenciaTutor, horario_aula
from .serializers import AdminSerializer, EstudianteUpdateSerializer, NotasDetailSerializer, PersonaSerializer, TutorDetailSerializer,TutorCreateSerializer,AsistenciaTutorSerializer,EstudianteCreateSerializer, EstudianteDetailSerializer,HorarioSerializer, AulaSerializer, InstitucionSerializer, AsistenciaSerializer, fullnameEstudianteSerializer,NotasSerializer, HorarioAulaSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser  
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from datetime import datetime
from django.db import transaction

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdminSerializer

    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'cedula': openapi.Schema(type=openapi.TYPE_STRING, description='Cédula'),
                'primer_nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Primer nombre'),
                'segundo_nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Segundo nombre'),
                'primer_apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Primer apellido'),
                'segundo_apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Segundo apellido'),
                'genero': openapi.Schema(type=openapi.TYPE_STRING, description='Género'),
                'fecha_nacimiento': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='Fecha de nacimiento'),
                'estrato': openapi.Schema(type=openapi.TYPE_STRING, description='Estrato'),
                'correo': openapi.Schema(type=openapi.TYPE_STRING, description='Correo electrónico'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
            },
            required=['primer_nombre', 'primer_apellido', 'genero', 'fecha_nacimiento', 'estrato', 'correo', 'password'],
        ),
        responses={201: AdminSerializer, 400: 'Bad Request'}
    )
    @action(detail=False, methods=['post'])
    def create_admin(self, request):
        cedula = request.data.get("cedula")
        persona = Persona.objects.filter(cedula=cedula).first()
        if not persona:   
            persona_data = {
                "cedula": cedula,
                "primer_nombre": request.data.get("primer_nombre"),
                "segundo_nombre": request.data.get("segundo_nombre"),
                "primer_apellido": request.data.get("primer_apellido"),
                "segundo_apellido": request.data.get("segundo_apellido"),
                "genero": request.data.get("genero"),
                "fecha_nacimiento": request.data.get("fecha_nacimiento"),
                "estrato": request.data.get("estrato"),
                "password": request.data.get("password")
            }
        
       
            persona_serializer = PersonaSerializer(data=persona_data)
        
            if persona_serializer.is_valid():
                persona = persona_serializer.save()
                persona.set_password(persona_data['password']) 
                persona.save()
            else:
                return Response(persona_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            pass   
            
        admin_data = {  
            "correo": request.data.get("correo"),
            "persona": persona.id
                }
        admin_serializer = AdminSerializer(data=admin_data)
            
        if admin_serializer.is_valid():
            admin_serializer.save()
            return Response(admin_serializer.data, status=status.HTTP_201_CREATED)
        else:
            if not persona:
                persona.delete()
            return Response(admin_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all()
    def get_serializer_class(self):
        
        if self.action == 'create' or self.action == 'creartutor':
            return TutorCreateSerializer
        elif self.action in ['retrieve', 'get_tutor_por_persona', 'update', 'partial_update']:
            return TutorDetailSerializer
        return TutorCreateSerializer
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        persona = instance.persona
        persona.delete()
        
        return super().destroy(request, *args, **kwargs)
    
    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'persona': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
                        'last_login': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, description='Último inicio de sesión'),
                        'is_superuser': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Es superusuario'),
                        'cedula': openapi.Schema(type=openapi.TYPE_STRING, description='Cédula'),
                        'primer_nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Primer nombre'),
                        'segundo_nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Segundo nombre'),
                        'primer_apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Primer apellido'),
                        'segundo_apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Segundo apellido'),
                        'genero': openapi.Schema(type=openapi.TYPE_STRING, description='Género'),
                        'fecha_nacimiento': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='Fecha de nacimiento'),
                        'estrato': openapi.Schema(type=openapi.TYPE_STRING, description='Estrato'),
                        'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Está activo'),
                        'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Es miembro del staff'),
                        'groups': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER), description='Grupos'),
                        'user_permissions': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER), description='Permisos de usuario'),
                    },
                    required=[
                        'password', 'cedula', 'primer_nombre', 'primer_apellido',
                        'genero', 'fecha_nacimiento', 'estrato'
                    ],
                ),
                'telefono': openapi.Schema(type=openapi.TYPE_STRING, description='Teléfono'),
                'correo': openapi.Schema(type=openapi.TYPE_STRING, description='Correo electrónico'),
                'direccion': openapi.Schema(type=openapi.TYPE_STRING, description='Dirección'),
                'instituciones': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID de la institución'),
                'aula': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del aula'),
            },
            required=['persona', 'telefono', 'correo', 'direccion', 'instituciones', 'aula'],
        ),
        responses={201: TutorDetailSerializer, 400: 'Bad Request'}
    )
    @action(detail=False, methods=['post'], url_path='creartutor')
    def crear_tutor(self, request):
        # Extraer los datos de 'persona' del request
        persona_data = request.data.get('persona')
        if not persona_data:
            return Response({'persona': ['Este campo es requerido.']}, status=status.HTTP_400_BAD_REQUEST)
        
        # Remover campos innecesarios de persona_data
        campos_no_requeridos = ['id', 'last_login', 'is_superuser', 'is_active', 'is_staff', 'groups', 'user_permissions']
        for campo in campos_no_requeridos:
            persona_data.pop(campo, None)
        
        # Crear instancia de Persona
        persona_serializer = PersonaSerializer(data=persona_data)
        if persona_serializer.is_valid():
            persona = persona_serializer.save()
            persona.set_password(persona_data['password'])
            persona.save()
        else:
            return Response(persona_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Preparar datos para Tutor
        tutor_data = {
            'telefono': request.data.get('telefono'),
            'correo': request.data.get('correo'),
            'direccion': request.data.get('direccion'),
            'persona': persona.id,
            'instituciones': request.data.get('instituciones'),
            'aula': request.data.get('aula'),
        }
        
        # Crear instancia de Tutor
        tutor_serializer = TutorCreateSerializer(data=tutor_data)
        if tutor_serializer.is_valid():
            tutor_serializer.save()
            return Response(tutor_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Eliminar la persona creada si el tutor no es válido
            persona.delete()
            return Response(tutor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['get'], url_path='detalle')
    def get_tutor_por_persona(self, request, pk=None):
        try:
            persona = Persona.objects.get(pk=pk)
            tutor = Tutor.objects.get(persona=persona)
            serializer = TutorDetailSerializer(tutor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Persona.DoesNotExist:
            return Response({"error": "Persona no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Tutor.DoesNotExist:
            return Response({"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        

    @action(detail=False, methods=['get'], url_path='listar-tutores')
    def listar_tutores(self, request):
        tutores = Tutor.objects.all()
        serializer = TutorDetailSerializer(tutores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='por-aula/(?P<aula_id>[^/.]+)')
    def tutores_por_aula(self, request, aula_id=None):
        try:
            aula = Aula.objects.get(pk=aula_id)
        except Aula.DoesNotExist:
            return Response({"error": "Aula no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        tutores = Tutor.objects.filter(aula=aula)
        serializer = TutorDetailSerializer(tutores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        request_body=TutorDetailSerializer,
        responses={200: TutorDetailSerializer, 400: 'Bad Request'}
    )
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        persona_data = request.data.pop('persona', None)
        if persona_data:
            persona_serializer = PersonaSerializer(instance.persona, data=persona_data, partial=partial)
            if persona_serializer.is_valid():
                persona_serializer.save()
            else:
                return Response(persona_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        request.data['persona'] = instance.persona.id

        tutor_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if tutor_serializer.is_valid():
            tutor_serializer.save()
            return Response(tutor_serializer.data)
        return Response(tutor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        request_body=TutorDetailSerializer,
        responses={200: TutorDetailSerializer, 400: 'Bad Request'}
    )
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    





class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'crearestudiante':
            return EstudianteCreateSerializer
        elif self.action == 'retrieve' or self.action == 'get_estudiante_por_persona':
            return EstudianteDetailSerializer
        return EstudianteCreateSerializer

    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'cedula': openapi.Schema(type=openapi.TYPE_STRING, description='Cédula'),
                'primer_nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Primer nombre'),
                'segundo_nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Segundo nombre'),
                'primer_apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Primer apellido'),
                'segundo_apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Segundo apellido'),
                'genero': openapi.Schema(type=openapi.TYPE_STRING, description='Género'),
                'fecha_nacimiento': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='Fecha de nacimiento'),
                'estrato': openapi.Schema(type=openapi.TYPE_STRING, description='Estrato'),
                'correo': openapi.Schema(type=openapi.TYPE_STRING, description='Correo electrónico'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
                'instituciones': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID de la institución'),
                'aula': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del aula'),
            },
            required=['primer_nombre', 'primer_apellido', 'genero', 'fecha_nacimiento', 'estrato', 'correo', 'cedula', 'instituciones', 'aula'],
        ),
        responses={201: EstudianteDetailSerializer, 400: 'Bad Request'}
    )
    @action(detail=False, methods=['post'], url_path='crearestudiante')
    def crear_estudiante(self, request):
        persona_data = {
            "cedula": request.data.get("cedula"),
            "primer_nombre": request.data.get("primer_nombre"),
            "segundo_nombre": request.data.get("segundo_nombre"),
            "primer_apellido": request.data.get("primer_apellido"),
            "segundo_apellido": request.data.get("segundo_apellido"),
            "genero": request.data.get("genero"),
            "fecha_nacimiento": request.data.get("fecha_nacimiento"),
            "estrato": request.data.get("estrato"),
            "password": request.data.get("password"),
        }
        
        persona_serializer = PersonaSerializer(data=persona_data)
        if persona_serializer.is_valid():
            persona = persona_serializer.save()
            persona.set_password(persona_data['password'])
            persona.save()
        else:
            return Response(persona_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        estudiante_data = {
            "persona": persona.id,
            "instituciones": request.data.get("instituciones"),
            "aula": request.data.get("aula"),
        }

        estudiante_serializer = EstudianteCreateSerializer(data=estudiante_data)
        if estudiante_serializer.is_valid():
            estudiante_serializer.save()
            return Response(estudiante_serializer.data, status=status.HTTP_201_CREATED)
        else:
            persona.delete()
            return Response(estudiante_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='detalle')
    def get_estudiante_por_persona(self, request, pk=None):
        try:
            persona = Persona.objects.get(pk=pk)
            estudiante = Estudiante.objects.get(persona=persona)
            serializer = EstudianteDetailSerializer(estudiante)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Persona.DoesNotExist:
            return Response({"error": "Persona no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Estudiante.DoesNotExist:
            return Response({"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='listar-estudiantes')
    def listar_estudiantes(self, request):
        estudiantes = Estudiante.objects.all()
        serializer = EstudianteDetailSerializer(estudiantes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'], url_path='por-aula/(?P<aula_id>[^/.]+)')
    def estudiantes_por_aula(self, request, aula_id=None):
        try:
            aula = Aula.objects.get(pk=aula_id)
        except Aula.DoesNotExist:
            return Response({"error": "Aula no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        estudiantes = Estudiante.objects.filter(aula=aula)
        serializer = EstudianteUpdateSerializer(estudiantes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        request_body=EstudianteUpdateSerializer,
        responses={200: EstudianteUpdateSerializer, 400: 'Bad Request'}
    )
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        persona_data = request.data.pop('persona', None)
        if persona_data:
            persona_serializer = PersonaSerializer(instance.persona, data=persona_data, partial=partial)
            if persona_serializer.is_valid():
                persona_serializer.save()
            else:
                return Response(persona_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        request.data['persona'] = instance.persona.id

        estudiante_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if estudiante_serializer.is_valid():
            estudiante_serializer.save()
            return Response(estudiante_serializer.data)
        return Response(estudiante_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        request_body=EstudianteUpdateSerializer,
        responses={200: EstudianteUpdateSerializer, 400: 'Bad Request'}
    )
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)






class NotasViewSet(viewsets.ModelViewSet):
    queryset = Notas.objects.all()
    serializer_class = NotasSerializer

    @action(detail=False, methods=['post'], url_path='registrar-notas')
    def registrar_notas(self, request):
        """
        Permite que un tutor registre o actualice las notas de un estudiante.
        """
        tutor_id = request.data.get('tutor')
        estudiante_id = request.data.get('estudiante')
        aula_id = request.data.get('aula')
        bloque1 = request.data.get('bloque1')
        bloque2 = request.data.get('bloque2')
        bloque3 = request.data.get('bloque3')
        bloque4 = request.data.get('bloque4')

        # Validar que todos los datos requeridos estén presentes
        if not all([tutor_id, estudiante_id, aula_id]):
            return Response(
                {"error": "Los campos tutor_id, estudiante_id y aula_id son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verificar que el tutor exista
            tutor = Tutor.objects.get(idtutor=tutor_id)

            # Verificar que el estudiante exista
            estudiante = Estudiante.objects.get(idestudiante=estudiante_id)

            # Verificar que el aula sea válida y que el tutor esté asignado a ella
            if tutor.aula.idaula != int(aula_id):
                return Response(
                    {"error": "El tutor no está asignado al aula proporcionada."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Crear o actualizar las notas
            notas, created = Notas.objects.get_or_create(
                estudiante=estudiante,
                aula_id=aula_id,
                tutor=tutor,
                defaults={
                    "bloque1": bloque1,
                    "bloque2": bloque2,
                    "bloque3": bloque3,
                    "bloque4": bloque4,
                },
            )

            # Actualizar si ya existe
            if not created:
                if bloque1 is not None:
                    notas.bloque1 = bloque1
                if bloque2 is not None:
                    notas.bloque2 = bloque2
                if bloque3 is not None:
                    notas.bloque3 = bloque3
                if bloque4 is not None:
                    notas.bloque4 = bloque4
                notas.calcular_calificacion_final()
                notas.save()

            serializer = NotasSerializer(notas)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Tutor.DoesNotExist:
            return Response({"error": "El tutor no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Estudiante.DoesNotExist:
            return Response({"error": "El estudiante no existe."}, status=status.HTTP_404_NOT_FOUND)
    

    @action(detail=False, methods=['get'], url_path='estudiantes-por-aula/(?P<aula_id>[^/.]+)')
    def estudiantes_por_aula(self, request, aula_id=None):
        try:
            aula = Aula.objects.get(idaula=aula_id)
            estudiantes = Estudiante.objects.filter(aula=aula)

            resultados = []
            for estudiante in estudiantes:
                try:
                    notas = Notas.objects.get(estudiante=estudiante, aula=aula)
                except Notas.DoesNotExist:
                    notas = Notas(
                        estudiante=estudiante,
                        aula=aula,
                        bloque1=0.0,
                        bloque2=0.0,
                        bloque3=0.0,
                        bloque4=0.0,
                        calificacion_final=0.0
                    )
                serializer = NotasDetailSerializer(notas)
                resultados.append(serializer.data)

            return Response(resultados, status=status.HTTP_200_OK)
        except Aula.DoesNotExist:
            return Response({"error": "El aula especificada no existe."}, status=status.HTTP_404_NOT_FOUND)
        

    @action(detail=False, methods=['put'], url_path='actualizar-notas/(?P<estudiante_id>[^/.]+)/(?P<aula_id>[^/.]+)')
    def actualizar_notas(self, request, estudiante_id=None, aula_id=None):
        """
        Actualiza las notas de un estudiante en un aula específica.
        """
        bloque1 = request.data.get('bloque1')
        bloque2 = request.data.get('bloque2')
        bloque3 = request.data.get('bloque3')
        bloque4 = request.data.get('bloque4')

        try:
            estudiante = Estudiante.objects.get(idestudiante=estudiante_id)
            aula = Aula.objects.get(idaula=aula_id)

            notas, created = Notas.objects.get_or_create(
                estudiante=estudiante,
                aula=aula,
                defaults={
                    "bloque1": bloque1,
                    "bloque2": bloque2,
                    "bloque3": bloque3,
                    "bloque4": bloque4,
                },
            )

            if not created:
                if bloque1 is not None:
                    notas.bloque1 = bloque1
                if bloque2 is not None:
                    notas.bloque2 = bloque2
                if bloque3 is not None:
                    notas.bloque3 = bloque3
                if bloque4 is not None:
                    notas.bloque4 = bloque4
                notas.calcular_calificacion_final()
                notas.save()

            serializer = NotasSerializer(notas)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Estudiante.DoesNotExist:
            return Response({"error": "El estudiante no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Aula.DoesNotExist:
            return Response({"error": "El aula especificada no existe."}, status=status.HTTP_404_NOT_FOUND)


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


#NUEVOOOOOO    
class HorarioViewSet(viewsets.ModelViewSet):
    queryset = horario.objects.all()
    serializer_class = HorarioSerializer

    @action(detail=False, methods=['post'])
    def crear_horario_con_profesor(self, request):
        data = request.data
        profesor_id = data.get("profesor")
        fecha_inicio=data.get("fechainicio")
        fecha_final=data.get("fechafin")
        hora_inicio_str = data.get("hora_inicio")  
        hora_fin_str = data.get("hora_fin") 
        dia_inicial = data.get("diainicial") 
        dia_inicial_text = data.get("diainicial_text") 
        

        try:
            profesor = Tutor.objects.get(idtutor=profesor_id)  
        except Tutor.DoesNotExist:
            return Response({"error": "El profesor no existe."}, status=status.HTTP_404_NOT_FOUND)

        
        try:
            hora_inicio = datetime.strptime(hora_inicio_str, '%H:%M').time()
            hora_fin = datetime.strptime(hora_fin_str, '%H:%M').time()
        except ValueError:
            return Response({"error": "El formato de la hora es inválido. Usa 'HH:MM'."}, status=status.HTTP_400_BAD_REQUEST)


        horarios_existentes = horario.objects.filter(
            profesor=profesor,
            hora_inicio__lt=hora_fin,  
            hora_fin__gt=hora_inicio  
        )

        if horarios_existentes.exists():
            return Response(
                {"error": "El profesor ya tiene una clase en esta franja horaria."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(profesor=profesor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#NUEVOOO
class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer
    
    @action(detail=False, methods=['post'])
    def crear_aula(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='lista-estudiantes')
    def lista_estudiantes(self, request, pk=None):
        aula = self.get_object()
        estudiantes = aula.estudiantes.all()
        serializer = fullnameEstudianteSerializer(estudiantes, many=true)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#NUEVOOOOO
class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Instituciones.objects.all()
    serializer_class = InstitucionSerializer
    
    @action(detail=False, methods=['post'])
    def create_institucion(self, request):
        serializer = InstitucionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = asistencia.objects.all()
    serializer_class = AsistenciaSerializer

    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'tutor_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del tutor'),
                'aula_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del aula'),
                'fechaclase': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='Fecha de la clase'),
                'asistencias': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'estudiante_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del estudiante'),
                            'estado': openapi.Schema(type=openapi.TYPE_STRING, description='Estado de asistencia ("O", "A", "X")')
                        },
                        required=['estudiante_id', 'estado']
                    ),
                    description='Lista de asistencias de estudiantes'
                )
            },
            required=['tutor_id', 'aula_id', 'fechaclase', 'asistencias']
        ),
        responses={200: 'Asistencias registradas exitosamente', 400: 'Bad Request'}
    )
    @action(detail=False, methods=['post'], url_path='tomar-asistencia')
    def tomar_asistencia(self, request):
        tutor_id = request.data.get('tutor_id')
        aula_id = request.data.get('aula_id')
        fechaclase = request.data.get('fechaclase')
        asistencias_data = request.data.get('asistencias', [])

        # Obtener la instancia de Aula
        try:
            aula = Aula.objects.get(idaula=aula_id)
        except Aula.DoesNotExist:
            return Response({'error': 'Aula no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener la instancia de Tutor
        try:
            tutor = Tutor.objects.get(idtutor=tutor_id)
        except Tutor.DoesNotExist:
            return Response({'error': 'Tutor no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Procesar las asistencias
        errores = []
        for asistencia_item in asistencias_data:
            estudiante_id = asistencia_item.get('estudiante_id')
            estado = asistencia_item.get('estado', ' ')

            # Obtener la instancia de Estudiante
            try:
                estudiante = Estudiante.objects.get(idestudiante=estudiante_id)
            except Estudiante.DoesNotExist:
                errores.append({'estudiante': estudiante_id, 'error': 'Estudiante no encontrado.'})
                continue

            # Registrar o actualizar la asistencia
            asistencia_obj, created = asistencia.objects.update_or_create(
                estudiante=estudiante,
                fechaclase=fechaclase,
                aula=aula,
                tutor=tutor,
                defaults={
                    'estado': estado,
                }
            )

        # Responder con los errores si los hubo
        if errores:
            return Response({'errores': errores}, status=status.HTTP_207_MULTI_STATUS)

        return Response({'mensaje': 'Asistencias registradas exitosamente.'}, status=status.HTTP_200_OK)

class HorarioAulaViewSet(viewsets.ModelViewSet):
    queryset = horario_aula.objects.all()
    serializer_class = HorarioAulaSerializer
    @action(detail=False, methods=['post'], url_path='crear-horario-poraula')
    def crear_horario_poraula(self, request):
        data = request.data
        aula_id = data.get("aula")
        fecha_inicio = data.get("fechainicio")
        fecha_final = data.get("fechafin")
        hora_inicio_str = data.get("hora_inicio")
        hora_fin_str = data.get("hora_fin")
        dia_inicial = data.get("diainicial")
        dia_inicial_text = data.get("diainicial_text")
        
        # Validar que el aula exista
        try:
            aula = Aula.objects.get(idaula=aula_id)
        except Aula.DoesNotExist:
            return Response({"error": "El aula especificada no existe."}, status=status.HTTP_404_NOT_FOUND)

        # Validar el formato de las horas
        try:
            hora_inicio = datetime.strptime(hora_inicio_str, '%H:%M').time()
            hora_fin = datetime.strptime(hora_fin_str, '%H:%M').time()
        except ValueError:
            return Response({"error": "El formato de la hora es inválido. Usa 'HH:MM'."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que la hora de inicio sea antes de la hora de fin
        if hora_inicio >= hora_fin:
            return Response({"error": "La hora de inicio debe ser antes de la hora de fin."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que el horario no se solape con uno existente
        horarios_existentes = horario_aula.objects.filter(
            aula=aula,
            diainicial=dia_inicial,
            hora_inicio__lt=hora_fin,
            hora_fin__gt=hora_inicio
        )
        if horarios_existentes.exists():
            return Response({"error": "El horario se cruza con otro existente para esta aula."}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el horario
        horario_data = {
            "aula": aula.idaula,
            "fechainicio": fecha_inicio,
            "fechafin": fecha_final,
            "hora_inicio": hora_inicio,
            "hora_fin": hora_fin,
            "diainicial": dia_inicial,
            "diainicial_text": dia_inicial_text
        }

        serializer = HorarioAulaSerializer(data=horario_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class AsistenciaTutorViewSet(viewsets.ModelViewSet):
    queryset = AsistenciaTutor.objects.all()
    serializer_class = AsistenciaTutorSerializer

    @action(detail=False, methods=['post'], url_path='registrar')
    def registrar_asistencia(self, request):
        tutor_id = request.data.get('tutor')
        aula_id = request.data.get('aula')
        fecha_asistencia = request.data.get('fecha_asistencia')  # Formato YYYY-MM-DD
        hora_inicio = request.data.get('hora_inicio')  # Formato HH:MM

        # Validar tutor
        try:
            tutor = Tutor.objects.get(idtutor=tutor_id)
        except Tutor.DoesNotExist:
            return Response({"error": "El tutor no existe."}, status=status.HTTP_404_NOT_FOUND)

        # Validar aula
        try:
            aula = Aula.objects.get(idaula=aula_id)  # Si Aula tiene un campo `id`
        except Aula.DoesNotExist:
            return Response({"error": "El aula no existe."}, status=status.HTTP_404_NOT_FOUND)

        # Validar fecha y hora
        try:
            fecha_asistencia = datetime.strptime(fecha_asistencia, '%Y-%m-%d').date()
            hora_inicio = datetime.strptime(hora_inicio, '%H:%M').time()
        except ValueError:
            return Response({"error": "Formato de fecha u hora inválido. Usa 'YYYY-MM-DD' y 'HH:MM'."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Crear el registro de asistencia
        asistencia_data = {
            "tutor": tutor.idtutor,
            "aula": aula.idaula,
            "fecha_asistencia": fecha_asistencia,
            "hora_inicio": hora_inicio,
        }

        serializer = AsistenciaTutorSerializer(data=asistencia_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
