import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class FilesApiService {

  constructor(private http: HttpClient) { }

  public SOUND_FILE_GET_URL(target: 'lobby' | 'countdownRunning' | 'countdownEnd', fileName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/files/sound/${encodeURIComponent(target)}/${encodeURIComponent(fileName)}.mp3`;
  }
}
