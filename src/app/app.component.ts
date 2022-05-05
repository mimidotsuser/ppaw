import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise, } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {
  constructor(private router: Router, private titleService: Title) {
    if (environment.production) {
      this.injectTrackingScript();

      //tracking starts after loading the initial page
      this.router.events
        .pipe(filter((evt) => evt instanceof RoutesRecognized), pairwise())
        .subscribe((evt: any[]) => {

          setTimeout(() => {
            if ((window as any)[ '_paq' ]) {
              (window as any)[ '_paq' ].push(['setCustomUrl', evt[ 1 ].urlAfterRedirects]);
              (window as any)[ '_paq' ].push(['setDocumentTitle', titleService.getTitle()]);
              (window as any)[ '_paq' ].push(['setReferrerUrl', evt[ 0 ].urlAfterRedirects]);
              (window as any)[ '_paq' ].push(['trackPageView']);
            }
          })

        })

    }
  }

  injectTrackingScript() {
    const paq = (window as any)[ '_paq' ] ? (window as any) [ '_paq' ] as any[] : [];
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
