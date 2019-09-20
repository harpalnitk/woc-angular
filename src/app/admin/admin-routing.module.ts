import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';
import {AdminComponent} from './admin.component';
import {AdminUserListComponent} from './admin-user-list/admin-user-list.component';
import {AdminUserEditComponent} from './admin-user-edit/admin-user-edit.component';
import {AuthAdminGuard} from '../auth/auth-admin-guard';
import {AdminUserResolverService} from './admin-user-resolver.service';

const adminRoutes: Routes = [
  {path: '',
    component: AdminComponent,
    // canActivate: [AuthGuard],
    data: { title: 'Admin Dashboard' },
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {path: '', component: AdminUserListComponent, data: { animation: 'users', title: 'Users List' }},
          {path: 'new', component: AdminUserEditComponent, data: { animation: 'user', title: 'Add User' }, canActivate: [AuthAdminGuard]},
          {path: ':id/edit', component: AdminUserEditComponent,resolve: [AdminUserResolverService], data: { animation: 'user', title: 'Edit User' }, canActivate: [AuthAdminGuard]}
        ]}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
