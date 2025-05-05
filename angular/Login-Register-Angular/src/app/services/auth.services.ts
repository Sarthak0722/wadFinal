// services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private localKey = 'users';
  private sessionKey = 'loggedInUser';

  register(user: any) {
    const users = JSON.parse(localStorage.getItem(this.localKey) || '[]');
    if (users.some((u: any) => u.username === user.username)) {
      return { success: false, message: 'Username already exists' };
    }
    users.push(user);
    localStorage.setItem(this.localKey, JSON.stringify(users));
    return { success: true };
  }

  login(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem(this.localKey) || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
      return { success: true };
    }
    return { success: false };
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.sessionKey) || 'null');
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
  }
}
