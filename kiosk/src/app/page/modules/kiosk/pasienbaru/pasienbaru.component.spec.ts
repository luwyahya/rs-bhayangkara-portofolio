import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasienbaruComponent } from './pasienbaru.component';

describe('PasienbaruComponent', () => {
  let component: PasienbaruComponent;
  let fixture: ComponentFixture<PasienbaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasienbaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasienbaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
