import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginFailed = false;
  errorMessage = '';
  isLoading = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginFailed = false;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess && res.token) {
          this.authService.setToken(res.token);
          this.token = res.token;

          console.log('Token recibido:', res.token);

          this.router.navigate(['/dashboard']);
        } else {
          this.loginFailed = true;
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginFailed = true;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      },
    });
  }
}