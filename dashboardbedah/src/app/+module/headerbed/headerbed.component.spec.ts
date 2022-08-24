import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderbedComponent } from './headerbed.component';

describe('HeaderbedComponent', () => {
  let component: HeaderbedComponent;
  let fixture: ComponentFixture<HeaderbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderbedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
