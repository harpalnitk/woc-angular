import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './core/welcome/welcome.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: 'welcome', component: WelcomeComponent},
  {path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canLoad: [AuthGuard]},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canLoad: [AuthGuard]},
  {path: 'questions', loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsModule)},
  { path: '',   redirectTo: '/welcome', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
// guards can be provided in the routing module
// guard is basically a service
// this will still be available to entire application
