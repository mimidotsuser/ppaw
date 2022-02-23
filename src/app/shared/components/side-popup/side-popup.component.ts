import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-side-popup',
  templateUrl: './side-popup.component.html',
  styleUrls: ['./side-popup.component.scss']
})
export class SidePopupComponent implements OnInit {


  @Input() title: string = '';
  @Input() show = false;
  @Input() id: string = Math.random().toString(32).substr(3);
  @Input() showLeft = false;
  @Input() isFullScreen = false;

  @Output() showChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  close() {
    this.show = false;
    this.showChange.emit(this.show);
  }
}
