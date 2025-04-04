import { Component, OnInit,  } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { player } from '../models/player';
import { PlayerCardComponent } from "../player-card/player-card.component";
import { PlayerService } from '../services/player.service';
import { Position } from '../models/position';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, PlayerCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  data: player[] | undefined = [];
  playerData$: Observable<player[]> | undefined;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    console.log("on init");
    this.getPlayerData(2024);
  }
  
  getPlayerData(year: number) {
    this.playerData$ = this.playerService.getItemById(year).pipe(
      map(players => players.map((player: any) => ({
        ...player,
        ffbTeam: this.getFFBTeamName(player.ffbTeam)
      })))
    );
    this.sort();
  }

  sort(){
    if (this.playerData$ != undefined)
    {
      this.playerData$ = this.playerData$.pipe(map((data) => {
      data.sort((a, b) => {
          return a.rank < b.rank ? -1 : 1;
      });
      return data;
      }))
    }
  }

  getPositionString(position: string): string {
  
    return POSITION_MAP[position] || 'Unknown';
  }
  
  getFFBTeamName(team: string | undefined): string {
    if (team == undefined)
      return "None";
    else
      return team;
  }

}

export const POSITION_MAP: { [key: string]: string } = {
  '0': 'Unknown',
  '1': 'QB',
  '2': 'RB',
  '3': 'WR',
  '4': 'TE',
  '5': 'K',
  '6': 'DEF',
};

