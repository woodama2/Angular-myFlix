import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  FavoriteMovies: any[] = [];
  isFavMovie: boolean = false;
  userData = { username: "", FavoriteMovies: [] };

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  redirectProfile(): void {
    this.router.navigate(["profile"]);
  }

  getFavMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.FavoriteMovies = this.user.favorites;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log('Users fav movies', this.FavoriteMovies);
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "{}");

    // Ensure favoriteMovies is an array
    if (!user.favoriteMovies) {
      user.favorites = [];
      console.log(user.favorites);
    }

    const isFavorite = user.favorites.includes(String(movie._id));

    if (isFavorite) {
      // Remove from favorites
      this.fetchApiData.deleteFavoriteMovie(user.id, movie._id).subscribe(res => {
        console.log("Successfully removed from favorites");
        user.favoriteMovies = res.favoriteMovies;
        movie.isFavorite = false;
        localStorage.setItem("user", JSON.stringify(user));
      }, err => {
        console.error("Error removing from favorites:", err);
      });
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(user.id, movie._id).subscribe(res => {
        console.log("Successfully added to favorites");
        user.favoriteMovies = res.favoriteMovies;
        movie.isFavorite = true;
        localStorage.setItem("user", JSON.stringify(user));
      }, err => {
        console.error("Error adding to favorites:", err);
      });
    }

    // let icon = document.getElementById(`${movie._id}-favorite-icon`);

    // if (user.favoriteMovies.includes(movie._id)) {
    //   this.fetchApiData.deleteFavoriteMovie(user.id, movie.title).subscribe(res => {
    //     icon?.setAttribute("fontIcon", "favorite_border");

    //     console.log("del success")
    //     console.log(res);
    //     user.favoriteMovies = res.favoriteMovies;
    //     localStorage.setItem("user", JSON.stringify(user))
    //   }, err => {
    //     console.error(err)
    //   })
    // } else {
    //   this.fetchApiData.addFavoriteMovie(user.id, movie.title).subscribe(res => {
    //     icon?.setAttribute("fontIcon", "favorite");

    //     console.log("add success")
    //     console.log(res);
    //     user.favoriteMovies = res.favoriteMovies;
    //     localStorage.setItem("user", JSON.stringify(user))
    //   }, err => {
    //     console.error(err)
    //   })
    // }
    // localStorage.setItem("user", JSON.stringify(user));
  }

  showGenre(movie: any): void {
    if (movie.Genre && movie.Genre.Name) {
      console.log(movie.Genre);
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: String(movie.Genre.Name).toUpperCase(),
        content: movie.Genre.Description
      },
      width: "400px"
    })
      console.log('Genre:', movie.Genre.Name);
    } else {
      console.error('Genre is undefined or missing a name.');
    }
    
  }

  showDirector(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: movie.Director.Name,
        content: movie.Director.Bio
      },
      width: "400px"
    })
  }

  showDetail(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: movie.Title,
        content: movie.Description
      },
      width: "400px"
    })
  }

}
