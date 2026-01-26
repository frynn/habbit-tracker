import { api } from "@/api/client";
import type { ChangePasswordDto, UserProfileDto, UserUpdateDto } from "@/types/user";

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
}

// Новые функции для настроек
export async function getUserProfile(): Promise<UserProfileDto> {
  const response = await api.get("/users/me");
  return response.data;
}

export async function updateProfile(data: UserUpdateDto): Promise<UserProfileDto> {
  const response = await api.put("/users/me", data);
  return response.data;
}

export async function changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
  const response = await api.put("/users/me/password", data, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data;
}

export async function deleteAccount(): Promise<{ message: string }> {
  const response = await api.delete("/users/me");
  return response.data;
}