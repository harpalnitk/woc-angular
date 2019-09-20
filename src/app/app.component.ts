import {Component, OnInit} from '@angular/core';
import * as fromApp from './app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import {Store} from '@ngrx/store';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'basic-app-two';
  navEnd: Observable<NavigationEnd>;
  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title) {
    this.navEnd = router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
  }
  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLoginAction());
    // For changing Title on each page through the data title attribute of each
    // routing module declaration
    this.navEnd.pipe(
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((event) => this.titleService.setTitle(event['title']));
  }
}
