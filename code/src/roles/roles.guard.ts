import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Example: allow only if user has 'admin' role
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.roles && user.roles.includes('admin');
  }
}