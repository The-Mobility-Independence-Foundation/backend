import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { AuthProviderProfile } from './entities/auth-provider-profile.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Request } from 'express';
import { AuthResponse } from './responses/auth.response';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user with email and password
   */
  @Post('register')
  @ResponseMessage('User successfully registered')
  @ApiOperation({ summary: 'Register a new user with email and password' })
  async register(@Body() userRegisterDto: RegisterDto): Promise<void> {
    await this.authService.register(userRegisterDto);
  }

  /**
   * Login a user with email and password
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Successfully logged in')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return { accessToken: this.authService.generateToken(loginDto.email) };
  }

  /**
   * Google OAuth 2.0 flow
   */
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login flow' })
  googleLogin(): void {}

  /**
   * Google OAuth 2.0 callback
   */
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ResponseMessage('Successfully logged in with Google')
  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  async googleCallback(@Req() req: Request): Promise<AuthResponse> {
    const authProviderProfile = req.user as AuthProviderProfile;
    const user =
      await this.authService.handleProviderLogin(authProviderProfile);

    return {
      accessToken: this.authService.generateToken(user.email),
    };
  }
}
