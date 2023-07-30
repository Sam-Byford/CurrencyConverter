import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, catchError, mergeMap, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Currency } from 'src/app/modals/currency';
import { CurrencySymbol } from 'src/app/modals/currency-symbols';
import { ConvertService } from 'src/app/services/convert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-conversion-form',
  templateUrl: './conversion-form.component.html',
  styleUrls: ['./conversion-form.component.scss']
})
export class ConversionFormComponent implements OnInit, OnDestroy {
  currencyConvertForm!: FormGroup;
  exchangedValue = 0
  currencySymbols: CurrencySymbol[] = [];

  private unsubscribe: Subscription[] = [];

  constructor(private convertService: ConvertService, private fb: FormBuilder, private toastr: ToastrService){}

  ngOnInit(){
    this.initForm()
    this.listenToForm()
    this.fetchSymbols()
  }

  get f() {
    return this.currencyConvertForm.controls;
  }

  fetchSymbols(){
    this.currencySymbols = this.convertService.fetchSymbols()
  }

  initForm(){
    this.currencyConvertForm = this.fb.group({
      baseValue: [0],
      baseSymbol: ["EUR"],
      convertSymbol: ["GBP"]
    })
  }

  listenToForm(){
    const convertSubscr = this.currencyConvertForm.valueChanges.pipe(
      mergeMap(form => {
          const currencyToConvert: Currency = { value: form.baseValue, currencySymbol: { value: this.f['convertSymbol'].value, symbol: "" } }
          //due to limitations with free tier of fixer api, only base conversions using EUR go through API...
          if (form.baseSymbol == "EUR") {
            return this.convertService.convertCurrency(currencyToConvert)
          }
          else{
            //...all others go through "fake" backend
            return this.convertService.convertCurrencyFake(currencyToConvert, form.baseSymbol)
          }
      }),
      mergeMap(() => {
        return this.convertService.getConvertedCurrency()
      }),
      catchError((error) => {
        this.toastr.error(error.message, "ERROR")
        return of(undefined)
      })
    ).subscribe(convertedResp => {
        if (convertedResp){
          this.exchangedValue = convertedResp.value
        }
        else {
          this.exchangedValue = 0
        }
      }
    )
    this.unsubscribe.push(convertSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
