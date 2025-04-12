import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ffbteam } from '../models/ffbteam';
import { TeamService } from '../services/team.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TeamCardComponent } from '../team-card/team-card.component';
import { FormGroup } from '@angular/forms';
import { FfbTeamFormComponent } from '../ffb-team-form/ffb-team-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgFor, TeamCardComponent, MatButton],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.css'
})
export class TeamPageComponent {

    teamData$: Observable<ffbteam[]> | undefined;
  
    constructor(private teamservice: TeamService, public dialog: MatDialog) { }
  
    ngOnInit(): void {
      console.log("team page init");
      this.getTeamData();
    }
      
    getTeamData() {
      this.teamData$ = this.teamservice.getTeams();
      console.log(this.teamData$);
    }
  
    openTeamForm(): void {
      this.dialog.open(FfbTeamFormComponent, {
        height: '650px',
        width: '600px'
      })
      .afterClosed().subscribe(result => {
        if (result) {
          console.log('Returned object: ', result);
        }
      });
    }
}
