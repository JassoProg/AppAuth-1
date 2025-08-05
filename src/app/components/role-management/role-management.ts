import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RoleService, RoleResponseDto, CreateRoleDto } from '../../services/role.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-management.html',
  styleUrls: ['./role-management.scss']
})
export class RoleManagementComponent implements OnInit {
  roles: RoleResponseDto[] = [];
  users: any[] = [];
  roleForm: FormGroup;
  assignRoleForm: FormGroup;
  loading = false;
  showCreateForm = false;
  showAssignForm = false;

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.assignRoleForm = this.fb.group({
      userId: ['', Validators.required],
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    // Simular carga de usuarios - en el tutorial real vendría del backend
    this.users = [
      { id: '1', email: 'admin@example.com', fullName: 'Admin User' },
      { id: '2', email: 'user@example.com', fullName: 'Regular User' }
    ];
  }

  createRole(): void {
    if (this.roleForm.valid) {
      const roleData: CreateRoleDto = this.roleForm.value;
      this.roleService.createRole(roleData).subscribe({
        next: (response) => {
          console.log('Role created:', response);
          this.loadRoles();
          this.roleForm.reset();
          this.showCreateForm = false;
        },
        error: (error) => {
          console.error('Error creating role:', error);
        }
      });
    }
  }

  deleteRole(roleId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      this.roleService.deleteRole(roleId).subscribe({
        next: (response) => {
          console.log('Role deleted:', response);
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error deleting role:', error);
        }
      });
    }
  }

  assignRole(): void {
    if (this.assignRoleForm.valid) {
      this.roleService.assignRole(this.assignRoleForm.value).subscribe({
        next: (response) => {
          console.log('Role assigned:', response);
          this.assignRoleForm.reset();
          this.showAssignForm = false;
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error assigning role:', error);
        }
      });
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showAssignForm = false;
  }

  toggleAssignForm(): void {
    this.showAssignForm = !this.showAssignForm;
    this.showCreateForm = false;
  }
}
