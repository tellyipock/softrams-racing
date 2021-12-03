import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Member } from './shared/app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
        , 'X-Requested-With': 'XMLHttpRequest'
    })
  };
  username: string;

  constructor(private http: HttpClient) {}

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  setUsername(name: string) {
    this.username = name;
  }

  addMember(member: Member) {
    return this.http
      .post(`${this.api}/addMember`, member, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  editMember(member: Member) {
    return this.http
      .post(`${this.api}/editMember`, member, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteMember(memberID: number) {
    return this.http
      .post(`${this.api}/deleteMember`, {id: memberID}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
