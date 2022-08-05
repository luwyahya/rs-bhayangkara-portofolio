import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DenahComponent } from './denah.component';

describe('DenahComponent', () => {
  let component: DenahComponent;
  let fixture: ComponentFixture<DenahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
