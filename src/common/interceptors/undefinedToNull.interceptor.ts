import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        // 전부분
        
        // return next.handle().pipe(map((data) => ({ data, code: 'SUCCESS' })));
        return next.handle().pipe(map((data) => data === undefined ? null : data));
    }

}