import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePopupComponent } from './vehicle-popup.component';

describe('VehiclePopupComponent', () => {
  let component: VehiclePopupComponent;
  let fixture: ComponentFixture<VehiclePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
