import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Rate } from '../modals/rate';
import { LatestRate } from '../modals/latest-rate';

@Injectable({
  providedIn: 'root'
})
export class ConvertHttpService {
  constructor(private http: HttpClient) { }

  //fetch latest rates from API with EUR as the default base, then return specific rate we are converting to
  getLatestRate(symbol: string): Observable<Rate> {
    return this.http.get<LatestRate>(environment.apiUrl + 'latest', {params: {access_key: environment.accessKey,symbols: symbol}
    }).pipe(
      map(resp =>{
        console.log(resp)
        //extract specific rate
        const rate: Rate = resp.rates[symbol]
        return rate
      }),
      catchError((error) => {
        throw new Error(error.message)
      })
    );
  }
}