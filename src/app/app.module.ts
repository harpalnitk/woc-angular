import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AuthModule} from './auth/auth.module';
import {AuthService} from './auth/auth.service';
import {UiService} from './shared/services/ui.service';
import {UniqueEmailValidator} from './auth/unique-email.validator';
import {httpInterceptorProviders} from './shared/http-interceptors';
import {UserService} from './user/user.service';
import {environment} from '../environments/environment';
import * as fromRoot from './app.reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {CustomSerializer} from './shared/custom-route-serializer';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './auth/store/auth.effects';
import {AppConfigService} from './shared/services/app-config.service';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {AskQuestionComponent} from './core/ask-crowd/ask-question/ask-question.component';


// export const metaReducers: MetaReducer<fromRoot.AppState>[] = !environment.production ? [storeFreeze] : [];
const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

const svgLoaderFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadSVGConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // the above three import needs to be in app module only
    SharedModule,
    CoreModule,
    AuthModule,
    StoreModule.forRoot(fromRoot.reducers, {
      // metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: false,
        strictActionSerializability: false,
      }}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production
    }),
    EffectsModule.forRoot([AuthEffects]),
    StoreRouterConnectingModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    httpInterceptorProviders,
    AuthService,
    UiService,
    UniqueEmailValidator,
    UserService,
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: svgLoaderFn,
      multi: true,
      deps: [AppConfigService]
    }],
  entryComponents: [AskQuestionComponent],
  bootstrap: [AppComponent]
})



export class AppModule { }
