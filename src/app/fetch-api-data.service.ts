import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url
const apiUrl = 'https://stark-eyrie-86274-1237014d10af.herokuapp.com'

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  // Function to get token from local storage
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }


  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + `/users`, userDetails).pipe(
    catchError(this.handleError)
    );
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + `/login`, userDetails, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Function to get all movies
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(apiUrl + `/movies`, { headers }).pipe(catchError(this.handleError));
  }

  

  // EVERYTHING ABOVE THIS LINE HAS BEEN VERIFIED AND WORKS //



  // Function to get user
  public getUserById(id: string): Observable<any> {
    return this.http.get(apiUrl + `/user/${id}`, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      }),}).pipe(
      map(this.extractResponseData), catchError(this.handleError));
        }


  //   const user: any = JSON.parse(localStorage.getItem('user')||"");
  //   return {
  //     user
  //   }
  // }



  // Making the api call for the Get User endpoint
  // getUser(username: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + 'users/' + username, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }


  // Function to edit user
public editUser(username: String, userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.put(apiUrl + `users/` + username, userDetails, {headers: new HttpHeaders({
    Authorization: 'Bearer ' + token,
  })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

    // Making the api call for the Edit User endpoint
  // editUser(username: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + `users/${user.username}`, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

  // Function to delete user
  public deleteUser(username: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

    // Making the api call for the Delete User endpoint
  // deleteUser(username: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + `users/${user.username}`, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

  // Function to get user's favorite movies
  public getUserFavoriteMovies(): any {
    const user: any = JSON.parse(localStorage.getItem('user')|| "");
    return {
      user: user.FavoriteMovies
    }
  }

  // Making the api call for the Get Favorite Movies endpoint
  // getFavouriteMovies(username: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + 'users/' + username, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     map((data) => data.FavoriteMovies),
  //     catchError(this.handleError)
  //   );
  // }

  // Function to add favorite movie
  public addFavoriteMovie(username: String, movieTitle: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + username + '/' + movieTitle, {}, {headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

    // Making the api call for the Add a movie to Favorite Movies endpoint
  // addFavouriteMovies(username: string, movie: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + `users/${user.username}/${encodeURIComponent(movie.id)}`, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }


  // Funciton to delete favorite movie
  public deleteFavoriteMovie(username: String, movieTitle: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/' + movieTitle, {headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })}).pipe(
  map(this.extractResponseData),
  catchError(this.handleError)
);
  }

  // Making the api call for the Delete a movie from Favorite Movies endpoint
  // deleteFavouriteMovies(username: string, movie: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + `users/${user.username}/${encodeURIComponent(movie.id)}`, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }


  // Function to get all movies
  // public getAllMovies(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + '/movies', {headers: new HttpHeaders({
  //     Authorization: 'Bearer ' + token,
  //   })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }



  // Making the api call for the Get All Movies endpoint
  // getAllMovies(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + `movies`, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }


  // Function to get a specific movie with ID
  // public getMovieWithId(id: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + 'users/' + username + '/' + '${encodeURIComponent(movie.id)}', {headers: new HttpHeaders({
  //     Authorization: 'Bearer ' + token,
  //   })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

  // Making the api call for the Get ONE Movies endpoint
  // getOneMovies(title: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get(apiUrl + `users/${user.username}/${encodeURIComponent(movie.id)}`, {headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })}).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

  // Making the api call for the Get Director endpoint
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/directors/' + directorName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the Get Genre Movies endpoint
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


}