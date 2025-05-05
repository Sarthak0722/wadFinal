// components/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    city: '',
    username: '',
  };

  constructor(private router: Router) {}

  register() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find((u: any) => u.username === this.user.username);
    if (exists) return alert('User already exists!');

    users.push(this.user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registered successfully!');
    this.router.navigate(['/']);
  }
}