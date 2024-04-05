import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import { IFormRegister } from '../Interfaces/IFormRegister';
import { environment } from '../../environments/environment';
import { http } from '../helpers/enums';
import { IResponse } from '../Interfaces/IResponse';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IGame } from '../Interfaces/IGame';
import { IError } from '../Interfaces/IError';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  public frmRegister!: FormGroup;

  constructor(
    private frmGroup: FormBuilder,
    private generalService: GeneralService,
    private route: Router
  ) {

  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(): void {
    this.frmRegister = this.frmGroup.group({
      player1: ['', [Validators.required, Validators.maxLength(50)]],
      player2: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  public async registerPlayers(): Promise<void> {
    if (!this.frmRegister.valid) {
      window.alert("Please fill out all fields")
      return;
    }

    //TODO: Present Loading
    const body = this.getBody();
    const promise = await this.generalService.sendRequest(environment.startPlay, http.post, body);
    promise.subscribe(
      (response: IResponse) => {
        console.log('response >>:', response);
        if (response.isSuccess) {
          const gameId: number = response.value;
          const url = "/play/" + gameId
          console.log('url >>:', url);
          this.route.navigate([url])
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

  private getBody(): IFormRegister {
    return {
      player1: this.frmRegister.controls['player1'].value,
      player2: this.frmRegister.controls['player2'].value
    }
  }
}
