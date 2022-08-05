import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifikasiPasienBpjsComponent } from './verifikasi-pasien-bpjs.component';

describe('VerifikasiPasienBpjsComponent', () => {
  let component: VerifikasiPasienBpjsComponent;
  let fixture: ComponentFixture<VerifikasiPasienBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifikasiPasienBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifikasiPasienBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
