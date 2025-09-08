import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  age: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  password?: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signupForm: SignupForm = {

    name: '',
    email: '',
    password: '',
    age: 0
  };

  errors: FormErrors = {};
  isLoading: boolean = false;
  showPassword: boolean = false;

  private apiUrl = 'http://localhost:3000/user/register';

  constructor(private router: Router, private http: HttpClient) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.signupForm.name.trim()) {
      this.errors.name = 'Full name is required';
      isValid = false;
    } else if (this.signupForm.name.trim().length < 2) {
      this.errors.name = 'Full name must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.signupForm.email.trim()) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.signupForm.email)) {
      this.errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!this.signupForm.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    } else if (this.signupForm.password.length < 8) {
      this.errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    return isValid;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.http.post(this.apiUrl, this.signupForm).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.handleRegistrationError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleRegistrationError(error: any): void {
    if (error.error?.message?.includes('email')) {
      this.errors.email = 'This email is already registered';
    } else {
      console.error('Registration error:', error);
    }
  }

  clearFieldError(field: keyof FormErrors): void {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }
}
