import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authControllerDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authControllerDto);
  }

  @Post('/signin')
  signIn(
    @Body() authControllerDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authControllerDto);
  }
}
