import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../constants';
import { draftpick } from '../models/draftpick';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  constructor(private apiService: ApiService) { }

  getDraftPicks(): Observable<any> {
    let reqUrl = `${BASE_API_URL}/api/draft`;
    return this.apiService.getRequest(reqUrl, undefined);
  }

  addDraftPick(newPick: draftpick): Observable<any> {
    let requestUrl = `${BASE_API_URL}/api/draft`;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.apiService.postRequest(requestUrl, newPick, headers);
  }

  removeDraftPick(pickId: string): Observable<any> {
    let requestUrl = `${BASE_API_URL}/api/draft/${pickId}`;
    return this.apiService.deleteItem(requestUrl, undefined);
  }
}
