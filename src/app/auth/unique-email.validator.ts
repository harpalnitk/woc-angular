import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class UniqueEmailValidator implements AsyncValidator {
  constructor(private authservice: AuthService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log('ctrl value' + ctrl.value);
    return this.authservice.isEmailTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueEmail: 'taken' } : null)),
      catchError((error) => of({uniqueEmail: 'error'}))
    );
  }
}
