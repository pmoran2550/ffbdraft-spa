import { Component, Input } from '@angular/core';
import { ffbteam } from '../models/ffbteam';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [NgIf,MatCardModule],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css'
})
export class TeamCardComponent {

    @Input()
    team: ffbteam | undefined;
  
}
