import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { PosterType } from '../model/poster.type';

import { environment } from '../../../environments/environment';

@Injectable()
export class DataService {

  dataUrl: string = environment.baseHref + '/assets/data/space_invaders.json';
  cachedData: PosterType[] = null;

  constructor(private http: HttpClient) { }

  getData(): Observable<PosterType[]> {
    if (this.cachedData === null) {
      return this.http.get(this.dataUrl)
        .map(res => {
          this.cachedData = res['data'];
          // console.log(this.cachedData);
          return <PosterType[]>res['data'] || {}; 
        })
        .catch(this.handleError);
    } else {
      return of(this.cachedData);
    }
  }

  getItem(id: number): Observable<PosterType> {
    let foundItem: PosterType = null;

    if (this.cachedData === null) {
      return this.getData().map((data: PosterType[]) => data.find(item => item.id === id));
    } else {
      this.cachedData.forEach(item => {
        if (item.id === id) {
          foundItem = item;
        }
      });
      return of(foundItem);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
