import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { MovieCardComponent } from "./movie-card/movie-card.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}