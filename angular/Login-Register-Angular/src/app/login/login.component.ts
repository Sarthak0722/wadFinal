import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule , RouterModule],
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  constructor(private router: Router) {}

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) =>
      u.username === this.credentials.username &&
      u.password === this.credentials.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('Login successful!');
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid credentials!');
    }
  }
}
