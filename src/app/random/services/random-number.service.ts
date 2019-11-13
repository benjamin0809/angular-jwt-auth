import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberService {

  constructor(private http: HttpClient) {}

  public getRandomNumber() {
    return this.http.get<any>(`${config.apiUrl}/v2/random`)
      .pipe(map(data => data.value));
  }

  public getGetUser() {
    return this.http.get<any>(`${config.apiUrl}/v2/getuser`)
      .pipe(map(data => {
        console.log("getGetUser pipe map")
        // if( data.errorCode == 401){ 
        //   return throwError(new HttpErrorResponse({
        //     status: 401, 
        //   }))
        // } else {
        //   return data
        // }
        return data
      }));
  }

  public getGetUserV1() {
    return this.http.get<any>(`${config.apiUrl}/getuser`)
      .pipe(map(data => data));
  }
}
