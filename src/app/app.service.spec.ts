import { TestBed, inject, async } from '@angular/core/testing';

import { AppService } from './app.service';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AppService', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService],
      imports: [HttpClient]
    });

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new AppService(httpSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getMembers should return an Observable', (done: DoneFn) => {
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


  it('#getTeams should return an Observable', (done: DoneFn) => {
    const mockTeams = [
      {
        "id": 1,
        "teamNameName": "Formula 1 - Car 77"
      }
      , {
        "id": 5,
        "teamName": "Deutsche Tourenwagen Masters - Car 117"
      }
    ];

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
