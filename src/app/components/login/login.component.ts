import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../Services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: '',
  };

  isLoading = false;
  showPassword = false;
  errors: any = {};

  private apiUrl = 'http://localhost:3000/user/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService   
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateForm() {
    this.errors = {};
    
    if (!this.loginForm.email) {
      this.errors.email = 'Email is required';
    } else if (!this.isValidEmail(this.loginForm.email)) {
      this.errors.email = 'Please enter a valid email';
    }
    
    if (!this.loginForm.password) {
      this.errors.password = 'Password is required';
    } else if (this.loginForm.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
    }
    
    return Object.keys(this.errors).length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.http.post(this.apiUrl, this.loginForm).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.auth.login(res.token);   
         localStorage.setItem('userId', res.user._id);
        console.log('✅ Login successful:', res);
        if(res.user.role == 'admin') {  this.router.navigate(['/admin']);}
        else{
            this.router.navigate(['/home']);
        }
      
      },
    error: (err) => {
  this.isLoading = false;
  console.error('❌ Login failed:', err);

  if (err.status === 404) {
    this.errors.email = 'User not found';
  } else if (err.status === 401) {
    this.errors.password = 'Invalid password';
  } else if (err.status === 500) {
    this.errors.general = 'Server error, please try again later.';
  } else {
    this.errors.general = err.error?.message || 'Something went wrong, please try again.';
  }
}

    });
  }

  onGoogleLogin() {
    console.log('Google login clicked');
  }


}
