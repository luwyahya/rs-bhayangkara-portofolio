import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntrianApotikComponent } from './antrian-apotik.component';

describe('AntrianApotikComponent', () => {
  let component: AntrianApotikComponent;
  let fixture: ComponentFixture<AntrianApotikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntrianApotikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntrianApotikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
