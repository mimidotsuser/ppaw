import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  logoUrl = environment.app.logoUrl;
  appName = environment.app.name;

  constructor() { }

  ngOnInit(): void {
  }

}
