export type Role = 'STUDENT' | 'TUTOR' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  studentProfile?: StudentProfile;
  tutorProfile?: TutorProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  phone?: string;
  bio?: string;
  subjects: string[];
}

export interface TutorProfile {
  id: string;
  userId: string;
  title: string;
  bio: string;
  hourlyRate: number;
  phone: string;
  education: string;
  experience: number;
  subjects: string[];
  availability: Availability[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  tutorProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  subject: string;
  notes?: string;
  totalAmount: number;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  tutor?: {
    id: string;
    name: string;
    email: string;
  };
  tutorProfile?: TutorProfile;
  review?: Review;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  tutorId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}
