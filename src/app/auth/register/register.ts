import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RegisterDto } from '../../models/RegisterDto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerFailed = false;
  errorMessage = '';
  loading = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.registerFailed = false;
    this.errorMessage = '';

    const registerDto: RegisterDto = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(registerDto).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.isSuccess) {
          this.success = true;
          if (response.requireEmailConfirmation) {
            this.errorMessage = 'Cuenta creada! Revisa tu email para confirmar tu cuenta.';
          } else {
            this.errorMessage = '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.';
          }
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          this.registerFailed = true;
          this.errorMessage = response.message || 'Error al crear la cuenta';
        }
      },
      error: (err) => {
        this.loading = false;
        this.registerFailed = true;
        this.errorMessage = err.error?.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
      }
    });
  }
}
