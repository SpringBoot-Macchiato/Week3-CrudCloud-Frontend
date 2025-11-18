import { api } from './api'

/**
 * API Services for CrudCloud Backend
 * All endpoints are mapped from the backend controllers
 */

// ==================== HEALTH ====================
export const healthService = {
  /**
   * Check backend health status
   * GET /api/health
   */
  checkHealth: () => api.get('/health'),

  /**
   * Simple ping endpoint
   * GET /api/health/ping
   */
  ping: () => api.get('/health/ping'),
}

// ==================== AUTHENTICATION ====================
export const authService = {
  /**
   * Login with email and password
   * POST /api/auth/login
   * @param {Object} credentials - { email, password }
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Login with Google
   * POST /api/auth/google/login
   * @param {Object} data - { token: googleIdToken }
   */
  googleLogin: (data) => api.post('/auth/google/login', data),
}

// ==================== USERS ====================
export const userService = {
  /**
   * Register a new user
   * POST /api/users/register
   * @param {Object} userData - { email, password, fullName, role }
   */
  register: (userData) => api.post('/users/register', userData),

  /**
   * Get all users (requires authentication)
   * GET /api/users
   */
  getAllUsers: () => api.get('/users'),

  /**
   * Get user by ID
   * GET /api/users/{id}
   * @param {number} id - User ID
   */
  getUserById: (id) => api.get(`/users/${id}`),
}

// ==================== PLANS ====================
export const planService = {
  /**
   * Get all active plans
   * GET /api/plans
   */
  getAllPlans: () => api.get('/plans'),

  /**
   * Get plan by ID
   * GET /api/plans/{id}
   * @param {number} id - Plan ID
   */
  getPlanById: (id) => api.get(`/plans/${id}`),

  /**
   * Create a new plan (ADMIN only)
   * POST /api/plans
   * @param {Object} planData - { name, description, price, features, etc. }
   */
  createPlan: (planData) => api.post('/plans', planData),

  /**
   * Update an existing plan (ADMIN only)
   * PUT /api/plans/{id}
   * @param {number} id - Plan ID
   * @param {Object} planData - Updated plan data
   */
  updatePlan: (id, planData) => api.put(`/plans/${id}`, planData),

  /**
   * Delete a plan (ADMIN only)
   * DELETE /api/plans/{id}
   * @param {number} id - Plan ID
   */
  deletePlan: (id) => api.delete(`/plans/${id}`),
}

// ==================== INSTANCES ====================
export const instanceService = {
  /**
   * Create a new instance
   * POST /api/instances
   * @param {Object} instanceData - Instance configuration data
   */
  createInstance: (instanceData) => api.post('/instances', instanceData),

  /**
   * List all instances for authenticated user
   * GET /api/instances
   */
  listInstances: () => api.get('/instances'),

  /**
   * Get instance details
   * GET /api/instances/{id}
   * @param {number} id - Instance ID
   */
  getInstance: (id) => api.get(`/instances/${id}`),

  /**
   * Suspend an instance
   * POST /api/instances/{id}/suspend
   * @param {number} id - Instance ID
   */
  suspendInstance: (id) => api.post(`/instances/${id}/suspend`),

  /**
   * Resume an instance
   * POST /api/instances/{id}/resume
   * @param {number} id - Instance ID
   */
  resumeInstance: (id) => api.post(`/instances/${id}/resume`),

  /**
   * Rotate instance password
   * POST /api/instances/{id}/rotate-password
   * @param {number} id - Instance ID
   * @returns {string} New password
   */
  rotatePassword: (id) => api.post(`/instances/${id}/rotate-password`),

  /**
   * Delete an instance
   * DELETE /api/instances/{id}
   * @param {number} id - Instance ID
   */
  deleteInstance: (id) => api.delete(`/instances/${id}`),
}

// ==================== PAYMENTS ====================
export const paymentService = {
  /**
   * Create a payment (PENDING status)
   * POST /api/payments
   * @param {Object} paymentData - Payment data
   */
  createPayment: (paymentData) => api.post('/payments', paymentData),

  /**
   * Update payment status to APPROVED or FAILED
   * PATCH /api/payments/{id}/status
   * @param {number} id - Payment ID
   * @param {Object} statusData - { status: 'APPROVED' | 'FAILED' }
   */
  updatePaymentStatus: (id, statusData) => api.patch(`/payments/${id}/status`, statusData),

  /**
   * List payments of authenticated user
   * GET /api/payments/my
   */
  getMyPayments: () => api.get('/payments/my'),

  /**
   * List payments by status (ADMIN use)
   * GET /api/payments/status/{status}
   * @param {string} status - Payment status (PENDING, APPROVED, FAILED)
   */
  getPaymentsByStatus: (status) => api.get(`/payments/status/${status}`),

  /**
   * Create Mercado Pago checkout preference by planId
   * POST /api/payments/create/plan
   * @param {Object} data - { planId: number }
   * @returns {Object} { preferenceId, initPoint }
   */
  createPlanPreference: (data) => api.post('/payments/create/plan', data),
}

// ==================== USERS PLANS ====================
export const usersPlanService = {
  /**
   * Create a new user plan subscription
   * POST /api/users-plans
   * @param {Object} subscriptionData - User plan subscription data
   */
  createUserPlan: (subscriptionData) => api.post('/users-plans', subscriptionData),

  /**
   * Get all user plans (ADMIN only)
   * GET /api/users-plans
   */
  getAllUsersPlans: () => api.get('/users-plans'),

  /**
   * Get plans by user ID
   * GET /api/users-plans/user/{userId}
   * @param {number} userId - User ID
   */
  getPlansByUser: (userId) => api.get(`/users-plans/user/${userId}`),

  /**
   * Get all active plans (ADMIN only)
   * GET /api/users-plans/active
   */
  getActivePlans: () => api.get('/users-plans/active'),

  /**
   * Get all inactive plans (ADMIN only)
   * GET /api/users-plans/inactive
   */
  getInactivePlans: () => api.get('/users-plans/inactive'),

  /**
   * Get active plans for a specific user
   * GET /api/users-plans/user/{userId}/active
   * @param {number} userId - User ID
   */
  getActivePlansByUser: (userId) => api.get(`/users-plans/user/${userId}/active`),

  /**
   * Update a user plan (ADMIN only)
   * PUT /api/users-plans/{id}
   * @param {number} id - User plan ID
   * @param {Object} planData - Updated plan data
   */
  updateUsersPlan: (id, planData) => api.put(`/users-plans/${id}`, planData),

  /**
   * Delete a user plan (ADMIN only)
   * DELETE /api/users-plans/{id}
   * @param {number} id - User plan ID
   */
  deleteUserPlan: (id) => api.delete(`/users-plans/${id}`),
}

// Export all services as a single object for convenience
export default {
  health: healthService,
  auth: authService,
  user: userService,
  plan: planService,
  instance: instanceService,
  payment: paymentService,
  usersPlan: usersPlanService,
}
