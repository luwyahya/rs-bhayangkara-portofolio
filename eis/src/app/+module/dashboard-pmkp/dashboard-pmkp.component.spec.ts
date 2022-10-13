import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPmkpComponent } from './dashboard-pmkp.component';

describe('DashboardPmkpComponent', () => {
  let component: DashboardPmkpComponent;
  let fixture: ComponentFixture<DashboardPmkpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPmkpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPmkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
