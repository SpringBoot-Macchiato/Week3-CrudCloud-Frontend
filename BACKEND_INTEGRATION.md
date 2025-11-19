# 🔌 Backend Integration Guide

Este documento describe cómo el frontend se integra con el backend para gestionar planes y pagos de forma dinámica.

---

## 📋 Tabla de Contenidos

- [Endpoints del Backend](#endpoints-del-backend)
- [Servicios del Frontend](#servicios-del-frontend)
- [Flujo de Autenticación](#flujo-de-autenticación)
- [Flujo de Compra de Planes](#flujo-de-compra-de-planes)
- [Variables de Entorno](#variables-de-entorno)
- [Ejemplo de Uso](#ejemplo-de-uso)

---

## 🚀 Endpoints del Backend

### Plans

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/plans` | Obtiene todos los planes disponibles | No |
| `GET` | `/api/plans/{id}` | Obtiene un plan específico por ID | No |

**Respuesta de `/api/plans`:**
```json
[
  {
    "id": 1,
    "name": "STANDARD",
    "price": 1000,
    "maxInstances": 5,
    "features": {
      "customName": true,
      "prioritySupport": true,
      "passwordRotation": true,
      "autoBackups": false
    }
  },
  {
    "id": 2,
    "name": "PREMIUM",
    "price": 2000,
    "maxInstances": 10,
    "features": {
      "customName": true,
      "prioritySupport": true,
      "passwordRotation": true,
      "autoBackups": true
    }
  }
]
```

### Payments

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/payments/my` | Obtiene los pagos del usuario autenticado | Sí |
| `POST` | `/api/payments/create/plan` | Crea una preferencia de pago para un plan | Sí |

**Request de `/api/payments/create/plan`:**
```json
{
  "planId": 1
}
```

**Respuesta:**
```json
{
  "preferenceId": "123456789-abc-def-ghi-jklmnopqrst"
}
```

**Respuesta de `/api/payments/my`:**
```json
[
  {
    "id": 1,
    "amount": 1000,
    "currency": "COP",
    "status": "approved",
    "externalReference": "STANDARD",
    "paymentId": "MP-123456",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### User Plans

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users-plans/user/{userId}/active` | Obtiene el plan activo del usuario | Sí |
| `GET` | `/api/users-plans/user/{userId}` | Obtiene el historial de planes del usuario | Sí |

**Respuesta de `/api/users-plans/user/{userId}/active`:**
```json
{
  "id": 5,
  "userId": 123,
  "planId": 2,
  "planName": "PREMIUM",
  "startDate": "2025-01-01",
  "endDate": "2025-02-01",
  "isActive": true,
  "maxInstances": 10
}
```

---

## 🛠️ Servicios del Frontend

El archivo `src/utils/apiServices.js` contiene todas las funciones para interactuar con el backend.

### Funciones Principales

```javascript
import {
  getPlans,
  getPlanById,
  getMyPayments,
  createPlanCheckout,
  getUserActivePlan,
  getUserPlansHistory,
  formatPrice,
  formatDate,
  getPaymentStatusText
} from '../utils/apiServices'
```

### Ejemplo: Obtener Planes

```javascript
const planes = await getPlans()
console.log(planes)
// [{ id: 1, name: "STANDARD", price: 1000, ... }]
```

### Ejemplo: Crear Checkout de MercadoPago

```javascript
const { preferenceId } = await createPlanCheckout(1)

// Abrir checkout con el SDK de MercadoPago
mp.checkout({
  preference: { id: preferenceId },
  autoOpen: true
})
```

### Ejemplo: Obtener Plan Activo del Usuario

```javascript
const activePlan = await getUserActivePlan(userId)
console.log(activePlan.planName) // "PREMIUM"
```

---

## 🔐 Flujo de Autenticación

### 1. Login con Google OAuth

1. El usuario hace clic en "Iniciar sesión con Google"
2. Google devuelve un `credential` token
3. El frontend envía el token al backend: `POST /api/auth/google/login`
4. El backend valida el token y devuelve:
   ```json
   {
     "token": "JWT_TOKEN",
     "email": "user@example.com",
     "userId": 123,
     "role": "USER"
   }
   ```
5. El frontend guarda el JWT y el userId en localStorage

### 2. AuthContext Modificado

El `AuthContext` ahora guarda el **userId** del usuario:

```javascript
const user = {
  userId: 123,         // ✅ Nuevo campo agregado
  email: "user@example.com",
  name: "John Doe",
  role: "USER",
  plan: "FREE"
}
```

---

## 💳 Flujo de Compra de Planes

### 1. Usuario Selecciona un Plan

```javascript
const handlePlanChange = async (plan) => {
  // 1. Verificar autenticación
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Debes iniciar sesión')
    return
  }

  // 2. Crear preferencia de pago
  const { preferenceId } = await createPlanCheckout(plan.id)

  // 3. Abrir checkout de MercadoPago
  mp.checkout({
    preference: { id: preferenceId },
    autoOpen: true
  })
}
```

### 2. Usuario Completa el Pago

1. MercadoPago redirige a: `/payment/success?payment_id=XXX&status=approved`
2. El backend recibe el webhook de MercadoPago
3. El backend crea el registro en `user_plans` y `payments`

### 3. Usuario Ve su Plan Activo

```javascript
// En MiPlan.jsx
const activePlan = await getUserActivePlan(user.userId)
setUserPlan(activePlan.planName) // "STANDARD" o "PREMIUM"
```

---

## ⚙️ Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```bash
# URL del backend
VITE_API_URL=http://localhost:8080/api

# Modo demo (para probar sin backend)
VITE_DEMO_MODE=false

# Clave pública de MercadoPago
VITE_MERCADOPAGO_PUBLIC_KEY=YOUR_MERCADOPAGO_PUBLIC_KEY
```

---

## 💡 Ejemplo de Uso Completo

### Componente MiPlan.jsx

```javascript
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getPlans, createPlanCheckout, getMyPayments } from '../utils/apiServices'

const MiPlan = () => {
  const { user } = useAuth()
  const [planes, setPlanes] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar planes desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planesData, paymentsData] = await Promise.all([
          getPlans(),
          getMyPayments()
        ])
        setPlanes(planesData)
        setPayments(paymentsData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBuyPlan = async (planId) => {
    try {
      const { preferenceId } = await createPlanCheckout(planId)
      // Abrir checkout...
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Planes Disponibles</h1>
      {planes.map(plan => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>${plan.price} COP/mes</p>
          <button onClick={() => handleBuyPlan(plan.id)}>
            Comprar
          </button>
        </div>
      ))}

      <h2>Historial de Pagos</h2>
      {payments.map(payment => (
        <div key={payment.id}>
          <p>Monto: ${payment.amount}</p>
          <p>Estado: {payment.status}</p>
          <p>Fecha: {payment.createdAt}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔍 Debugging

### Verificar si el Backend está Corriendo

```bash
curl http://localhost:8080/api/plans
```

### Ver el Token JWT

```javascript
console.log(localStorage.getItem('token'))
```

### Ver Errores de API

Todos los errores se loguean en la consola del navegador. Revisa:
- Network tab en DevTools
- Console tab para errores de JavaScript

---

## 🚨 Errores Comunes

### Error: "No se pudo conectar con el servidor"

**Causa:** El backend no está corriendo

**Solución:**
```bash
cd backend
./mvnw spring-boot:run
```

### Error: "401 Unauthorized"

**Causa:** Token JWT inválido o expirado

**Solución:**
1. Cerrar sesión
2. Volver a iniciar sesión
3. El token se renovará automáticamente

### Error: "SDK de Mercado Pago no está cargado"

**Causa:** El script de MercadoPago no se cargó correctamente

**Solución:**
1. Verificar que `index.html` incluya el script:
   ```html
   <script src="https://sdk.mercadopago.com/js/v2"></script>
   ```
2. Recargar la página

---

## 📚 Recursos

- [Documentación de MercadoPago](https://www.mercadopago.com.co/developers/es/docs)
- [React Query para Caché de Datos](https://tanstack.com/query/latest)
- [Axios como alternativa a Fetch](https://axios-http.com/)

---

**Última actualización:** 2025-01-19
