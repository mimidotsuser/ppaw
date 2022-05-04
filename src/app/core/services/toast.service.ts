import { Injectable } from '@angular/core';
import { ToastNotificationModel } from '../../models/notification.model';

@Injectable()
export class ToastService {
  private _toasts: ToastNotificationModel[] = [];

  constructor() { }

  show(obj: Omit<ToastNotificationModel, 'delay' | 'type'> & { delay?: number, type?: 'success' | 'danger' }) {

    if (!obj?.delay) {obj.delay = 1500000}
    if (!obj?.type) {obj.type = 'success'}

    this._toasts.push(obj as ToastNotificationModel);
  }

  toasts() {
    return this._toasts;
  }
}
