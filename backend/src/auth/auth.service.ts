import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const existingUser = await this.userModel.findOne({ email: dto.email }).exec();
    
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    const user = new this.userModel({
      email: dto.email,
      password: passwordHash,
      name: dto.name,
    });

    await user.save();
    this.logger.log(`User registered: ${user.email}`);

    const payload = { sub: user._id.toString(), email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const payload = { sub: user._id.toString(), email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }
}
