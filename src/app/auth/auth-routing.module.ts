import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from './signup/signup.component';
import {SignInComponent} from './signin/signin.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {path: 'signup', component: SignUpComponent,  data: { title: 'Sign Up' }},
  {path: 'signin', component: SignInComponent, data: { title: 'Sign In' }}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
