import { Movement } from "../helpers/enums";
import { IGame } from "./IGame";


export interface IRound {
  id: number;
  gameId: number;
  game: IGame | null;
  movement_player1: Movement;
  movement_player2: Movement;
  result: number;
  roundNumber: number;
  current_turn: string | null;
}