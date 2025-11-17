# Backend Integration Guide - CrudCloud Frontend

Este documento detalla todos los endpoints que el backend debe implementar para la integración completa del frontend de CrudCloud.

---

## 🔧 Configuración

### Variables de Entorno del Frontend

```env
VITE_API_URL=http://localhost:8080/api
VITE_DEMO_MODE=false
```

- **VITE_API_URL**: URL base del backend
- **VITE_DEMO_MODE**: `true` para modo demo sin backend, `false` para producción

---

## 📡 Endpoints Requeridos

### 1. Autenticación

#### **POST** `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "FREE"
  }
}
```

**Errores:**
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Datos faltantes o inválidos

---

### 2. Gestión de Planes y Pagos

#### **POST** `/payments/create-preference`

Crea una preferencia de pago en Mercado Pago para cambiar de plan.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "plan": "STANDARD",
  "userId": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": "123456789",
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789"
}
```

**Errores:**
- `401 Unauthorized`: Token inválido o expirado
- `400 Bad Request`: Plan inválido
- `500 Internal Server Error`: Error al crear preferencia en Mercado Pago

**Notas:**
- El backend debe configurar las URLs de retorno:
  - `success_url`: `{FRONTEND_URL}/payment/success`
  - `pending_url`: `{FRONTEND_URL}/payment/pending`
  - `failure_url`: `{FRONTEND_URL}/payment/failure`
- Mercado Pago agregará parámetros a estas URLs:
  - `?payment_id={id}&status={status}&external_reference={reference}`

---

#### **POST** `/payments/webhook`

Webhook para recibir notificaciones de Mercado Pago sobre el estado de los pagos.

**Headers:**
```
Content-Type: application/json
```

**Request (ejemplo de Mercado Pago):**
```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "123456789"
  },
  "date_created": "2025-01-15T10:30:00Z",
  "id": 987654321,
  "live_mode": false,
  "type": "payment",
  "user_id": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Webhook processed successfully"
}
```

**Funcionalidad esperada:**
1. Validar que la notificación viene de Mercado Pago
2. Obtener detalles del pago usando el `data.id`
3. Actualizar el plan del usuario según el estado:
   - `approved`: Activar el nuevo plan
   - `pending`: Marcar como pendiente
   - `rejected`: No hacer cambios
4. Enviar correo de confirmación al usuario

---

### 3. Gestión de Instancias

#### **GET** `/instances`

Obtiene todas las instancias del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "instances": [
    {
      "id": "inst-001",
      "name": "my-postgres-db",
      "engine": "POSTGRESQL",
      "version": "15.0",
      "status": "RUNNING",
      "createdAt": "2025-01-15T10:00:00Z",
      "credentials": {
        "host": "db.crudzaso.com",
        "port": 5432,
        "database": "my-postgres-db",
        "username": "user_inst001"
      }
    }
  ],
  "total": 1,
  "limit": 2,
  "currentPlan": "FREE"
}
```

---

#### **POST** `/instances`

Crea una nueva instancia de base de datos.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "engine": "MYSQL",
  "name": "my-custom-name"
}
```

**Response (201 Created):**
```json
{
  "id": "inst-002",
  "name": "my-custom-name",
  "engine": "MYSQL",
  "version": "8.0",
  "status": "CREATING",
  "credentials": {
    "host": "db.crudzaso.com",
    "port": 3306,
    "database": "my-custom-name",
    "username": "user_inst002",
    "password": "Xy9#kL2mP5qR"
  },
  "createdAt": "2025-01-15T11:00:00Z"
}
```

**Errores:**
- `403 Forbidden`: Límite de instancias alcanzado
- `400 Bad Request`: Nombre inválido o motor no soportado

**Notas:**
- La contraseña solo se devuelve en esta respuesta
- El campo `name` es opcional en plan FREE (auto-generado)
- El campo `name` es requerido en planes pagos

---

#### **GET** `/instances/{id}`

Obtiene detalles de una instancia específica.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "inst-001",
  "name": "my-postgres-db",
  "engine": "POSTGRESQL",
  "version": "15.0",
  "status": "RUNNING",
  "createdAt": "2025-01-15T10:00:00Z",
  "credentials": {
    "host": "db.crudzaso.com",
    "port": 5432,
    "database": "my-postgres-db",
    "username": "user_inst001"
  },
  "metrics": {
    "connections": 5,
    "storage": "120MB"
  }
}
```

**Errores:**
- `404 Not Found`: Instancia no encontrada
- `403 Forbidden`: No tienes acceso a esta instancia

---

#### **PUT** `/instances/{id}/status`

Cambia el estado de una instancia (pausar/reanudar).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "action": "SUSPEND"
}
```

**Valores permitidos para `action`:**
- `SUSPEND`: Pausar la instancia
- `RESUME`: Reanudar la instancia

**Response (200 OK):**
```json
{
  "id": "inst-001",
  "status": "SUSPENDED",
  "message": "Instance suspended successfully"
}
```

---

#### **POST** `/instances/{id}/rotate-password`

Rota la contraseña de una instancia.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "inst-001",
  "password": "Qw7#nM4pL8tY",
  "message": "Password rotated successfully"
}
```

**Notas:**
- La nueva contraseña solo se devuelve en esta respuesta
- Se debe enviar un correo al usuario con la nueva contraseña

---

#### **DELETE** `/instances/{id}`

Elimina una instancia permanentemente.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Instance deleted successfully",
  "id": "inst-001"
}
```

