import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { BASE_API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // Methods for API calls will go here
  // GET request
  // getData(): Observable<any> {
  //   return this.http.get(`${BASE_API_URL}/data`);
  // }

  // GET request 
  getRequest(url: string, options: any): Observable<any> {
    return this.http.get<any>(url, options);
  }

  // POST request
  postRequest(url: string, body: any, options: any): Observable<any> {
    return this.http.post<any>(url, body, options);
  }

  // PUT request
  // updateItem(id: number, item: any): Observable<any> {
  //   return this.http.put(`${BASE_API_URL}/items/${id}`, item);
  // }

  // DELETE request
  // deleteItem(id: number): Observable<any> {
  //   return this.http.delete(`${BASE_API_URL}/items/${id}`);
  // }
}

