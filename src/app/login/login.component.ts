import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../shared/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private appService: AppService) {}

  ngOnInit() {
    const name = localStorage.getItem('username');
    if(localStorage.getItem('username')) {
      this.appService.setUsername(name);
      this.router.navigate(['/members']);
    }
    this.loginForm = this.fb.group({
      username: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
      password: new FormControl('', [ 
        Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,16}$/)])
    });
  }

  login() {
    localStorage.setItem('username', this.loginForm.value.username);
    this.appService.setUsername(this.loginForm.value.username);
    this.router.navigate(['/members']);
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

}
