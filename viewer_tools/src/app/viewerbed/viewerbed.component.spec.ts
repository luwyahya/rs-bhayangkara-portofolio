import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerBedComponent } from './viewerbed.component';

describe('PemanggilanApotikComponent', () => {
  let component: ViewerBedComponent;
  let fixture: ComponentFixture<ViewerBedComponent>;
    //test : Date = new Date();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerBedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerBedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
