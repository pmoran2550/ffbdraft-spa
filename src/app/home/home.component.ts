import { Component, OnInit,  } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { player } from '../models/player';
import { PlayerCardComponent } from "../player-card/player-card.component";
import { PlayerService } from '../services/player.service';
import { Position } from '../models/position';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, PlayerCardComponent, MatCheckbox, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  playerData$: Observable<player[]> | undefined;
  playerData: player[] = [];
  filteredPlayerData: player[] = [];
  showAll: boolean = true;
  showQB: boolean = true;
  showRB: boolean = true;
  showWR: boolean = true;
  showTE: boolean = true;
  showK: boolean = true;
  showDEF: boolean = true;

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
    this.filter();
  }

  sort(){
    if (this.playerData$ != undefined)
    {
      this.playerData$ = this.playerData$.pipe(map((data) => {
      data.sort((a, b) => {
          return a.rank < b.rank ? -1 : 1;
      });
      this.playerData = data;
      this.filteredPlayerData = data;
      return data;
      }))
    }
  }


  filter() {
    if (this.playerData.length > 0) {
      this.filteredPlayerData = [];
      this.playerData.forEach(player => {
        if (this.showAll || 
          (player.position == 'QB' && this.showQB) || 
          (player.position == 'RB' && this.showRB) ||
          (player.position == 'WR' && this.showWR) ||
          (player.position == 'TE' && this.showTE) ||
          (player.position == 'K' && this.showK) ||
          (player.position == 'DEF' && this.showDEF) 
        ) {
          this.filteredPlayerData.push(player);
        }
      })
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

  positionFilterChanged(event: MatCheckboxChange, position: string) {
    console.log("All checkbox changed ");
    if (event.checked && position === 'All') {
      this.showQB = true;
      this.showRB = true;
      this.showWR = true;
      this.showTE = true;
      this.showK = true;
      this.showDEF = true;
    }
    else if(position === 'All') {
      this.showQB = false;
      this.showRB = false;
      this.showWR = false;
      this.showTE = false;
      this.showK = false;
      this.showDEF = false;
    }
    else {
      this.showAll = false;
    }

    this.filter();
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

