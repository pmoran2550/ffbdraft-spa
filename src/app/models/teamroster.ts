import { draftpick } from './draftpick';

export interface teamroster {
  TeamID: string;
  TeamName: string;
  TeamManager: string;
  DraftOrder: number;
  Picks: draftpick[];
}
