import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import {SharedModule} from '../shared/shared.module';
import {StoreModule} from '@ngrx/store';
import {userReducer} from './store/user.reducer';
import {EffectsModule} from '@ngrx/effects';
import {UserEffect} from './store/user-effect';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  declarations: [UserComponent, UserDetailComponent, UserEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature([UserEffect])
  ]
})
export class UserModule { }
