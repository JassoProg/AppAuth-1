import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto } from '../models/LoginDto';
import { RegisterDto, RegisterResponseDto } from '../models/RegisterDto';
import { AuthResponseDto } from '../models/AuthResponseDto';
import { UserDetailDto } from '../models/UserDetailDto';
import { 
  ConfirmEmailDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  ChangePasswordDto,
  EmailConfirmationResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto
} from '../models/EmailDto';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:5000/api/Account';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    this.startRefreshTokenTimer();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(user: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
          this.startRefreshTokenTimer();
        }
      })
    );
  }

  register(user: RegisterDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(`${this.apiUrl}/register`, user);
  }

  // Métodos de Email y Confirmación
  confirmEmail(confirmEmailDto: ConfirmEmailDto): Observable<EmailConfirmationResponseDto> {
    return this.http.post<EmailConfirmationResponseDto>(`${this.apiUrl}/confirm-email`, confirmEmailDto);
  }

  resendConfirmationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-confirmation-email`, { email });
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, forgotPasswordDto);
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetPasswordDto);
  }

  changePassword(changePasswordDto: ChangePasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordDto, {
      headers: this.getAuthHeaders()
    });
  }

  // Métodos de Refresh Token
  refreshToken(): Observable<RefreshTokenResponseDto> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('authToken');
    
    if (!refreshToken || !accessToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    const refreshTokenDto: RefreshTokenDto = {
      accessToken,
      refreshToken
    };

    return this.http.post<RefreshTokenResponseDto>(`${this.apiUrl}/refresh-token`, refreshTokenDto).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        this.setRefreshToken(response.refreshToken);
        this.startRefreshTokenTimer();
      })
    );
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private startRefreshTokenTimer(): void {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(payload.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
      
      if (timeout > 0) {
        this.refreshTokenTimeout = setTimeout(() => {
          this.refreshToken().subscribe({
            error: () => this.logout()
          });
        }, timeout);
      }
    } catch (error) {
      console.error('Error parsing token for refresh timer:', error);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.stopRefreshTokenTimer();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload.roles || [];
    } catch (error) {
      return [];
    }
  }

  hasRole(role: string): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes(role);
  }

  getProfile(): Observable<UserDetailDto> {
    return this.http.get<UserDetailDto>(`${this.apiUrl}/detail`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
