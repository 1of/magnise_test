import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Injectable} from '@angular/core'

@Injectable()
  export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      const token  = this.cookieService.get('access_token');
      const isApiUrl  = req.url.includes('/api/');

      if (token && isApiUrl) {
        return next.handle(req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        }));
      }

      return next.handle(req);
    }
  }

