export interface ConfirmEmailDto {
  token: string;
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface EmailConfirmationResponseDto {
  isSuccess: boolean;
  message: string;
}

export interface RefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
}
