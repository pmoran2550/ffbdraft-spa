import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BASE_API_URL } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private apiService: ApiService) { }

    getItemById(parameter: number): Observable<any> {
      let reqUrl = `${BASE_API_URL}/api/players/year/${parameter}`;
      return this.apiService.getRequest(reqUrl, undefined);
    }
  
}
