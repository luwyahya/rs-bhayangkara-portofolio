import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifikasiPasienBpjsNonpolComponent } from './verifikasi-pasien-bpjs-nonpol.component';

describe('VerifikasiPasienBpjsNonpolComponent', () => {
  let component: VerifikasiPasienBpjsNonpolComponent;
  let fixture: ComponentFixture<VerifikasiPasienBpjsNonpolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifikasiPasienBpjsNonpolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifikasiPasienBpjsNonpolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
