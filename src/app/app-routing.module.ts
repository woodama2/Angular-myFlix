import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { MovieCardComponent } from "./movie-card/movie-card.component";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}