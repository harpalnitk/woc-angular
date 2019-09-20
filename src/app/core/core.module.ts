import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessagesComponent} from './messages/messages.component';
import {HeaderComponent} from './navigation/header/header.component';
import {SidenavListComponent} from './navigation/sidenav-list/sidenav-list.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {AskCrowdComponent} from './ask-crowd/ask-crowd.component';
import {AskQuestionComponent} from './ask-crowd/ask-question/ask-question.component';
import {SharedModule} from '../shared/shared.module';
import {AppRoutingModule} from '../app-routing.module';

@NgModule({
  declarations: [MessagesComponent, HeaderComponent, SidenavListComponent, WelcomeComponent, AskCrowdComponent, AskQuestionComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    MessagesComponent,
    AskCrowdComponent,
    AskQuestionComponent]
})
export class CoreModule { }
