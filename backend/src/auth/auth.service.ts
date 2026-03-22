import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private sign(user: { id: string; email: string; role: string }) {
    return this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.config.get('JWT_SECRET'), expiresIn: this.config.get('JWT_EXPIRES_IN') },
    );
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed },
    });
    return { access_token: this.sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return { access_token: this.sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async googleLogin(googleUser: { googleId: string; name: string; email: string; avatar: string }) {
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { name: googleUser.name, email: googleUser.email, googleId: googleUser.googleId, avatar: googleUser.avatar },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({ where: { id: user.id }, data: { googleId: googleUser.googleId, avatar: googleUser.avatar } });
    }
    return { access_token: this.sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true, avatar: true, phone: true } });
  }
}
