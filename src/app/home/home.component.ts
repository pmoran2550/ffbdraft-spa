import { Component, OnInit,  } from '@angular/core';
import { ApiService } from '../services/api.service';
import { map, Observable } from 'rxjs';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { player } from '../models/player';
import { PlayerCardComponent } from "../player-card/player-card.component";

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

  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    console.log("on init");
    this.getPlayerData(2024);
  }
  
  getPlayerData(year: number) {
    this.playerData$ = this.apiService.getItemById(year);
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

}
