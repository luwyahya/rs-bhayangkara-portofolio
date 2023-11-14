import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AntrianApotikComponent } from './antrianapotik.component';

describe('AntrianApotikComponent', () => {
  let component: AntrianApotikComponent;
  let fixture: ComponentFixture<AntrianApotikComponent>;
    //test : Date = new Date();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntrianApotikComponent,FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntrianApotikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
