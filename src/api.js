const API = import.meta.env.VITE_API_URL

async function req(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('vk_admin_token') || ''}`,
      ...options.headers
    },
    ...options
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

async function reqForm(path, formData, method = 'POST') {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('vk_admin_token') || ''}`
    },
    body: formData
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

// AUTH
export async function login(username, password) {
  return req('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
}

// OTP
export async function sendOtp(phone) {
  return req('/api/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
}

export async function verifyOtp(phone, otp) {
  return req('/api/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  })
}

// RETAILERS
export async function registerRetailer(formData) {
  return reqForm('/api/retailers/register', formData)
}

export async function loginRetailer(phone) {
  return req('/api/retailers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
}

export async function getRetailers() {
  return req('/api/retailers')
}

export async function approveRetailer(id) {
  return req(`/api/retailers/${id}/approve`, { method: 'PUT' })
}

export async function rejectRetailer(id) {
  return req(`/api/retailers/${id}/reject`, { method: 'PUT' })
}

// PRODUCTS
export async function getProducts(retailerPhone) {
  const query = retailerPhone ? `?retailer_phone=${retailerPhone}` : ''
  return req(`/api/products${query}`)
}

export async function addProduct(formData) {
  return reqForm('/api/products', formData)
}

export async function updateProduct(id, formData) {
  return reqForm(`/api/products/${id}`, formData, 'PUT')
}

export async function deleteProduct(id) {
  return req(`/api/products/${id}`, { method: 'DELETE' })
}

// ORDERS
export async function getOrders() {
  return req('/api/orders')
}

export async function placeOrder(orderData) {
  return req('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
}

export async function updateOrderStatus(id, status) {
  return req(`/api/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
}
