import { Component, Input } from '@angular/core';
import { draftpick } from '../../models/draftpick';
import { player } from '../../models/player';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-draft-card',
  standalone: true,
  imports: [NgIf, MatCardModule],
  templateUrl: './draft-card.component.html',
  styleUrl: './draft-card.component.css'
})
export class DraftCardComponent {

  @Input()
  draftPick: draftpick | undefined;

  @Input()
  player: player | undefined;

  
}
