import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class SteamService {

  private apiKey: string = '0CFDAECDFC80559697665F36313E4C36';
  private baseUrl: string = 'http://cors-anywhere.herokuapp.com/api.steampowered.com/ISteamUser';

  constructor(
    private http: HttpClient
  ) {}

  public getSteamUserData(steamId: string ): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamId}&format=json`)
  }

  public getSteamIdByUsername(username: string) {
    return this.http.get(`${this.baseUrl}/ResolveVanityURL/v0001/?key=${this.apiKey}&vanityurl=${username}`);
  }
}