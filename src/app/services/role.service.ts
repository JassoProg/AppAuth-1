import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateRoleDto {
  roleName: string;
}

export interface RoleResponseDto {
  id: string;
  name: string;
  totalUsers: number;
}

export interface RoleAssignDto {
  userId: string;
  roleId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'https://localhost:5000/api/Roles';

  constructor(private http: HttpClient) {}

  // Crear nuevo rol
  createRole(roleData: CreateRoleDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, roleData);
  }

  // Obtener todos los roles
  getRoles(): Observable<RoleResponseDto[]> {
    return this.http.get<RoleResponseDto[]>(`${this.apiUrl}`);
  }

  // Eliminar rol
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${roleId}`);
  }

  // Asignar rol a usuario
  assignRole(assignData: RoleAssignDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, assignData);
  }
}
