import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../constants';
import { ffbteam } from '../models/ffbteam';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private apiService: ApiService) { }

    getTeams(): Observable<any> {
      let reqUrl = `${BASE_API_URL}/api/ffbteam`;
      return this.apiService.getRequest(reqUrl, undefined);
    }

    addTeam(newTeam: ffbteam): Observable<any> {
      let requestUrl = `${BASE_API_URL}/api/ffbteam`;
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.apiService.postRequest(requestUrl, newTeam, headers);
    }

    removeTeam(teamId: string): Observable<any> {
      let requestUrl = `${BASE_API_URL}/api/ffbteam/${teamId}`;
      return this.apiService.deleteItem(requestUrl, undefined);
    }
}
