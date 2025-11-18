# Backend Integration Guide

Complete guide to connect the React frontend with the Spring Boot backend.

## Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [API Services Structure](#api-services-structure)
3. [Using API Services in Components](#using-api-services-in-components)
4. [Authentication Flow](#authentication-flow)
5. [Error Handling](#error-handling)
6. [Testing the Connection](#testing-the-connection)

---

## Environment Configuration

### 1. Create `.env` file

Create a `.env` file in the root of the frontend project:

```env
VITE_API_URL=http://localhost:8080/api
```

For production:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 2. Environment Variables Explained

- **VITE_API_URL**: Base URL of your backend API
  - Development: `http://localhost:8080/api`
  - Production: Your deployed backend URL

**Important**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

---

## API Services Structure

### Base API Configuration (`src/utils/api.js`)

The base API utility provides generic HTTP methods:
- `api.get(endpoint)` - GET requests
- `api.post(endpoint, data)` - POST requests
- `api.put(endpoint, data)` - PUT requests
- `api.patch(endpoint, data)` - PATCH requests
- `api.delete(endpoint)` - DELETE requests

**Features**:
- Automatic token injection from localStorage
- JSON content-type handling
- Error handling with meaningful messages
- Support for 204 No Content responses

### API Services (`src/utils/apiServices.js`)

Organized services for each backend module:

#### Available Services:
- **healthService**: Backend health checks
- **authService**: Authentication (login, Google OAuth)
- **userService**: User management
- **planService**: Plans CRUD
- **instanceService**: Database instances management
- **paymentService**: Payment processing
- **usersPlanService**: User subscriptions to plans

---

## Using API Services in Components

### Import Services

```javascript
// Import individual services
import { authService, instanceService, planService } from '../utils/apiServices'

// Or import all services
import apiServices from '../utils/apiServices'
```

### Example 1: Login Component

```javascript
import React, { useState } from 'react'
import { authService } from '../utils/apiServices'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await authService.login({ email, password })

      // Save token to localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('userEmail', response.email)
      localStorage.setItem('userRole', response.role)

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Example 2: Fetch and Display Plans

```javascript
import React, { useState, useEffect } from 'react'
import { planService } from '../utils/apiServices'

function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const data = await planService.getAllPlans()
      setPlans(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Available Plans</h2>
      {plans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>{plan.description}</p>
          <p>Price: ${plan.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 3: Create Instance

```javascript
import React, { useState } from 'react'
import { instanceService } from '../utils/apiServices'

function CreateInstance() {
  const [formData, setFormData] = useState({
    name: '',
    dbType: 'MYSQL',
    storageSize: 10
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const instance = await instanceService.createInstance(formData)
      setSuccess(true)
      console.log('Instance created:', instance)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Instance created successfully!</div>}

      <input
        type="text"
        placeholder="Instance name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />

      <select
        value={formData.dbType}
        onChange={(e) => setFormData({...formData, dbType: e.target.value})}
      >
        <option value="MYSQL">MySQL</option>
        <option value="POSTGRESQL">PostgreSQL</option>
        <option value="SQLSERVER">SQL Server</option>
      </select>

      <button type="submit">Create Instance</button>
    </form>
  )
}
```

### Example 4: Manage Instance Actions

```javascript
import React from 'react'
import { instanceService } from '../utils/apiServices'

function InstanceActions({ instanceId, onUpdate }) {
  const handleSuspend = async () => {
    try {
      await instanceService.suspendInstance(instanceId)
      alert('Instance suspended successfully')
      onUpdate()
    } catch (error) {
      alert('Error suspending instance: ' + error.message)
    }
  }

  const handleResume = async () => {
    try {
      await instanceService.resumeInstance(instanceId)
      alert('Instance resumed successfully')
      onUpdate()
    } catch (error) {
      alert('Error resuming instance: ' + error.message)
    }
  }

  const handleRotatePassword = async () => {
    try {
      const newPassword = await instanceService.rotatePassword(instanceId)
      alert(`New password: ${newPassword}\nSave this password securely!`)
      onUpdate()
    } catch (error) {
      alert('Error rotating password: ' + error.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this instance?')) return

    try {
      await instanceService.deleteInstance(instanceId)
      alert('Instance deleted successfully')
      onUpdate()
    } catch (error) {
      alert('Error deleting instance: ' + error.message)
    }
  }

  return (
    <div className="instance-actions">
      <button onClick={handleSuspend}>Suspend</button>
      <button onClick={handleResume}>Resume</button>
      <button onClick={handleRotatePassword}>Rotate Password</button>
      <button onClick={handleDelete} className="danger">Delete</button>
    </div>
  )
}
```

### Example 5: Mercado Pago Integration

```javascript
import React, { useState } from 'react'
import { paymentService } from '../utils/apiServices'

function PurchasePlan({ planId }) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    try {
      // Create Mercado Pago preference
      const { preferenceId, initPoint } = await paymentService.createPlanPreference({ planId })

      // Redirect to Mercado Pago checkout
      window.location.href = initPoint
    } catch (error) {
      alert('Error creating payment: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <button onClick={handlePurchase} disabled={loading}>
      {loading ? 'Processing...' : 'Purchase Plan'}
    </button>
  )
}
```

---

## Authentication Flow

### 1. Traditional Login

```javascript
import { authService } from '../utils/apiServices'

// Login
const response = await authService.login({ email, password })
localStorage.setItem('token', response.token)

// Token is automatically included in all subsequent requests
```

### 2. Google OAuth Login

```javascript
import { authService } from '../utils/apiServices'

// After getting Google ID token from Google Sign-In
const googleIdToken = '...' // From Google OAuth
const response = await authService.googleLogin({ token: googleIdToken })
localStorage.setItem('token', response.token)
```

### 3. Logout

```javascript
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userRole')
  // Redirect to login
}
```

### 4. Protected Routes

```javascript
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

---

## Error Handling

### Global Error Handler

```javascript
import { api } from '../utils/api'

// The api utility already handles errors, but you can add global handling:

const handleApiError = (error) => {
  if (error.message.includes('401') || error.message.includes('403')) {
    // Unauthorized - redirect to login
    localStorage.removeItem('token')
    window.location.href = '/login'
  } else if (error.message.includes('404')) {
    console.error('Resource not found')
  } else if (error.message.includes('500')) {
    console.error('Server error')
  }

  // Return user-friendly message
  return error.message || 'An unexpected error occurred'
}
```

### Try-Catch Pattern

```javascript
const loadData = async () => {
  try {
    setLoading(true)
    const data = await someService.getData()
    setData(data)
    setError(null)
  } catch (error) {
    setError(handleApiError(error))
  } finally {
    setLoading(false)
  }
}
```

---

## Testing the Connection

### Step 1: Start the Backend

```bash
cd Week3-CrudCloud-Backend/crudcloud-backend
./mvnw spring-boot:run
```

The backend should be running on `http://localhost:8080`

### Step 2: Start the Frontend

```bash
cd Week3-CrudCloud-Frontend
npm install  # If not already installed
npm run dev
```

The frontend should be running on `http://localhost:5173` or `http://localhost:5174`

### Step 3: Test Health Check

Create a test component or use the browser console:

```javascript
import { healthService } from './utils/apiServices'

// In your component or console
healthService.checkHealth()
  .then(data => console.log('Backend is healthy:', data))
  .catch(error => console.error('Backend error:', error))

// Or test ping
healthService.ping()
  .then(data => console.log('Ping response:', data))
  .catch(error => console.error('Ping error:', error))
```

### Step 4: Test Authentication

```javascript
import { authService } from './utils/apiServices'

// Test login (use a registered user)
authService.login({
  email: 'test@example.com',
  password: 'password123'
})
  .then(response => {
    console.log('Login successful:', response)
    localStorage.setItem('token', response.token)
  })
  .catch(error => console.error('Login error:', error))
```

### Step 5: Test Authenticated Endpoints

```javascript
import { instanceService, planService } from './utils/apiServices'

// Test getting plans (public endpoint)
planService.getAllPlans()
  .then(plans => console.log('Plans:', plans))
  .catch(error => console.error('Plans error:', error))

// Test getting instances (requires authentication)
instanceService.listInstances()
  .then(instances => console.log('Instances:', instances))
  .catch(error => console.error('Instances error:', error))
```

---

## Quick Reference: All Available Services

### Health Service
- `checkHealth()` - GET /api/health
- `ping()` - GET /api/health/ping

### Auth Service
- `login({ email, password })` - POST /api/auth/login
- `googleLogin({ token })` - POST /api/auth/google/login

### User Service
- `register(userData)` - POST /api/users/register
- `getAllUsers()` - GET /api/users
- `getUserById(id)` - GET /api/users/{id}

### Plan Service
- `getAllPlans()` - GET /api/plans
- `getPlanById(id)` - GET /api/plans/{id}
- `createPlan(planData)` - POST /api/plans (ADMIN)
- `updatePlan(id, planData)` - PUT /api/plans/{id} (ADMIN)
- `deletePlan(id)` - DELETE /api/plans/{id} (ADMIN)

### Instance Service
- `createInstance(data)` - POST /api/instances
- `listInstances()` - GET /api/instances
- `getInstance(id)` - GET /api/instances/{id}
- `suspendInstance(id)` - POST /api/instances/{id}/suspend
- `resumeInstance(id)` - POST /api/instances/{id}/resume
- `rotatePassword(id)` - POST /api/instances/{id}/rotate-password
- `deleteInstance(id)` - DELETE /api/instances/{id}

### Payment Service
- `createPayment(data)` - POST /api/payments
- `updatePaymentStatus(id, status)` - PATCH /api/payments/{id}/status
- `getMyPayments()` - GET /api/payments/my
- `getPaymentsByStatus(status)` - GET /api/payments/status/{status}
- `createPlanPreference({ planId })` - POST /api/payments/create/plan

### Users Plan Service
- `createUserPlan(data)` - POST /api/users-plans
- `getAllUsersPlans()` - GET /api/users-plans (ADMIN)
- `getPlansByUser(userId)` - GET /api/users-plans/user/{userId}
- `getActivePlans()` - GET /api/users-plans/active (ADMIN)
- `getInactivePlans()` - GET /api/users-plans/inactive (ADMIN)
- `getActivePlansByUser(userId)` - GET /api/users-plans/user/{userId}/active
- `updateUsersPlan(id, data)` - PUT /api/users-plans/{id} (ADMIN)
- `deleteUserPlan(id)` - DELETE /api/users-plans/{id} (ADMIN)

---

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure your backend has the frontend URL in the CORS configuration:
- Backend file: `SecurityConfig.java`
- Add your frontend URL to `app.cors.allowed-origins` in `application.properties`

### 401 Unauthorized
- Ensure token is saved in localStorage after login
- Check token is valid and not expired
- Verify the token is being sent in the Authorization header

### Connection Refused
- Ensure backend is running on port 8080
- Check `VITE_API_URL` in `.env` file
- Verify firewall settings

### 404 Not Found
- Verify the endpoint exists in the backend
- Check the endpoint path matches the backend controller
- Ensure you're not including `/api` twice in the path

---

## Best Practices

1. **Always handle errors** - Use try-catch blocks for all API calls
2. **Show loading states** - Improve UX while waiting for responses
3. **Validate data** - Validate on frontend before sending to backend
4. **Secure tokens** - Store tokens in localStorage, not in state
5. **Logout on 401** - Automatically logout users on authentication errors
6. **Use environment variables** - Never hardcode API URLs
7. **Test thoroughly** - Test all CRUD operations before deployment

---

## Additional Resources

- Backend Repository: https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Backend
- Frontend Repository: https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Frontend
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev
