import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUsuarioDto) {
    const nuevoUsuario = await this.usuariosService.create(registerDto);
    const token = this.getJwtToken({
      id: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
    });

    return { ...nuevoUsuario, token };
  }

  async login(loginDto: LoginUserDto) {
    const usuario = await this.usuariosService.findByEmail(loginDto.correo);

    if (
      !usuario ||
      !(await bcrypt.compare(loginDto.contrasena, usuario.contrasena))
    ) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const usuarioSinPassword = {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      createdAt: usuario.createdAt,
    };
    const token = this.getJwtToken({
      id: usuario.id,
      correo: usuario.correo,
    });

    return { ...usuarioSinPassword, token };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
