import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {
  constructor() {
    if (!environment.production) {
      this.injectTrackingScript();
    }
  }

  injectTrackingScript() {
    const paq =  (window as any)['_paq'] ? (window as any) ['_paq'] as any[] : [];
    paq.push(['trackPageView']);
    paq.push(['enableLinkTracking']);
    paq.push(['setTrackerUrl', environment.app.matomo.url]);
    paq.push(['setSiteId', environment.app.matomo.siteId]);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = environment.app.matomo.scriptUrl;
    const existingScripts = document.getElementsByTagName('script');
    const anchor = existingScripts && existingScripts.length > 0 ? existingScripts[ 0 ] : document.head!;
    anchor!.parentNode!.insertBefore(script, anchor);
  }

}
