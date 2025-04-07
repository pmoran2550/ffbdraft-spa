import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private apiService: ApiService) { }

    getTeams(): Observable<any> {
      let reqUrl = `${BASE_API_URL}/api/ffbteam`;
      return this.apiService.getRequest(reqUrl);
    }
}
