import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { is_admin } = request.user;

    if (!is_admin) {
      throw new UnauthorizedException('No tiene acceso a esta informacion');
    }
    return true;
  }
}
