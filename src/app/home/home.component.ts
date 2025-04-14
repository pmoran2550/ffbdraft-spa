import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { finalize, map, Observable, Subscription, tap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { player } from '../models/player';
import { PlayerCardComponent } from "../player-card/player-card.component";
import { PlayerService } from '../services/player.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, PlayerCardComponent, MatCheckbox, FormsModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

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
  isLoading: boolean = true;
  private playerDataSubscription?: Subscription;
  errorMsg: string = "";
  faExclamationTriangle = faExclamationTriangle;

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
      }))),
      finalize(() => {
        this.isLoading = false;
        this.sort();
        this.filter();    
      })
    );

    const subscription = this.playerData$.subscribe({
      next: processedPlayers => {
        console.log('Player data loaded');
        // Add your data handling logic here
        this.playerData = processedPlayers;
        this.filteredPlayerData = processedPlayers;
  
      },
      error: err => {
        console.error('Error loading player data:', err);
        this.filteredPlayerData = [];
        if (err instanceof HttpErrorResponse) {
          this.errorMsg = err.message;
        } else {
          this.errorMsg = "Unknown error";
        }
      }
    });
  
    // Store subscription if needed for cleanup
    this.playerDataSubscription?.unsubscribe(); // Cleanup previous
    this.playerDataSubscription = subscription;
  }

  sort(){
    if (this.playerData.length > 0)
    {
      this.playerData.sort((a, b) => a.rank - b.rank);
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
    
  ngOnDestroy() {
    this.playerDataSubscription?.unsubscribe();
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

