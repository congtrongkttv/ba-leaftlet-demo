import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDriversComponent } from './report-drivers.component';

describe('ReportDriversComponent', () => {
  let component: ReportDriversComponent;
  let fixture: ComponentFixture<ReportDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDriversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
