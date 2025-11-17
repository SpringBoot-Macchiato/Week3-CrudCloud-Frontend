# 🚀 Guía de Integración Frontend-Backend

## ✅ Estado Actual

### Frontend (feature/backend-integration)
- ✅ Login integrado con `/api/auth/login`
- ✅ Manejo de JWT tokens
- ✅ Error handling implementado
- ✅ Loading states en UI
- ✅ Demo mode desactivado

### Backend (develop)
- ✅ `application.properties` creado con CORS configurado
- ✅ Todos los endpoints implementados
- ✅ JWT authentication funcional
- ✅ Multi-engine support (MySQL, PostgreSQL, SQL Server)

---

## 🔧 Configuración Necesaria

### 1. Base de Datos MySQL

```sql
-- Crear base de datos principal
CREATE DATABASE crudcloud;

-- Verificar
SHOW DATABASES;
```

### 2. Configurar application.properties

El archivo ya está creado en:
```
/Users/usuario/Desktop/Java/Week3-CrudCloud-Backend/crudcloud-backend/src/main/resources/application.properties
```

**IMPORTANTE:** Actualiza estos valores según tu configuración local:

```properties
# MySQL Password (línea 13)
spring.datasource.password=TU_PASSWORD_DE_MYSQL

# MySQL Admin Password para crear instancias (línea 34)
engines.ds.mysql.password=TU_PASSWORD_DE_MYSQL

# PostgreSQL (si lo tienes instalado)
engines.ds.postgres.password=TU_PASSWORD_DE_POSTGRES
```

### 3. Crear Usuario de Prueba

#### Opción A: Usando curl (después de levantar el backend)

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@crudcloud.com",
    "password": "test123456",
    "fullName": "Test User",
    "role": "USER"
  }'
```

#### Opción B: Usando SQL directo

```sql
USE crudcloud;

-- El backend creará las tablas automáticamente
-- Solo necesitas ejecutar el registro via API después de levantar el servidor
```

---

## 🚀 Levantar el Proyecto

### Terminal 1: Backend

```bash
cd ~/Desktop/Java/Week3-CrudCloud-Backend/crudcloud-backend

# Compilar y ejecutar
./mvnw clean spring-boot:run

# O si usas Maven global
mvn clean spring-boot:run
```

**Verificar que funciona:**
```bash
curl http://localhost:8080/api/plans
# Debe devolver: []
```

### Terminal 2: Frontend

```bash
cd ~/Desktop/Java/Week3-CrudCloud-Frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Levantar frontend
npm run dev
```

**Abrir navegador:**
```
http://localhost:5173
```

---

## 🧪 Probar la Integración

### Paso 1: Registrar Usuario

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@crudcloud.com",
    "password": "test123456",
    "fullName": "Test User",
    "role": "USER"
  }'
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "email": "test@crudcloud.com",
  "fullName": "Test User",
  "role": "USER",
  "enable": true
}
```

### Paso 2: Login desde el Frontend

1. Ve a: `http://localhost:5173/login`
2. Ingresa:
   - Email: `test@crudcloud.com`
   - Password: `test123456`
3. Click en "Continuar"
4. Deberías ser redirigido a `/app/dashboard`

### Paso 3: Verificar Token

Abre DevTools (F12) → Application → Local Storage:
- ✅ Debe haber una key `token` con un JWT
- ✅ Debe haber una key `user` con los datos del usuario

---

## 🐛 Troubleshooting

### Error: "No se pudo conectar con el servidor"

**Causa:** El backend no está corriendo o CORS no está configurado.

**Solución:**
1. Verifica que el backend esté corriendo: `curl http://localhost:8080/api/plans`
2. Revisa que `application.properties` tenga: `app.cors.allowed-origins=http://localhost:5173`
3. Reinicia el backend

### Error: "Credenciales inválidas"

**Causa:** El usuario no existe o la contraseña es incorrecta.

**Solución:**
1. Registra el usuario usando el curl de arriba
2. Verifica que usas el mismo email/password

### Error: "Access to fetch blocked by CORS policy"

**Causa:** CORS no configurado correctamente.

**Solución:**
1. Abre: `/Users/usuario/Desktop/Java/Week3-CrudCloud-Backend/crudcloud-backend/src/main/resources/application.properties`
2. Verifica línea 24: `app.cors.allowed-origins=http://localhost:5173,...`
3. Reinicia el backend

### Backend no arranca

**Error común:** `Access denied for user 'root'@'localhost'`

**Solución:**
1. Actualiza la password en `application.properties` líneas 13 y 34
2. Verifica que MySQL esté corriendo: `mysql -u root -p`

---

## 📁 Estructura de Archivos Importantes

### Frontend
```
src/
├── contexts/AuthContext.jsx       ← Login integrado con backend
├── pages/Login.jsx                ← UI con error handling
├── utils/api.js                   ← Utility para llamadas HTTP
└── .env                           ← VITE_API_URL configurado
```

### Backend
```
src/main/
├── resources/application.properties  ← Configuración CORS + DB
├── java/com/crudzaso/crudcloud_backend/
    ├── config/SecurityConfig.java    ← CORS config
    ├── controller/
    │   ├── AuthController.java       ← /api/auth/login
    │   ├── InstanceController.java   ← /api/instances/*
    │   └── UserController.java       ← /api/users/*
    └── service/
        └── AuthService.java          ← Lógica de autenticación
```

---

## 🎯 Próximos Pasos

Una vez que el login funcione:

1. ✅ **Instancias** - Conectar CRUD de instancias
2. ✅ **Planes** - Mostrar plan activo del usuario
3. ✅ **Mercado Pago** - Integrar flujo de pagos
4. ✅ **Email** - Probar notificaciones

---

## 📞 Comandos Útiles

```bash
# Ver logs del backend en tiempo real
./mvnw spring-boot:run

# Limpiar y recompilar
./mvnw clean install

# Ver base de datos
mysql -u root -p
USE crudcloud;
SHOW TABLES;
SELECT * FROM users;

# Reiniciar frontend
npm run dev
```

---

**¿Dudas?** Revisa la consola del backend y del navegador (F12) para ver errores específicos.

---

**Última actualización:** 2025-01-17
