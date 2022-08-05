import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenispasienComponent } from './jenispasien.component';

describe('JenispasienComponent', () => {
  let component: JenispasienComponent;
  let fixture: ComponentFixture<JenispasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenispasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenispasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
