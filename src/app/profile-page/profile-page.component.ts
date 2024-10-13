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
  showPassword: boolean = false; // New variable to toggle password visibility
  // originalPassword: string | null = null; // Hold the original password separately
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "{}");
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
        token: this.userData.token,
        username: this.userData.username,
        password: "",
        // Use the formatted birthday here
        birthday: formattedBirthday,
        favorites: this.userData.favorites,
      };
      // this.originalPassword = this.userData.password; // Store the original password
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
    const { username, email, password, birthday } = this.userData;

    // const password = this.userData.password; // This should be the value from the input field
    
    // basic validation before making the API call
    if (!username || !password || !email ){
      console.error("Username, password, and email are required fields.");
      return; // Prevent the API call if validation fails
    }

    // Format the birthday to 'yyyy-MM-dd'
    const formattedBirthday = birthday ? new Date(birthday).toISOString().split('T')[0] : '';

    const userDetails = {
      username,
      password,
      email,
      birthday: formattedBirthday
    };


    this.fetchApiData.editUser(username, userDetails).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: userDetails.password,
        token: this.userData.token,
        birthday: formattedBirthday // Ensure updated birthday is reflected here
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
      console.log("User updated successfully:", res);
    }, (err: any) => {
      console.error("Error udpdating user:", err);
    });
  }

  deleteUser(): void {
    const username = this.userData.username;
    this.fetchApiData.deleteUser(username).subscribe((res: any) => {
      // Handle the response if needed
      console.log("User deleted successfully:", res);
      // Optionally remove user data from localStorage
      localStorage.removeItem("user");
      this.router.navigate(["welcome"]); // Redirect to welcome page after deletion
    }, (err: any) => {
      console.error("Error deleting user:", err);
    });
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
  }


  // removeFromFavorite(movie: any): void {
  //   this.fetchApiData.deleteFavoriteMovie(userData.username, movie._id).subscribe((res: any) => {
  //     this.userData.favorites = res.favoriteMovies;
  //     this.getfavoriteMovies();
  //   }, (err: any) => {
  //     console.error(err)
  //   })
  // }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}
