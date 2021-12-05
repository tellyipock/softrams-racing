import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let injector: TestBed;
  let guard: AuthGuard;
  let routeMock: any = { snapshot: {}};
  let routeStateMock: any = { snapshot: {}, url: '/test'};
  let routerMock = { navigate: jasmine.createSpy('navigate') };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthGuard,
        { provide: Router, useValue: routerMock } ]
    });

    injector = getTestBed();
    guard = injector.get(AuthGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if no user is logged in', () => {
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should route to the requested page if user is logged in', () => {
    spyOn(guard, 'isLoggedIn').and.returnValue(true);
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });
  
});
