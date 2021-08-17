import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

/**
 * This interface will elp us ensure tat the param sent to the Serialize decorator is a Class
 */
interface ClassConstructor {
  new (...args: any[]): {}
}

/**
 * Custom Serialize decorator
 */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 1. Run something before a request is handled by the request handler
    console.log('1. Im running before the handler (in SerializerInterceptor)');

    return next.handle().pipe(
      map((data: any) => {
        // 3. run something before the response is sent out
        console.log('3. Im running before response is sent out (in SerializerInterceptor)');

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      })
    );
  }
  
}