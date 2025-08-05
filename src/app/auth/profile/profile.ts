import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../../services/user.service';
import { ChangePasswordDto } from '../../models/EmailDto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  showChangePassword = false;
  changePasswordForm: FormGroup;
  changingPassword = false;
  passwordChangeError = '';
  passwordChangeSuccess = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.error('Error cargando el perfil', err);
        if (err.status === 401) {
          this.logout();
        }
      },
    });
  }

  refreshProfile(): void {
    this.loadProfile();
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      this.changingPassword = true;
      this.passwordChangeError = '';
      this.passwordChangeSuccess = false;

      const changePasswordDto: ChangePasswordDto = {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };

      this.authService.changePassword(changePasswordDto).subscribe({
        next: () => {
          this.changingPassword = false;
          this.passwordChangeSuccess = true;
          this.changePasswordForm.reset();
          setTimeout(() => {
            this.showChangePassword = false;
            this.passwordChangeSuccess = false;
          }, 2000);
        },
        error: (err) => {
          this.changingPassword = false;
          this.passwordChangeError = err.error?.message || 'Error al cambiar la contraseña';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.userService.clearCurrentUser();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleChangePasswordForm(): void {
    this.showChangePassword = !this.showChangePassword;
    if (!this.showChangePassword) {
      this.changePasswordForm.reset();
      this.passwordChangeError = '';
      this.passwordChangeSuccess = false;
    }
  }

  loadUserDetails(): void {
    this.userService.getUserDetail().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
      }
    });
  }
}
