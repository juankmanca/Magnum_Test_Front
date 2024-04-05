import { IRound } from "./IRound";

export interface NewMovementResponse {
    finishGame: boolean;
    result: number;
    round: IRound;
}