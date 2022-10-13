import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPpiComponent } from './dashboard-ppi.component';

describe('DashboardPpiComponent', () => {
  let component: DashboardPpiComponent;
  let fixture: ComponentFixture<DashboardPpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
