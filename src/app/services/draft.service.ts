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
    const bodyStr = {
        "DraftNumber": newPick.Round,
        "FfbteamId": newPick.TeamID, 
        "FFBTeamName": newPick.TeamName, 
        "FFBTeamManager": newPick.TeamManager, 
        "PlayerID": newPick.PlayerID, 
        "PlayerName": newPick.PlayerName,
        "PlayerPosition": newPick.PlayerPosition,
        "PlayerNFLTeam": newPick.PlayerNFLTeam,
        "Year": newPick.Year
    }
    return this.apiService.postRequest(requestUrl, bodyStr, headers);
  }

  removeDraftPick(pickId: string): Observable<any> {
    let requestUrl = `${BASE_API_URL}/api/draft/${pickId}`;
    return this.apiService.deleteItem(requestUrl, undefined);
  }

  updateDraftPick(pickId: string, updatedPick: draftpick): Observable<any> {
    let requestUrl = `${BASE_API_URL}/api/draft/${pickId}`;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const bodyStr = {
      "id": pickId,
      "draftNumber": updatedPick.Round,
      "playerId": updatedPick.PlayerID,
      "playerName": updatedPick.PlayerName,
      "playerPosition": updatedPick.PlayerPosition,
      "playerNFLTeam": updatedPick.PlayerNFLTeam,
      "ffbteamId": updatedPick.TeamID,
      "ffbTeamName": updatedPick.TeamName,
      "ffbTeamManager": updatedPick.TeamManager,
      "year": updatedPick.Year
    }
    return this.apiService.putRequest(requestUrl, updatedPick, headers);
  }
}
