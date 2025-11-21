// /* ================================================================= */
// /* FILE ĐÃ SỬA: src/utils/api.ts                                   */
// /* MỤC ĐÍCH: Trỏ tất cả các lệnh gọi API từ Supabase (URL cũ)        */
// /* sang API Node.js/Express (URL mới)                     */
// /* ================================================================= */

// SERVER_URL mới trỏ đến server Node.js/Express của bạn
const SERVER_URL = `http://localhost:3001/make-server-aef03c12`;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  // Lấy accessToken (JWT token) từ localStorage (do hàm signin lưu)
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Gửi token đến API server mới để xác thực
      // (API server sẽ dùng hàm 'authenticateToken' để đọc nó)
      'Authorization': `Bearer ${accessToken || ''}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Nếu API server báo lỗi (ví dụ: 400, 401, 500)
    const errorData = await response.json(); // Đọc lỗi JSON từ server
    console.error(`API call failed for ${endpoint}:`, errorData.error);
    throw new Error(errorData.error || 'API call failed');
  }

  // Nếu gọi API thành công (status 200, 201)
  return response.json();
}

// Các hàm này giữ nguyên y như cũ, vì chúng chỉ gọi apiCall

export async function getSession() {
  try {
    const response = await apiCall('/auth/session');
    return response;
  } catch (error) {
    console.error('Error getting session:', error);
    localStorage.removeItem('accessToken'); // Xóa token hỏng
    return { user: null };
  }
}

export async function uploadAvatar(file: File) {
  const accessToken = localStorage.getItem('accessToken');
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${SERVER_URL}/avatar/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken || ''}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to upload avatar');
  }

  return response.json();
}

export async function updateProfile(updates: any) {
  return apiCall('/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function getPreferenceTags() {
  // Endpoint này đã được tạo trong server/index.js
  const response = await apiCall('/preferences');
  return response.preferences;
}

// Các hàm Admin này giữ nguyên
export async function deactivateAccount(userId: string) {
  return apiCall(`/admin/deactivate-account/${userId}`, {
    method: 'PUT',
  });
}

export async function reactivateAccount(userId: string) {
  return apiCall(`/admin/reactivate-account/${userId}`, {
    method: 'PUT',
  });
}

export async function deactivateLocation(locId: string) {
  return apiCall(`/admin/deactivate-location/${locId}`, {
    method: 'PUT',
  });
}

export async function reactivateLocation(locId: string) {
  return apiCall(`/admin/reactivate-location/${locId}`, {
    method: 'PUT',
  });
}

export async function getAllUsers() {
  return apiCall('/admin/users');
}

// Thêm hàm này vào cuối file src/utils/api.ts

export async function toggleLikeFeedback(fbID: string | number) {
  // Endpoint này chúng ta vừa tạo ở server/index.js
  return apiCall(`/feedback/${fbID}/like`, {
    method: 'POST',
  });
}