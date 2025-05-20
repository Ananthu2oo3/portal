
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'  // This makes it available application-wide
// })
// export class CustomerApiService {
//   private apiUrl = 'http://localhost:3000/call-sap-api';

//   constructor(private http: HttpClient) { }

//   callSapApi(username: string, password: string): Observable<any> {
//     return this.http.post(this.apiUrl, { username, password });
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // This is correct
})

export class CustomerApiService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { } // Injection should work now

  callSapApi(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }
}


