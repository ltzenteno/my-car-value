import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../service/users.service';

/**
 * NOTES: request order of execution:
 * incoming Request -> Cookie-Session Middleware -> Middlewares -> Guards -> Interceptors (before) -> Request Handler -> Interceptors (after) -> Response
 */
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

  constructor(private userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      // @ts-ignore
      req.currentUser = user;
    }

    next();
  }
}