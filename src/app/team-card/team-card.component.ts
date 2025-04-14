import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ffbteam } from '../models/ffbteam';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [NgIf,MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css'
})
export class TeamCardComponent {

    @Input()
    team: ffbteam | undefined;

    @Input()
    isEditing: boolean = true;

    @Output()
    removeEvent = new EventEmitter<any>();
  
    deleteTeam(teamId: any): void {
      this.removeEvent.emit(teamId);
    }
}
