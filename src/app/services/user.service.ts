import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserDetailDto } from '../models/UserDetailDto';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:5000/api/Account';
  private currentUserSubject = new BehaviorSubject<UserDetailDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserDetail(): Observable<UserDetailDto> {
    return this.http.get<UserDetailDto>(`${this.apiUrl}/detail`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getAllUsers(): Observable<UserDetailDto[]> {
    return this.http.get<UserDetailDto[]>(`${this.apiUrl}/users`);
  }

  getCurrentUser(): UserDetailDto | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
