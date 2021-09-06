import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { UsersService } from '../service/users.service';

/**
 * DEPRECATED: since interceptors run AFTER middlewares and guards, this interceptor
 * isn't useful when we try to use it inside the AdminGuard (currentUser is always undefined), so I'll stop using it
 * in lieu of CurrentUserMiddleware! (see Section 16. Chapter 134 of https://www.udemy.com/course/nestjs-the-complete-developers-guide/learn/lecture/27443276)
 */
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);

      // adding the user found and add it to the request object so it can be accessed in the CurrentUserDecorator
      request.currentUser = user;
    }

    return next.handle();
  }

}