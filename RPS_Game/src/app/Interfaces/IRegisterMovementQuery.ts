import { Movement } from "../helpers/enums";

export interface RegisterMovementQuery {
    player: string;
    movement: Movement;
}