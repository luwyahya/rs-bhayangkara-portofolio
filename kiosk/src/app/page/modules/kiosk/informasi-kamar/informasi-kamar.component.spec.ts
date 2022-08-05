import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiKamarComponent } from './informasi-kamar.component';

describe('InformasiKamarComponent', () => {
  let component: InformasiKamarComponent;
  let fixture: ComponentFixture<InformasiKamarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformasiKamarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiKamarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
