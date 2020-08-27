import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
// Init for the web
import '@capacitor-community/firebase-analytics';
const { FirebaseAnalytics, Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  analyticsEnabled = true;

  constructor(private router: Router) {
    this.initFb();
    this.router.events
      .pipe(filter((e: RouterEvent) => e instanceof NavigationEnd))
      .subscribe((e: RouterEvent) => {
        console.log('route changed: ', e.url);
        this.setScreenName(e.url);
      });
  }

  async initFb() {
    if ((await Device.getInfo()).platform == 'web') {
      FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
    }
  }

  setUser() {
    // Use Firebase Auth uid
    FirebaseAnalytics.setUserId({
      userId: 'test_123'
    });
  }

  setProperty() {
    FirebaseAnalytics.setUserProperty({
      name: 'framework',
      value: 'angular'
    });
  }

  logEvent() {
    FirebaseAnalytics.logEvent({
      name: 'login',
      params: {
        method: 'email'
      }
    });
  }

  setScreenName(screenName) {
    FirebaseAnalytics.setScreenName({
      screenName
    });
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;
    FirebaseAnalytics.setCollectionEnabled({
      enabled: this.analyticsEnabled
    });
  }
}
