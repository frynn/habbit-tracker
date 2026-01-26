export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string; // Добавлено для соответствия бэкенду
}

export interface UserUpdateDto {
  email: string;
  username: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  username: string;
}