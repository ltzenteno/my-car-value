import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom decorator
// we use never in the data type since this decorator doesn't need any parameters
// context: wrapper of any incoming request
export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  // NOTES:
  //  we need to use the UsersService to fetch the current user
  //  but decorators exist outside the Dependency Injection system
  //  so the CurrentUser decorator can't get an instance of UsersService directly
  //  that is why we need an interceptor to solve this

  return request.currentUser;
});