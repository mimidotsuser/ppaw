import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { environment } from '../../../environments/environment';

@Injectable()
export class MetaService {

  constructor(private titleService: Title, @Inject(DOCUMENT) private docService: Document) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = environment.app.faviconUrl || 'favicon.ico';
    this.docService.head.append(favicon);
  }


  set title(s: string) {
    this.titleService.setTitle(`${s} | ${environment.app.name}`)
  }
}
