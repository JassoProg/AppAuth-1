import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { ConfirmEmailDto } from '../../models/EmailDto';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.scss'
})
export class ConfirmEmailComponent implements OnInit {
  loading = true;
  success = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];

      if (token && email) {
        this.confirmEmail(token, email);
      } else {
        this.error = 'Token o email inválido';
        this.loading = false;
      }
    });
  }

  private confirmEmail(token: string, email: string): void {
    const confirmEmailDto: ConfirmEmailDto = { token, email };
    
    this.authService.confirmEmail(confirmEmailDto).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = response.isSuccess;
        this.message = response.message;
        
        if (response.isSuccess) {
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al confirmar el email';
      }
    });
  }

  resendConfirmation(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.loading = true;
        this.authService.resendConfirmationEmail(email).subscribe({
          next: () => {
            this.loading = false;
            this.message = 'Email de confirmación reenviado';
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error?.message || 'Error al reenviar email';
          }
        });
      }
    });
  }
}
