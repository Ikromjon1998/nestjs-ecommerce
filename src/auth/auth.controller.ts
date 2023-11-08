import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDTO: CreateUserDto) {
    return await this.userService.addUser(createUserDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/user')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/admin')
  getDashboard(@Request() req) {
    return req.user;
  }
}
