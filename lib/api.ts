import { LoginCredentials, RegisterData, AuthResponse, User, TutorProfile, Availability, Booking, BookingStatus, Review, Category } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }

  // Auth endpoints
  async login(credentials: LoginCredentials) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Tutor endpoints
  async getTutors(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString();
    return this.request<TutorProfile[]>(`/tutors${params ? `?${params}` : ''}`);
  }

  async getTutorById(id: string) {
    return this.request<TutorProfile>(`/tutors/${id}`);
  }

  async getTutorAvailability(id: string) {
    return this.request<Availability[]>(`/tutors/${id}/availability`);
  }

  async updateTutorProfile(data: Partial<TutorProfile>) {
    return this.request<{ message: string; tutor: TutorProfile }>('/tutors/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateAvailability(data: Omit<Availability, 'id' | 'tutorId'>[]) {
    return this.request('/tutors/availability', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Booking endpoints
  async createBooking(data: {
    tutorId: string;
    date: string;
    startTime: string;
    endTime: string;
    subject: string;
    notes?: string;
  }) {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserBookings() {
    return this.request<Booking[]>('/bookings');
  }

  async getBookingById(id: string) {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Review endpoints
  async createReview(data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTutorReviews(tutorId: string) {
    return this.request<{ reviews: Review[]; averageRating: number; totalReviews: number }>(
      `/reviews/tutor/${tutorId}`
    );
  }

  // Category endpoints
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request<User[]>('/admin/users');
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async getAllBookings() {
    return this.request<Booking[]>('/admin/bookings');
  }

  async getDashboardStats() {
    return this.request<any>('/admin/stats');
  }

  async createCategory(data: { name: string; description?: string; icon?: string }) {
    return this.request<Category>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Partial<Category>) {
    return this.request<Category>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
