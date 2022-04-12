import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  saveBlobToFile(blobParts: BlobPart[], filename: string, type = 'application/pdf') {
    const blob = new Blob(blobParts, {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}
