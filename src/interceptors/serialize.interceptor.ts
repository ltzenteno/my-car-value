import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { UserDto } from 'src/users/dto/user.dto';

export class SerializeInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 1. Run something before a request is handled by the request handler
    console.log('1. Im running before the handler (in SerializerInterceptor)');

    return next.handle().pipe(
      map((data: any) => {
        // 3. run something before the response is sent out
        console.log('3. Im running before response is sent out (in SerializerInterceptor)');

        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        });
      })
    );
  }
  
}