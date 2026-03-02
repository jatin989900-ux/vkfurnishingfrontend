const BASE = import.meta.env.VITE_API_URL || 'https://vkfurnishingbackend-production.up.railway.app';

async function request(path, options = {}) {
  const token = localStorage.getItem('vk_admin_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

async function upload(path, formData, method='POST') {
  const token = localStorage.getItem('vk_admin_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export const login = (u,p) => request('/api/auth/login',{method:'POST',body:JSON.stringify({username:u,password:p})});
export const sendOTP = (phone) => request('/api/otp/send',{method:'POST',body:JSON.stringify({phone})});
export const verifyOTP = (phone,otp) => request('/api/otp/verify',{method:'POST',body:JSON.stringify({phone,otp})});
export const getProducts = (phone) => request(`/api/products${phone?`?retailer_phone=${phone}`:''}`);
export const addProduct = (fd) => upload('/api/products',fd);
export const updateProduct = (id,fd) => upload(`/api/products/${id}`,fd,'PUT');
export const deleteProduct = (id) => request(`/api/products/${id}`,{method:'DELETE'});
export const registerRetailer = (data) => request('/api/retailers/register',{method:'POST',body:JSON.stringify(data)});
export const checkStatus = (phone) => request(`/api/retailers/status/${phone}`);
export const getRetailers = (status) => request(`/api/retailers${status?`?status=${status}`:''}`);
export const approveRetailer = (id) => request(`/api/retailers/${id}/approve`,{method:'PUT'});
export const rejectRetailer = (id) => request(`/api/retailers/${id}/reject`,{method:'PUT'});
export const placeOrder = (data) => request('/api/orders',{method:'POST',body:JSON.stringify(data)});
export const getOrders = (status) => request(`/api/orders${status?`?status=${status}`:''}`);
export const updateOrderStatus = (id,status) => request(`/api/orders/${id}/status`,{method:'PUT',body:JSON.stringify({status})});