**Errores:**
- `404 Not Found`: Instancia no encontrada
- `403 Forbidden`: No tienes acceso a esta instancia

---

### 4. Motores de Base de Datos

#### **GET** `/engines`

Obtiene la lista de motores de base de datos disponibles.

**Response (200 OK):**
```json
{
  "engines": [
    {
      "id": "MYSQL",
      "name": "MySQL",
      "version": "8.0",
      "status": "AVAILABLE",
      "logo": "mysql-logo-url"
    },
    {
      "id": "POSTGRESQL",
      "name": "PostgreSQL",
      "version": "15.0",
      "status": "AVAILABLE",
      "logo": "postgresql-logo-url"
    },
    {
      "id": "MONGODB",
      "name": "MongoDB",
      "version": "7.0",
      "status": "AVAILABLE",
      "logo": "mongodb-logo-url"
    },
    {
      "id": "REDIS",
      "name": "Redis",
      "version": "7.2",
      "status": "AVAILABLE",
      "logo": "redis-logo-url"
    },
    {
      "id": "SQLSERVER",
      "name": "SQL Server",
      "version": "2022",
      "status": "COMING_SOON",
      "logo": "sqlserver-logo-url"
    },
    {
      "id": "CASSANDRA",
      "name": "Cassandra",
      "version": "4.1",
      "status": "COMING_SOON",
      "logo": "cassandra-logo-url"
    }
  ]
}
```

---

### 5. Usuario

#### **GET** `/users/me`

Obtiene información del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "plan": "STANDARD",
  "instancesCount": 3,
  "instancesLimit": 5,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

#### **GET** `/users/me/payment-history`

Obtiene el historial de pagos del usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "payments": [
    {
      "id": "pay-001",
      "plan": "STANDARD",
      "amount": 29.00,
      "currency": "USD",
      "status": "APPROVED",
      "paymentMethod": "credit_card",
      "date": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer {token}
```

El token debe ser un JWT válido que el backend genera en el login.

---

## 📧 Notificaciones por Email

El backend debe enviar correos en los siguientes casos:

### 1. Creación de instancia
- **Asunto:** Nueva instancia creada - {engine_name}
- **Contenido:**
  - Nombre de la instancia
  - Motor y versión
  - Host y puerto
  - Usuario
  - **NO incluir contraseña en texto plano**
  - Link para descargar PDF con credenciales

### 2. Rotación de contraseña
- **Asunto:** Contraseña rotada - {instance_name}
- **Contenido:**
  - Información de la instancia
  - Mensaje de que la contraseña anterior ya no es válida
  - Link para descargar PDF con nueva contraseña

### 3. Cambio de plan exitoso
- **Asunto:** Plan actualizado - {plan_name}
- **Contenido:**
  - Nuevo plan activo
  - Nuevos límites
  - ID de transacción
  - Fecha de renovación

### 4. Pago pendiente
- **Asunto:** Pago pendiente - Esperando confirmación
- **Contenido:**
  - ID de pago
  - Monto
  - Tiempo estimado de confirmación

---

## 🎨 Estados de Instancias

```
CREATING    → Instancia en proceso de creación
RUNNING     → Instancia activa y funcionando
SUSPENDED   → Instancia pausada
DELETED     → Instancia eliminada (soft delete)
ERROR       → Error en la instancia
```

---

## 💳 Estados de Pago (Mercado Pago)

```
approved    → Pago aprobado (actualizar plan)
pending     → Pago pendiente (no actualizar plan aún)
rejected    → Pago rechazado (no actualizar plan)
cancelled   → Pago cancelado (no actualizar plan)
```

---

## 🧪 Testing

### Modo Demo (Sin Backend)
```env
VITE_DEMO_MODE=true
```

### Modo Producción (Con Backend)
```env
VITE_DEMO_MODE=false
VITE_API_URL=http://localhost:8080/api
```

---

## 📝 Notas Adicionales

1. **CORS**: El backend debe permitir requests desde el frontend
2. **Rate Limiting**: Implementar límites para evitar abuso
3. **Validación**: Validar todos los inputs en el backend
4. **Seguridad**:
   - No devolver contraseñas en endpoints GET
   - Hashear contraseñas antes de almacenar
   - Validar tokens en todos los endpoints protegidos
5. **Logs**: Registrar todas las operaciones importantes
6. **Mercado Pago**: Usar sandbox para testing, producción para deploy real

---

## 🚀 URLs de Retorno de Mercado Pago

Configurar en la preferencia de pago:

```javascript
{
  "back_urls": {
    "success": "https://tu-dominio.com/payment/success",
    "pending": "https://tu-dominio.com/payment/pending",
    "failure": "https://tu-dominio.com/payment/failure"
  },
  "auto_return": "approved"
}
```

---

## ✅ Checklist de Integración

- [ ] Endpoint de login implementado
- [ ] Endpoints de instancias (CRUD completo)
- [ ] Endpoint de motores disponibles
- [ ] Endpoint de creación de preferencia de Mercado Pago
- [ ] Webhook de Mercado Pago configurado
- [ ] Sistema de correos implementado
- [ ] Generación de PDFs con credenciales
- [ ] CORS configurado correctamente
- [ ] Variables de entorno configuradas
- [ ] Testing en Mercado Pago Sandbox
- [ ] Documentación de API actualizada

---

**Última actualización:** 2025-01-15
