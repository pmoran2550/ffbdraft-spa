import { Component, Input } from '@angular/core';
import { player } from '../models/player';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [NgIf,MatCardModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  
  @Input()
  player: player | undefined;

}
