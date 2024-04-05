import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { http } from '../helpers/enums';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient,
  ) { }

  async sendRequest(url: string, method: http, body: any = null): Promise<any> {
    const objHeader: any = {
      'Content-Type': 'application/json'
    };

    if (method === 'post') {
      return this.http.post(url, body)
    }

    if (method === 'get') {
      return this.http.get(url)
    }

    if (method === 'patch') {
      return this.http.patch(url, body)
    }

    if (method === 'delete') {
      return this.http.delete(url, {
        headers: objHeader,
        body: body
      })
    }
  }
}
