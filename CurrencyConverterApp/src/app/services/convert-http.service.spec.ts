import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConvertHttpService } from './convert-http.service';
import { RatesTable } from '../fake';
import { environment } from 'src/environments/environment';
import { LatestRate } from '../modals';

describe('ConvertHttpService', () => {
  let service: ConvertHttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
      declarations: []});
    service = TestBed.inject(ConvertHttpService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get latest rate', (done: DoneFn) => { 
    const latestRates = RatesTable.rates[0] //mimics real API call with EUR as default base on free tier
    service.getLatestRate("GBP").subscribe(resp => {
        console.log(resp)
        expect(resp).toBeDefined()
        expect(resp).toEqual(0.858741) //EUR to GBP conversion
        done()
    });
    httpTestingController.expectOne({
        method: 'GET',
        url: 'http://data.fixer.io/api/latest?access_key=' + atob(environment.accessKey) + '&symbols=GBP',
    }).flush(latestRates); //hardcoded so will always be defined   
  })

  it('should fail to get latest rate if error thrown', () => { 
    const failure: LatestRate = { 
        success: false,
        timestamp: 1690717024,
        base: "EUR",
        date: "2023-07-30",
        rates: {}        
    }
    service.getLatestRate("GBP").subscribe(resp =>{
        expect(resp).toBeDefined()
        expect(resp).toEqual(-1)
    });
    httpTestingController.expectOne({
        method: 'GET',
        url: 'http://data.fixer.io/api/latest?access_key=' + atob(environment.accessKey) + '&symbols=GBP',
    }).flush(failure); 
  })

  afterEach(() => {
    httpTestingController.verify();
  });
});

