import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiProfilComponent } from './informasi-profil.component';

describe('InformasiProfilComponent', () => {
  let component: InformasiProfilComponent;
  let fixture: ComponentFixture<InformasiProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformasiProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
