import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiDokterComponent } from './informasi-dokter.component';

describe('InformasiDokterComponent', () => {
  let component: InformasiDokterComponent;
  let fixture: ComponentFixture<InformasiDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformasiDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
