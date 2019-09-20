import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './user.component';
import {AuthGuard} from '../auth/auth.guard';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserResolverService} from './user-resolver.service';



const userRoutes: Routes = [
  { path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'me', component: UserDetailComponent, resolve: [UserResolverService],  data: {animation: 'users', title: 'My Profile' }},
      {path: ':id', component: UserDetailComponent, resolve: [UserResolverService],  data: { animation: 'users', title: 'User Profile' }},
      {path: 'me/edit', component: UserEditComponent, resolve: [UserResolverService],  data: { animation: 'user', title: 'Edit User Profile' }}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
