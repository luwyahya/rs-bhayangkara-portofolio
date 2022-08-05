import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntrianPromoterComponent } from './antrian-promoter.component';

describe('AntrianPromoterComponent', () => {
  let component: AntrianPromoterComponent;
  let fixture: ComponentFixture<AntrianPromoterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntrianPromoterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntrianPromoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
