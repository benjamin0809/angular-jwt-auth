import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap, map, mergeMap, switchAll } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private isRefresh = false;
  private isRefreshFailedHandle = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService, public router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }
    console.log("intercept ")
    return next.handle(request).pipe(
      catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefresh) {
        
      } else {
        return throwError(error);
      }
    })
    , mergeMap((event: any) => {
        const err = event.body && event.body.errorCode;
        if (err === 401 ) {
          // if (!this.isRefresh) {
            
          // } else{
          //   console.log("神仙都就唔到了")
          //   return throwError(event);
          // }
          return this.handle401Error(request, next);
        }

        
          if (event instanceof HttpResponse && event.status !== 200) {
            console.log("event instanceof HttpResponse 神仙都就唔到了")
            return throwError(event);
          }
          return new Observable(observer => observer.next(event)); // 请求成功返回响应 
        })
      )
       
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      
      console.log("handle401Error ")
      this.isRefreshing = true;
      this.isRefresh = true;
      this.refreshTokenSubject.next(null);
      console.log('this.isRefreshing', this.isRefreshing)
       return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          console.log('this.isRefreshing', this.isRefreshing)
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        })
        // , map(data => {
        //   if(data instanceof HttpResponse && data.body.errorCode){
        //     console.log("handle401Error HttpResponse 神仙都就唔到了")
        //     return throwError(data)
        //   }
        //   return new Observable(observer => observer.next(data));
        // })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => {
          if(this.isRefresh && !this.isRefreshFailedHandle) {
            this.isRefreshFailedHandle = true
            console.log("event instanceof HttpResponse 神仙都就唔到了")
            this.router.navigate(['/login']).then(res => {
              setTimeout(() => {
                this.isRefreshFailedHandle = false;
                this.isRefreshing = false;
                this.isRefresh = false
              }, 3000)
            });
        
          }
          console.log("refreshTokenSubject filter")
          return token != null
        }),
        take(1),
        switchMap(jwt => {
          console.log("refreshTokenSubject switchMap")
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
}
