// src/app/models/AuthResponseDto.ts
export interface AuthResponseDto {
  token: string;
  refreshToken?: string;
  expiration?: Date;
  isSuccess: boolean;
  message: string;
}
