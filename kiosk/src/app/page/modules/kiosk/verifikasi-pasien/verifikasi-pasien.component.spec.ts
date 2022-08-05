import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifikasiPasienComponent } from './verifikasi-pasien.component';

describe('VerifikasiPasienComponent', () => {
  let component: VerifikasiPasienComponent;
  let fixture: ComponentFixture<VerifikasiPasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifikasiPasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifikasiPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
