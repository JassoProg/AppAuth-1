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
