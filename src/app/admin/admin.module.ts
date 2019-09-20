import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminUserListComponent} from './admin-user-list/admin-user-list.component';
import { AdminUserEditComponent } from './admin-user-edit/admin-user-edit.component';
import {AdminComponent} from './admin.component';
import {StoreModule} from '@ngrx/store';
import {adminReducer} from './store/admin.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AdminEffect} from './store/admin.effect';


@NgModule({
  declarations: [AdminComponent, AdminUserListComponent, AdminUserEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    StoreModule.forFeature('admin', adminReducer),
    EffectsModule.forFeature([AdminEffect])
  ]
})
export class AdminModule { }
