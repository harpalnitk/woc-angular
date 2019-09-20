import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {slideInAnimation} from '../shared/animations/animation';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [ slideInAnimation ]

})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }
  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
