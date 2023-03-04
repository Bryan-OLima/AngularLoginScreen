import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';

// Services
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url: string = 'http://localhost:3000';

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) { }

  sign(payLoad:{email: string, password:string}): Observable<any>{
    return this._http.post<{token: string}>(`${this._url}/sign`, payLoad).pipe(
      map((res) => {
        sessionStorage.removeItem('access_token');
        sessionStorage.setItem('access_token', res.token);
        return this._router.navigate(['admin']);
      }),
      catchError((e) => {
        if(e.error.message){
          return throwError(() => e.error.message);
        }
        return throwError(() => "No momento não estamos conseguindo validar esse dado, tente novamente mais tarde!");
      })
    )
  }

  logout() {
    sessionStorage.removeItem('access_token')
    return this._router.navigate(['']);
  }

  isAuthenticated():boolean {
    const token = sessionStorage.getItem('access_token');
    if(!token) return false;

    const jwtHelper = new JwtHelperService();

    return !jwtHelper.isTokenExpired(token);
  }
}
