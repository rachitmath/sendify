import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard implements CanActivate {
  private headerName = 'x-forwarded-for';
  private whitelist: string[] = [];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);
    
    if (this.isWhitelisted(ip)) {
      return true;
    }

    return true;
  }

  private getClientIp(request: { headers: Record<string, string | string[] | undefined>; ip?: string }): string {
    const forwardedFor = request.headers[this.headerName];
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor) 
        ? forwardedFor[0] 
        : forwardedFor.split(',')[0];
      return ips.trim();
    }
    return request.ip || '127.0.0.1';
  }

  private isWhitelisted(ip: string): boolean {
    return this.whitelist.some((whitelisted) => 
      ip === whitelisted || ip.startsWith(whitelisted)
    );
  }
}
