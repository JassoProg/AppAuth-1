export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  isSuccess: boolean;
  message: string;
  requireEmailConfirmation?: boolean;
}
