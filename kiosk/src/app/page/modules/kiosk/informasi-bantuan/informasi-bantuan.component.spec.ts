import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiBantuanComponent } from './informasi-bantuan.component';

describe('InformasiBantuanComponent', () => {
  let component: InformasiBantuanComponent;
  let fixture: ComponentFixture<InformasiBantuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformasiBantuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiBantuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
