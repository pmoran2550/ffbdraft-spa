import { Component, OnDestroy } from '@angular/core';
import { map, Observable, ObservableInput, Subject, Subscription, takeUntil } from 'rxjs';
import { ffbteam } from '../models/ffbteam';
import { TeamService } from '../services/team.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TeamCardComponent } from '../team-card/team-card.component';
import { FormGroup } from '@angular/forms';
import { FfbTeamFormComponent } from '../ffb-team-form/ffb-team-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgFor, TeamCardComponent, MatButton, MatCheckboxModule, FormsModule],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.css'
})
export class TeamPageComponent implements OnDestroy {

  teamData$: Observable<ffbteam[]> | undefined;
  destroy$ = new Subject<void>();
  isEditing: boolean = false;
  
  constructor(private teamservice: TeamService, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.getTeamData();
  }
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }  

  getTeamData() {
    this.teamData$ = this.teamservice.getTeams();
  }

  openTeamForm(): void {
    this.dialog.open(FfbTeamFormComponent, {
      height: '650px',
      width: '600px'
    })
    .afterClosed().pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      if (result) {
        console.log('Returned object: ', result);
      }
      this.getTeamData();
    });
  }

  removeTeam(teamId: any): void {
    console.log("ready to remove ", teamId);
    this.teamservice.removeTeam(teamId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => { 
        this.getTeamData();
      },
      error: (error) => {
        console.error('Error in post request: ', error);
      }
    });

  }
}
