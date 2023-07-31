import { TestBed } from '@angular/core/testing';
import { ConvertService } from './convert.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConvertHttpService } from './convert-http.service';
import { Currency } from '../modals';
import { round } from 'lodash-es';
import { of } from 'rxjs';

describe('ConvertService', () => {
  let service: ConvertService;
  let convertHttpServiceSpy: jasmine.SpyObj<ConvertHttpService>
  const defaultCurrencyObj: Currency = {value: 0, currencySymbol: {value: "EUR", symbol: "€"}}
  const defaultChangedCurrencyObj: Currency = {value: 1, currencySymbol: {value: "EUR", symbol: "€"}}
  const defaultRate = 0.858741 //GBP

  beforeEach(() => {
    convertHttpServiceSpy = jasmine.createSpyObj<ConvertHttpService>('ConvertHttpService', ['getLatestRate'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: ConvertHttpService, useValue: convertHttpServiceSpy}],
      declarations: []});
    service = TestBed.inject(ConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get convertedCurrency', () => {
    service.getConvertedCurrency().subscribe(resp =>{
        expect(resp).toBeDefined()
        expect(resp).toEqual(defaultCurrencyObj)
    })
  })

  it('should set convertedCurrency', () => { 
    service.setConvertedCurrency(defaultChangedCurrencyObj)
    service.getConvertedCurrency().subscribe(resp =>{
        expect(resp).toBeDefined()
        expect(resp).toEqual(defaultChangedCurrencyObj)
    })
  })

  it('should calculate converted currency', () =>{
    const setConvertedCurrencySpy = spyOn(service, 'setConvertedCurrency')
    const currencyValue = 1;
    const rate = defaultRate;
    const currencySymbol = { value: "GBP", symbol: "£" }

    service.calculateConvertedCurrency(currencyValue, rate, currencySymbol)

    const convertedCurrency: Currency = {
        value: round(currencyValue * rate, 6),
        currencySymbol: currencySymbol
      } 

    expect(setConvertedCurrencySpy).toHaveBeenCalledWith(convertedCurrency)
  })

  it('should get latest rate and convert currency', () => {
    const calculateConvertedCurrencySpy = spyOn(service, 'calculateConvertedCurrency')
    convertHttpServiceSpy.getLatestRate.and.returnValue(of(defaultRate))
    service.convertCurrency(defaultChangedCurrencyObj).subscribe(() =>{
        expect(calculateConvertedCurrencySpy).toHaveBeenCalledWith(defaultChangedCurrencyObj.value, defaultRate, defaultChangedCurrencyObj.currencySymbol)
    });
  })

  it('should throw error if error fetching latest rate', () => {
    const rateError = new Error("failed to get latest rate")
    convertHttpServiceSpy.getLatestRate.and.throwError(new Error("failed to get latest rate"))
    try
    {
        service.convertCurrency(defaultCurrencyObj).subscribe()
    }
    catch(error) {
        expect(error).toEqual(rateError)
    }
  })

  it("should get latest 'fake' rate and convert currency", () =>{
    const calculateConvertedCurrencySpy = spyOn(service, 'calculateConvertedCurrency')
    service.convertCurrencyFake(defaultChangedCurrencyObj, "USD").subscribe(() =>{
        expect(calculateConvertedCurrencySpy).toHaveBeenCalledWith(defaultChangedCurrencyObj.value, 0.907483, defaultChangedCurrencyObj.currencySymbol)
    });
  })

  it("should throw error if fail to fetch latest 'fake' rate", () =>{
    const ratesNotFoundError = new Error("ConvertCurrencyFakeError: rates not found")
    try 
    {
        service.convertCurrencyFake(defaultChangedCurrencyObj, "invalid").subscribe()
    }
    catch(error){
        expect(error).toEqual(ratesNotFoundError)
    }
  })

  it("should throw error if fail calculate conversion", () =>{
    const calculateRatesError = new Error("ConvertCurrencyFakeError: unable to calculate rates")
    const calculateConvertedCurrencySpy = spyOn(service, 'calculateConvertedCurrency')
    calculateConvertedCurrencySpy.and.throwError(new Error("unable to calculate rates"))
    try 
    {
        service.convertCurrencyFake(defaultChangedCurrencyObj, "USD").subscribe()
    }
    catch(error){
        expect(error).toEqual(calculateRatesError)
    }
  })
});

