import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Currency } from '../modals/currency';
import { ConvertHttpService } from './convert-http.service';
import { Rate } from '../modals/rate';
import { round } from 'lodash-es';
import { RatesTable } from '../fake/rates.table';
import { SymbolsTable } from '../fake/symbols.table';
import { CurrencySymbol } from '../modals/currency-symbols';

@Injectable({
  providedIn: 'root'
})
export class ConvertService {
  constructor(private convertHttpService: ConvertHttpService) { }

  private _convertedCurrencySubject = new BehaviorSubject<Currency>({value: 0, currencySymbol: {value: "EUR", symbol: "€"}})
  private _convertedCurrency$ = this._convertedCurrencySubject.asObservable()

  getConvertedCurrency(): Observable<Currency>{
    return this._convertedCurrency$;
  }

  setConvertedCurrency(value: Currency) {
    return this._convertedCurrencySubject.next(value)
  }
 
  //perform conversion with latest rate from API
  convertCurrency(currency: Currency): Observable<boolean>{
    return this.convertHttpService.getLatestRate(currency.currencySymbol.value).pipe(
        map((rate: Rate) =>{
            const convertedCurrency: Currency = {
                value: round(currency.value * rate, 6),
                currencySymbol: currency.currencySymbol
            } 
            this.setConvertedCurrency(convertedCurrency)
            return true
        }),
        catchError((error: Error) => {
            throw new Error("convertCurrency error: " + error.message) 
        })
    )
  }

  //faked response for all other requests that do not use EUR as base
  convertCurrencyFake(currency: Currency, base: string): Observable<boolean>{
    try{
      const latestRates = RatesTable.rates.find((rate) =>{
        return rate.base === base
      })
      if (latestRates)
      {
        const rate = latestRates.rates[currency.currencySymbol.value]
        const convertedCurrency: Currency = {
          value: round(currency.value * rate, 6),
          currencySymbol: currency.currencySymbol
        }
        this.setConvertedCurrency(convertedCurrency)
        return of(true) 
      }
      throw new Error("rates not found")
    }
    catch(error){
      throw new Error("ConvertCurrentFake - " + error)
    }
  }

  //fetch the list of supported symbols, due to time constraints only 4 currency symbols are supported
  fetchSymbols(): CurrencySymbol[] {
    return SymbolsTable.symbols
  }

}