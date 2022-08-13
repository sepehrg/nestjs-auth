import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';
import { Public } from './../common/decorators/public.decorator';
import { GetCurrentUserId } from './../common/decorators/get-current-user-id.decorator';
import { RtGuard } from './../common/guards/rt.guard';
import { GetCurrentUser } from './../common/decorators/get-current-user.decorator';
import { RefreshRequestDto } from './dto/refreshRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  // https://github.com/vladwulf/nestjs-jwts/issues/6
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @Body() dto: RefreshRequestDto,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, dto.refreshToken);
  }
}
