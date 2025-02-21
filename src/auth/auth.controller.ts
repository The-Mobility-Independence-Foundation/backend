import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { ProviderProfile } from './entities/provider-profile.entity';
import { UserRegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('test')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  test() {
    return 'nice';
  }

  @Post('logout')
  logout() {
    // TODO: Implement logout
    // return this.authService.logout();
  }

  /**
   * Register a new user
   */
  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  /**
   * Login a user
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('No email or password provided');
    }

    return { accessToken: this.authService.generateToken(loginDto.email) };
  }

  /**
   * Google OAuth 2.0 flow
   */
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {}

  /**
   * Google OAuth 2.0 callback
   */
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() req: any) {
    if (!req.user) {
      return 'No user from google';
    }

    const providerProfile = req.user as ProviderProfile;
    const user = await this.authService.handleProviderLogin(providerProfile);

    return {
      accessToken: this.authService.generateToken(user.email),
    };
  }
}
