import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Methods for API calls will go here
  // GET request
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

  // GET request with parameter
  getItemById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/${id}`);
  }

  // POST request
  createItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, item);
  }

  // PUT request
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${id}`, item);
  }

  // DELETE request
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${id}`);
  }
}

