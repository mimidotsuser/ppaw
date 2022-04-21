import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { EMPTY, Observable, Subject, Subscription, tap } from 'rxjs';
import { HttpService } from './http.service';
import { extractFilenameFromHeader } from '../../utils/utils';
import { FileService } from './file.service';

@Injectable({providedIn:'root'})
export class DownloadService {

  private _queueEvents: Subject<QueueModel> = new Subject<QueueModel>();

  private _downloadRequests: { path: string, blob?: Blob[], filename?: string } [] = [];

  constructor(private httpService: HttpService, private fileService: FileService) { }

  private download({path, filename}: { path: string, filename?: string }): Subscription {
    //emit queue busy event
    this._queueEvents.next({filename, path, status: 'processing'})

    const index = this._downloadRequests.push({filename, path}) - 1
    return this.httpService.downloadFile(path, {observe: 'response'})
      .pipe(tap({
        next: () => this._queueEvents.next({filename, path, status: 'processed'}),
        error: () => this._queueEvents.next({filename, path, status: 'failed'}),
      }))
      .subscribe({
        next: (res: HttpResponse<Blob>) => {
          if (res.body && res.body.size > 0) {
            //update the stack
            this._downloadRequests[ index ].blob = [res.body]
            //override the filename if possible
            filename = extractFilenameFromHeader(res.headers.get('Content-Disposition'), filename);
            this._downloadRequests[ index ].filename = filename;

            const contentType=filename.endsWith('.zip')?'application/zip':'application/pdf'
            //download
            this.fileService.saveBlobToFile([res.body], filename,contentType);

          } else {
            this._downloadRequests.splice(index, 1);
          }
        },
        error: (err) => {
          //remove item from stack
          this._downloadRequests.splice(index, 1);
          //notify any subscribers
        }
      })

  }

  queue({path, filename}: { path: string, filename?: string }): Subscription {
    //check already on download requests
    const index = this._downloadRequests.findIndex((req) => {
      return req.path === path && filename === path && req.blob
    })

    if (index == -1) {
      return this.download({path, filename})
    } else {
      this.fileService.saveBlobToFile(
        this._downloadRequests[ index ].blob!,
        this._downloadRequests[ index ].filename!
      );
      return EMPTY.subscribe();
    }
  }

  get queueEvents(): Observable<QueueModel> {
    return this._queueEvents;
  }


}

interface QueueModel {
  path: string,
  filename?: string,
  status: 'processing' | 'processed' | 'failed'
}
