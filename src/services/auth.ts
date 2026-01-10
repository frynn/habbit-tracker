export function getAccessToken() {
  return localStorage.getItem("token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
}
