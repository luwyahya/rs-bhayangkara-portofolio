import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasienlamaComponent } from './pasienlama.component';

describe('PasienlamaComponent', () => {
  let component: PasienlamaComponent;
  let fixture: ComponentFixture<PasienlamaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasienlamaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasienlamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
