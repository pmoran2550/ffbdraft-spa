import { Component, inject, Input, OnDestroy } from '@angular/core';
import { player } from '../models/player';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../services/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ffbteam } from '../models/ffbteam';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { PickFfbTeamFormComponent } from '../pick-ffb-team-form/pick-ffb-team-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [NgIf,MatCardModule, AsyncPipe, MatIconModule, 
    MatButtonModule, MatFormFieldModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  
  private authService = inject(AuthenticationService);
  public dialogPickTeam =  inject(MatDialog);
  private playerService = inject(PlayerService);

  @Input()
  player: player | undefined;

  @Input()
  teams: Observable<ffbteam[]> | undefined;

  isEditing: boolean = false;
  isAdmin$ = this.authService.isAdmin$;
  destroy$ = new Subject<void>();
  showAll: boolean = false;

  editFFBTeam(player: any): void {
    this.isEditing = true;
    this.openTeamForm();
  }

  openTeamForm(): void {
    this.dialogPickTeam.open(PickFfbTeamFormComponent, {
      data: this.showAll,
      height: '90vh',
      width: '400px'
    })
    .afterClosed().pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      if (result) {
        this.isEditing = false;
        let newTeam: ffbteam = result['teams'];
        this.updateFFBTeam(newTeam);
      }
    });
  }
  
  cancelFFBTeamEdit(): void {
    this.isEditing = false;
  }

  updateFFBTeam(team: ffbteam): void {
    if (team != undefined && this.player != undefined) {
      let newPlayer: player = {
        "name": this.player.name,
        "rank": this.player.rank,
        "nflTeam": this.player.nflTeam,
        "position": this.player.position,
        "byeWeek": this.player.byeWeek,
        "ffbTeam": team.id,
        "year": this.player.year,
        "id": this.player.id,
        "ffbTeamName": team.name,
        "ffbTeamManager": team.manager
      }

      this.playerService.putPlayerFFBTeamUpdate(newPlayer).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => { 
          console.log("resp ok: ", resp);
        },
        error: (error) => {
          console.error('Error in put request: ', error);
        }
      });
    }
  }

}
