import { TestBed, async } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, defer } from 'rxjs';
import { AppService } from './app.service';

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

const mockMembers = [
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Driver",
    "team": "Formula 1 - Car 77",
    "status": "Active"
  },
  {
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
  },
  {
    "id": 5,
    "teamName": "Deutsche Tourenwagen Masters - Car 117"
  }
];

const mockError = new HttpErrorResponse({
  error: 'test 404 error',
  status: 404, statusText: 'Not Found'
});

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

  it('#getMembers should return an error when the server returns an error response', async((done: DoneFn) => {
    const mockError = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
  
    httpSpy.get.and.returnValue(asyncError(mockError));
  
    service.getMembers().subscribe(
      () => done.fail('expected an error, not heroes'),
      error  => {
        expect(error.message).toContain('test 404 error');
        done();
      }
    )
  }));

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

  it('#getTeams should return an error when the server returns an error response', async((done: DoneFn) => {
    const mockError = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
  
    httpSpy.get.and.returnValue(asyncError(mockError));
  
    service.getTeams().subscribe(
      () => done.fail('expected an error, not heroes'),
      error  => {
        expect(error.message).toContain('test 404 error');
        done();
      }
    )
  }));

});
