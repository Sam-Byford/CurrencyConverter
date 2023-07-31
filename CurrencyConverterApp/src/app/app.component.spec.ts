import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConversionFormComponent } from './components/conversion-form/conversion-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatCardModule, MatIconModule, HttpClientTestingModule, MatFormFieldModule, MatSelectModule, ToastrModule.forRoot()],
    declarations: [AppComponent, ConversionFormComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
