import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../users/entity/users.entity';

export class AdminGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.currentUser as User;

    if (!currentUser) {
      return false;
    }

    return currentUser.isAdmin;
  }

}