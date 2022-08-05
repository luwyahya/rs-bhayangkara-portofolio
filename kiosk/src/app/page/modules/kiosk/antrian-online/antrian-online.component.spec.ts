import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntrianOnlineComponent } from './antrian-online.component';

describe('AntrianOnlineComponent', () => {
  let component: AntrianOnlineComponent;
  let fixture: ComponentFixture<AntrianOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntrianOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntrianOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
