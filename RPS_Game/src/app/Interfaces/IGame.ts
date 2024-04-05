import { IRound } from './IRound';

export interface IGame {
  id: number;
  player1: string;
  player1Name: string;
  player2: string;
  player2Name: string;
  result: number;
  rounds: IRound[] | null;
  roundsNumber: number;
}
