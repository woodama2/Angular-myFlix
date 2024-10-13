import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];
  movies: any[] = [];
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }


  //   const userDataString = localStorage.getItem("user");

  //   if (userDataString) {
  //     try {
  //       this.userData = JSON.parse(userDataString);
  //     } catch (e) {
  //       console.error("Failed to parse user data:", e);
  //       this.userData = {} // Initialize to empty object if parsing fails
  //     }
  //   }
  // }

  ngOnInit(): void {
    if (this.userData) {
      this.getUser();
      this.getMovies()
      console.log(this.userData)
    } else {
      console.error("User data is not available or invalid.");
      // this.router.navigate(["welcome"]); // Redirect if user data is invalid
    }
  }

  getUser(): void {
    // Check if userData has a valid ID before making the API call
    // if (!this.userData.Id) {
    //   console.error("User ID is not available.");
    //   this.router.navigate(["welcome"]); // Redirect if ID is not available
    //   return;
    // }
    this.fetchApiData.getUserByUsername(this.userData.username).subscribe((res: any) => {
      // Format the birthday to 'yyyy-MM-dd'
      const formattedBirthday = res.birthday ? new Date(res.birthday).toISOString().split('T')[0] : '';

      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token,
        username: this.userData.username,
        // Use the formatted birthday here
        birthday: formattedBirthday,
        favorites: this.userData.favorites,
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    })
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  updateUser(): void {
    const username = this.userData.username;
    this.fetchApiData.editUser(username, this.userData).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }
  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  getfavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp.filter((movie: any) => {
        return this.userData.favorites.includes(movie._id)
      })
    }, (err: any) => {
      console.error(err);
    });
  }



  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.username, movie._id).subscribe((res: any) => {
      this.userData.favorites = res.favoriteMovies;
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}
