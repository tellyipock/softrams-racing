import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])]
      , providers: [Router, AuthGuard]
    });
  });

  // it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
  //   expect(guard).toBeTruthy();
  // }));

});
