import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { UserDetailDto } from '../../models/UserDetailDto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: UserDetailDto | null = null;
  loading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserDetail().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.loading = false;
        // Si hay error 401, redirigir al login
        if (error.status === 401) {
          this.logout();
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.userService.clearCurrentUser();
    this.router.navigate(['/auth/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/auth/profile']);
  }

  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('Admin') || false;
  }
}
