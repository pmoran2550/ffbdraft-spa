import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // GET request 
  getRequest(url: string, options: any): Observable<any> {
    return this.http.get<any>(url, options);
  }

  // POST request
  postRequest(url: string, body: any, options: any): Observable<any> {
    return this.http.post<any>(url, body, options);
  }

  //PUT request
  putRequest(url: string, body: any, options: any): Observable<any> {
    return this.http.put(url, body, options);
  }

  // DELETE request
  deleteItem(url: string, options: any): Observable<any> {
    return this.http.delete(url, options);
  }
}

