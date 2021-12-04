import { TestBed, inject, async } from '@angular/core/testing';

import { AppService } from './app.service';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

const mockMembers = [
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Driver",
    "team": "Formula 1 - Car 77",
    "status": "Active"
  }
  , {
    "id": 3,
    "firstName": "Jeb",
    "lastName": "Jackson",
    "jobTitle": "Reserve Driver",
    "team": "Formula 1 - Car 77",
    "status": "Inactive"
  }
];

const mockTeams = [
  {
    "id": 1,
    "teamName": "Formula 1 - Car 77"
  }
  , {
    "id": 5,
    "teamName": "Deutsche Tourenwagen Masters - Car 117"
  }
];

describe('AppService', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService],
      imports: [HttpClient]
    });

    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    service = new AppService(httpSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setUser should update username', () => {
    service.username = 'name 1';
    service.setUsername('name 2');
    expect(service.username).toEqual('name 2');
  });

  it('#getMembers should make an http get call and return an Observable', (done: DoneFn) => {
    httpSpy.get.and.returnValue(of(mockMembers));

    service.getMembers().subscribe(
      result => {
        expect(result).toEqual(mockMembers, 'mock members');
        done();
      },
      done.fail
    );

    expect(httpSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('#addMember should take a member object, make an http post call, and return an Observable', (done: DoneFn) => {
    const resp = { SUCCESS: true };

    httpSpy.post.and.returnValue(of(resp));

    service.addMember(mockMembers[0]).subscribe(
      result => {
        expect(result).toEqual(resp);
        done();
      },
      done.fail
    );

    expect(httpSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('#editMember should take a member object, make an http post call, and return an Observable', (done: DoneFn) => {
    const resp = { SUCCESS: true };

    httpSpy.post.and.returnValue(of(resp));

    service.editMember(mockMembers[1]).subscribe(
      result => {
        expect(result).toEqual(resp);
        done();
      },
      done.fail
    );
    expect(httpSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('#deleteMember should take a number, make an http post call, and return an Observable', (done: DoneFn) => {
    const resp = { SUCCESS: true };

    httpSpy.post.and.returnValue(of(resp));

    service.deleteMember(1).subscribe(
      result => {
        expect(result).toEqual(resp);
        done();
      },
      done.fail
    );
    expect(httpSpy.post.calls.count()).toBe(1, 'one call');
  });


  it('#getTeams should make an http get call and return an Observable', (done: DoneFn) => {
    httpSpy.get.and.returnValue(of(mockTeams));

    service.getMembers().subscribe(
      result => {
        expect(result).toEqual(mockTeams, 'mock teams');
        done();
      },
      done.fail
    );

    expect(httpSpy.get.calls.count()).toBe(1, 'one call');
  });

});
