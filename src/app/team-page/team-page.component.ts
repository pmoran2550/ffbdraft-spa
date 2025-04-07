import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ffbteam } from '../models/ffbteam';
import { TeamService } from '../services/team.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TeamCardComponent } from '../team-card/team-card.component';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgFor, TeamCardComponent],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.css'
})
export class TeamPageComponent {

    teamData$: Observable<ffbteam[]> | undefined;
  
    constructor(private teamservice: TeamService) { }
  
    ngOnInit(): void {
      console.log("team page init");
      this.getTeamData();
    }
      
    
    getTeamData() {
      this.teamData$ = this.teamservice.getTeams();
      console.log(this.teamData$);
    }
  
}
