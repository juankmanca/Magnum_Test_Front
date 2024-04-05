import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './Game/game.component';

export const routes: Routes = [
  {
      path: "",
      redirectTo: "register",
      pathMatch: 'full'
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "play/:id",
    component: GameComponent
  }
];
