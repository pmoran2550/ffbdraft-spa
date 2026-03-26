import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { draftpick } from '../models/draftpick';

interface TeamOrder {
  teamId: string;
  teamName: string;
  teamManager: string;
  currentDraftOrder: number;
}

@Component({
  selector: 'app-draft-order-editor',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './draft-order-editor.component.html',
  styleUrl: './draft-order-editor.component.css'
})
export class DraftOrderEditorComponent implements OnInit {
  @Input() draftPicks: draftpick[] = [];
  @Output() saveOrder = new EventEmitter<draftpick[]>();
  @Output() cancelEdit = new EventEmitter<void>();

  orderedTeams: TeamOrder[] = [];

  ngOnInit(): void {
    // Extract unique teams from picks (one entry per team)
    const teamMap = new Map<string, TeamOrder>();
    
    for (const pick of this.draftPicks) {
      if (!teamMap.has(pick.TeamID)) {
        teamMap.set(pick.TeamID, {
          teamId: pick.TeamID,
          teamName: pick.TeamName,
          teamManager: pick.TeamManager,
          currentDraftOrder: pick.DraftOrder
        });
      }
    }

    // Convert to array and sort by DraftOrder
    this.orderedTeams = Array.from(teamMap.values()).sort((a, b) => a.currentDraftOrder - b.currentDraftOrder);
  }

  drop(event: CdkDragDrop<TeamOrder[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const item = this.orderedTeams[event.previousIndex];
      this.orderedTeams.splice(event.previousIndex, 1);
      this.orderedTeams.splice(event.currentIndex, 0, item);
    }
  }

  onSave(): void {
    // Update all picks based on new team order
    const updatedPicks = this.draftPicks.map(pick => {
      const newOrder = this.orderedTeams.findIndex(team => team.teamId === pick.TeamID) + 1;
      return {
        ...pick,
        DraftOrder: newOrder
      };
    });
    
    this.saveOrder.emit(updatedPicks);
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}

