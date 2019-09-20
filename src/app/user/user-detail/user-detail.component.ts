import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/models/user.model';

import * as fromUser from '../store/user.reducer';
import {Store} from '@ngrx/store';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AppConfigService} from '../../shared/services/app-config.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  id: string;
  viewMode = false;
  user$: Observable<User>;
  defaultUrl;
  constructor(private store: Store<fromUser.State>,
              private router: Router,
              private route: ActivatedRoute,
              private config: AppConfigService) { }

  ngOnInit() {
    console.log('User detail on init');
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.id = params.get('id');
        this.viewMode = params.get('id') != null;
      }
    );
    if(this.viewMode) {
      this.user$ = this.store.select(fromUser.getViewUser).pipe(
        map(user =>  _.cloneDeep(user))
      );
    } else {
      this.user$ = this.store.select(fromUser.getUserProfile).pipe(
        map(user =>  _.cloneDeep(user))
      );
    }
        this.defaultUrl = this.config.getConfig('defaultUrl');
  }

  getImageURL(id: string) {
 return this.defaultUrl + "/api/user/"+id+"/avatar";
  }

  editProfile() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
}
