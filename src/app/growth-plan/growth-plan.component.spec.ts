import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthPlanComponent } from './growth-plan.component';

describe('GrowthPlanComponent', () => {
  let component: GrowthPlanComponent;
  let fixture: ComponentFixture<GrowthPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowthPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
