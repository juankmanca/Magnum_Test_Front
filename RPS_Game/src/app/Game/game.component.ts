import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { IGame } from '../Interfaces/IGame';
import { environment } from '../../environments/environment';
import { Movement, http } from '../helpers/enums';
import { IResponse } from '../Interfaces/IResponse';
import { NewMovementResponse } from '../Interfaces/INewMovementResponse';
import { RegisterMovementQuery } from '../Interfaces/IRegisterMovementQuery';
import { IRound } from '../Interfaces/IRound';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {

  gameId: string | null = null;
  currentGame!: IGame | null;
  current_turn: number = 0; //1: Player1, 2: Player2
  score = [0, 0, 0]
  player1Selection = '';
  player2Selection = '';
  showWinnerMessage = false;
  WinnerMessage = ''
  gameIsFinished = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private generalService: GeneralService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.gameId = this.activeRoute.snapshot.paramMap.get('id');
    if (this.gameId == null) {
      this.route.navigate(["/"])
    } else {
      this.getGameById()
    }
  }

  private async getGameById(): Promise<void> {
    const promise = await this.generalService.sendRequest(environment.getCurrentGame + this.gameId, http.get)
    promise.subscribe(
      (response: IResponse) => {
        if (response.isSuccess) {
          this.currentGame = response.value;
          this.getCurrentScore()
          this.getCurrentTurn()
          console.log('this.currentGame >>:', this.currentGame);
        } else {
          if (response.error != null) {
            window.alert(response.error)
          }
        }
      },
      (data: any) => {
        window.alert("Server error, please contact the administrator")
        console.log(data)
      }
    )
  }

  private getCurrentTurn(): void {
    if (this.currentGame && this.currentGame.rounds && this.currentGame.roundsNumber > 0) {

      //Last Game
      if (this.currentGame.roundsNumber >= 3 && this.currentGame.rounds[this.currentGame.roundsNumber - 1].current_turn == null) {
        this.current_turn = 0
        this.SelectWinner();
        return
      }

      if (this.currentGame.rounds[this.currentGame.roundsNumber - 1].current_turn == this.currentGame.player1
        || this.currentGame.rounds[this.currentGame.roundsNumber - 1].current_turn == null
      ) {
        this.current_turn = 1
      } else if ((this.currentGame.rounds[this.currentGame.roundsNumber - 1].current_turn == this.currentGame.player2)) {
        this.current_turn = 2
      }
    } else {
      this.current_turn = 1;
    }
  }


  private getCurrentScore(): void {
    if (this.currentGame && this.currentGame.rounds) {
      for (let i = 0; i < this.currentGame.roundsNumber; i++) {
        this.score[i] = this.currentGame.rounds[i].result;
      }
    }

  }

  private RestartPlayerSelection(): void {
    setTimeout(() => {
      this.player1Selection = '';
      this.player2Selection = '';
  }, 1000); 
  }

  private showPlayerSelection(player: number, movement: Movement): void {
    if (player == 1) {
      this.player1Selection = Movement[movement];
    } else {
      this.player2Selection = Movement[movement];
    }

    if(this.player1Selection != '' && this.player2Selection !=''){
      this.RestartPlayerSelection();
    }
  }

  private changeTurn(): void {
    this.current_turn = this.current_turn == 1 ? 2 : 1
  }

  public async newMovement(player: number, movement: Movement): Promise<void> {
    if(this.gameIsFinished) return;
    this.showPlayerSelection(player, movement);    
    const body = this.getBodyMovement(player, movement);
    const promise = await this.generalService.sendRequest(environment.newMovement, http.post, body)
    promise.subscribe(
      (response: IResponse) => {
        console.log('response >>:', response);
        if (response.isSuccess) {
          const apiResponse: NewMovementResponse = response.value
          if(apiResponse.finishGame){
            this.score[2] = apiResponse.result
            this.SelectWinner();
          } else {
            const round: IRound = apiResponse.round
            this.score[round.roundNumber - 1] = round.result
            this.changeTurn();
          }
        } else {
          window.alert(response.error.name)
        }
      },
      (data: any) => {
        console.log(data)
        const response: IResponse = data.error
        if (response != null && response.isFailure) {
          window.alert(response.error.name)
        } else {
          window.alert("Server error, please contact the administrator");
        }
      }
    )
  }

  public playNewGame(): void {
    this.route.navigate(["/register"])
  }

  private getBodyMovement(player: number, movement: number): RegisterMovementQuery {
    const playerId = player == 1 ? this.currentGame?.player1 : this.currentGame?.player2;
    return {
      player: playerId ?? '',
      movement
    }
  }

  private SelectWinner(): void {
    this.gameIsFinished = true;
    this.showWinnerMessage = true;
    this.current_turn = 0;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;

    this.score.forEach(point => {
      if (point == 1) scorePlayer1++
      if (point == 2) scorePlayer2++
    });

    if (scorePlayer1 == scorePlayer2) {
      this.WinnerMessage = 'Tie 😒🥱'
    } else if (scorePlayer1 > scorePlayer2) {
      this.WinnerMessage = "🥳🎉🎊 " + this.currentGame?.player1Name + ' Win!! 🥳🎉🎊'
    } else {
      this.WinnerMessage = "🥳🎉🎊 " + this.currentGame?.player2Name + ' Win!! 🥳🎉🎊'
    }
  }

  public async playAgain(): Promise<void> {
    const promise = await this.generalService.sendRequest(environment.playAgain + this.gameId, http.get)
    promise.subscribe(
      (response: IResponse) => {
        console.log('response >>:', response);
        if (response.isSuccess) {
          window.location.reload()
        } else {
          window.alert(response.error.name)
        }
      },
      (data: any) => {
        console.log(data)
        const response: IResponse = data.error
        if (response != null && response.isFailure) {
          window.alert(response.error.name)
        } else {
          window.alert("Server error, please contact the administrator");
        }
      }
    )
  }

}
