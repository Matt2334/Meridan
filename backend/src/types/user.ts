export interface SignUpBodyRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface SignInBody {
  email?: string;
  password?: string;
}
enum UserRole {
  ADMIN,
  USER,
}
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}
export interface UpdateUserRequest {
  email?: string;
  name?: string;
}
export interface UpdateUserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
