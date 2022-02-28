import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-side-popup',
  templateUrl: './side-popup.component.html',
  styleUrls: ['./side-popup.component.scss']
})
export class SidePopupComponent implements OnInit {

  faWindowMaximize = faWindowMaximize;
  faWindowClose = faWindowClose;

  @Input() title: string = '';
  @Input() show = false;
  @Input() id: string = Math.random().toString(32).substr(3);
  @Input() showLeft = false;
  @Input() isFullScreen = false;
  @Input() showFullscreenIcon = true;
  @Input() showCloseIcon = true;

  @Output() showChange = new EventEmitter<boolean>();
  @Output() isFullScreenChange = new EventEmitter<boolean>()

  constructor() {
  }

  ngOnInit(): void {
  }

  close() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  toggleFullscreen() {
    this.isFullScreen = !this.isFullScreen;
    this.isFullScreenChange.emit(this.isFullScreen)
  }
}
