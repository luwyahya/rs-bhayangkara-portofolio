import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilihPoliComponent } from './pilih-poli.component';

describe('PilihPoliComponent', () => {
  let component: PilihPoliComponent;
  let fixture: ComponentFixture<PilihPoliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilihPoliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilihPoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
