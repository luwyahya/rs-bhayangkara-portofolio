import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchscreenV2Component } from './touchscreen-v2.component';

describe('TouchscreenV2Component', () => {
  let component: TouchscreenV2Component;
  let fixture: ComponentFixture<TouchscreenV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouchscreenV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchscreenV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
