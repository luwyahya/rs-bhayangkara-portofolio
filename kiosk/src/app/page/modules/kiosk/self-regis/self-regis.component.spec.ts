import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfRegisComponent } from './self-regis.component';

describe('SelfRegisComponent', () => {
  let component: SelfRegisComponent;
  let fixture: ComponentFixture<SelfRegisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfRegisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfRegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
