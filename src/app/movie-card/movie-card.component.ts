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
  userData: any = {};
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
      let user = JSON.parse(localStorage.getItem("user") || "");
      this.movies.forEach((movie:any) => {
        movie.isFavorite = user.favorites.includes(movie._id);
      })
      console.log(this.movies);
      console.log(this.userData)
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

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "{}");

    // Ensure user.favorites exists and is an array
    user.favorites = user.favorites || [];

    const isFavorite = user.favorites.includes(movie._id);
    console.log("Current favorite status:", isFavorite); //Debug log

    // Toggle favorite status based on the current state
    const request = isFavorite
    ? this.fetchApiData.deleteFavoriteMovie(user.username, movie._id)
    : this.fetchApiData.addFavoriteMovie(user.username, movie._id);

    request.subscribe(
      (res) => {
        if (isFavorite) {
          console.log("Successfully removed from favorites"); //Debug log
        } else {
          console.log("Successfully added to favorites"); //Debug log
        }

        // Update the user's favoriteMovies list
        user.favorites = res.favorites; // Make sure this returns the updated favorites

        // Update the movie's favorite status locally
        movie.isFavorite = !isFavorite; // Toggle the movie's favorite status

        // Save updated user data back to local storage
        localStorage.setItem("user", JSON.stringify(user));
      },
      (err) => {
        console.error("Error updating favorite status:", err);
      }
    );
  }

  // modifyFavoriteMovies(movie: any): void {
  //   let user = JSON.parse(localStorage.getItem("user") || "{}");

  //   const isFavorite = user.favoriteMovies.includes(movie._id);

  //   if (isFavorite) {
  //     // Remove from favorites
  //     this.fetchApiData.deleteFavoriteMovie(user.id, movie._id).subscribe(res => {
  //       console.log("Successfully removed from favorites");
  //       user.favoriteMovies = res.favoriteMovies;
  //       movie.isFavorite = false;
  //       // localStorage.setItem("user", JSON.stringify(user));
  //     }, err => {
  //       console.error("Error removing from favorites:", err);
  //     });
  //   } else {
  //     // Add to favorites
  //     this.fetchApiData.addFavoriteMovie(user.id, movie._id).subscribe(res => {
  //       console.log("Successfully added to favorites");
  //       user.favoriteMovies = res.favoriteMovies;
  //       movie.isFavorite = true;
  //       // localStorage.setItem("user", JSON.stringify)
  //     })
  //   }
  //   let icon = document.getElementById(`${movie._id}-favorite-icon`);

  //   if (user.favoriteMovies.includes(movie._id)) {
  //     this.fetchApiData.deleteFavoriteMovie(user.id, movie.title).subscribe(res => {
  //       icon?.setAttribute("fontIcon", "favorite_border");

  //       console.log("del success")
  //       console.log(res);
  //       user.favoriteMovies = res.favoriteMovies;
  //       localStorage.setItem("user", JSON.stringify(user))
  //     }, err => {
  //       console.error(err)
  //     })
  //   } else {
  //     this.fetchApiData.addFavoriteMovie(user.id, movie.title).subscribe(res => {
  //       icon?.setAttribute("fontIcon", "favorite");

  //       console.log("add success")
  //       console.log(res);
  //       user.favoriteMovies = res.favoriteMovies;
  //       localStorage.setItem("user", JSON.stringify(user))
  //     }, err => {
  //       console.error(err)
  //     })
  //   }
  //   localStorage.setItem("user", JSON.stringify(user));
  // }

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
