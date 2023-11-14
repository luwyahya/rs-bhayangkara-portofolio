import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemanggilanApotikComponent } from './pemanggilanapotik.component';

describe('PemanggilanApotikComponent', () => {
  let component: PemanggilanApotikComponent;
  let fixture: ComponentFixture<PemanggilanApotikComponent>;
    //test : Date = new Date();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemanggilanApotikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemanggilanApotikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
