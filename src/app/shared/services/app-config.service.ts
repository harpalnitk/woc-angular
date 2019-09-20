import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor(private http: HttpClient, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  loadAppConfig() {
    return this.http.get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        console.log('CONFIG');
        this.appConfig = data;
      });
  }

  loadSVGConfig() {
    this.iconRegistry.addSvgIconSetInNamespace
    ( "sprite", this.sanitizer.bypassSecurityTrustResourceUrl("assets/svg-icons/sprite.svg"));
  }

  getConfig(key: string) {
    return this.appConfig[key];
  }
}
