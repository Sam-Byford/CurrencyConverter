import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConversionFormComponent } from './conversion-form.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConvertService } from 'src/app/services/convert.service';
import { of } from 'rxjs';
import { Currency } from 'src/app/modals';

describe('ConversionFormComponent', () => {
  let component: ConversionFormComponent;
  let fixture: ComponentFixture<ConversionFormComponent>;

  let convertServiceSpy: jasmine.SpyObj<ConvertService>
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>

  beforeEach(() => {
    convertServiceSpy = jasmine.createSpyObj<ConvertService>('ConvertService', ['fetchSymbols', 'convertCurrency', 'getConvertedCurrency', 'convertCurrencyFake'])
    toastrServiceSpy = jasmine.createSpyObj<ToastrService>('ToastrService', ['error'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), MatFormFieldModule, MatSelectModule, MatIconModule, 
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      providers: [ {provide: ConvertService, useValue: convertServiceSpy}, {provide: ToastrService, useValue: toastrServiceSpy} ],
      declarations: [ConversionFormComponent]
    });
    fixture = TestBed.createComponent(ConversionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise form', () => {
    component.initForm()
    expect(component.currencyConvertForm).toBeDefined()
    expect(component.currencyConvertForm.controls['convertSymbol'].value).toEqual("GBP")
  })

  it('should fetch symbols', () =>{
    const symbols = [
      {
      value: "GBP",
      symbol: "£"
      },
      {
        value: "EUR",
        symbol: "€"
      },
    ]
    convertServiceSpy.fetchSymbols.and.returnValue(symbols)
    component.fetchSymbols()
    expect(component.currencySymbols).toEqual(symbols)
  })

  it("should set exchanged value if base symbol is 'EUR'", () =>{
    const currency: Currency = { value: 1, currencySymbol: { value: "GBP", symbol: "" } }
    const convertedCurrency: Currency = { value: 0.86, currencySymbol: { value: "GBP", symbol: "£" }}

    convertServiceSpy.convertCurrency.and.returnValue(of(true))
    convertServiceSpy.getConvertedCurrency.and.returnValue(of(convertedCurrency))

    component.currencyConvertForm.controls['baseValue'].setValue(1)

    expect(convertServiceSpy.convertCurrency).toHaveBeenCalledWith(currency)
    expect(convertServiceSpy.getConvertedCurrency).toHaveBeenCalled()
    expect(component.exchangedValue).toEqual(convertedCurrency.value)
  })

  it("should set exchanged value if base symbol is not 'EUR'", () =>{
    const currency: Currency = { value: 1, currencySymbol: { value: "GBP", symbol: "" } }
    const convertedCurrency: Currency = { value: 0.78, currencySymbol: { value: "GBP", symbol: "£" }}

    convertServiceSpy.convertCurrencyFake.and.returnValue(of(true))
    convertServiceSpy.getConvertedCurrency.and.returnValue(of(convertedCurrency))

    component.currencyConvertForm.controls['baseSymbol'].setValue("USD")
    component.currencyConvertForm.controls['baseValue'].setValue(1)

    expect(convertServiceSpy.convertCurrencyFake).toHaveBeenCalledWith(currency, "USD")
    expect(convertServiceSpy.getConvertedCurrency).toHaveBeenCalled()
    expect(component.exchangedValue).toEqual(convertedCurrency.value)
  })

  it("should display error if error thrown during conversion", () =>{
    convertServiceSpy.convertCurrency.and.throwError(new Error("conversion failed"))

    component.currencyConvertForm.controls['baseValue'].setValue(1)

    expect(toastrServiceSpy.error).toHaveBeenCalled()
    expect(component.exchangedValue).toEqual(0)
  })
});
