import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BASE_API_URL } from '../constants';
import { Observable } from 'rxjs';
import { ffbteam } from '../models/ffbteam';
import { player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private apiService: ApiService) { }

    getPlayersByYear(parameter: number): Observable<any> {
      let reqUrl = `${BASE_API_URL}/api/players/year/${parameter}`;
      return this.apiService.getRequest(reqUrl, undefined);
    }
  
    putPlayerFFBTeamUpdate(player: player): Observable<any> {
      let reqUrl = `${BASE_API_URL}/api/players/${player.id}`;
      let bodyStr = {
        "Name": player.name,
        "Rank": player.rank,
        "NFLTeam": player.nflTeam,
        "Position": player.position,
        "ByeWeek": player.byeWeek,
        "FFBTeam": player.ffbTeam,
        "Year": player.year
      }
      return this.apiService.putRequest(reqUrl, bodyStr, undefined);
    }
}
