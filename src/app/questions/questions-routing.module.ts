import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuestionsComponent} from './questions.component';
import {QuestionListComponent} from './question-list/question-list.component';

const questionRoutes: Routes = [
  {path: '',
    component: QuestionsComponent,
    // canActivate: [AuthGuard],
    data: { title: 'Questions' },
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        children: [
          {path: '', component: QuestionListComponent, data: { title: 'Questions List' }},
         // {path: 'new', component: AdminUserEditComponent, data: { animation: 'user', title: 'Add User' }, canActivate: [AuthAdminGuard]},
         // {path: ':id/edit', component: AdminUserEditComponent,resolve: [AdminUserResolverService], data: { animation: 'user', title: 'Edit User' }, canActivate: [AuthAdminGuard]}
        ]}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(questionRoutes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
