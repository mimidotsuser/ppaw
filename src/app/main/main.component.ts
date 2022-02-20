import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  appName: string = environment.app.name;
  logoUrl: string = environment.app.logoUrl;

  constructor() {}

  ngOnInit()
    :
    void {}

}
