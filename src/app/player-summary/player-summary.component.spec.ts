import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSummaryComponent } from './player-summary.component';

describe('PlayerSummaryComponent', () => {
  let component: PlayerSummaryComponent;
  let fixture: ComponentFixture<PlayerSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerSummaryComponent]
    });
    fixture = TestBed.createComponent(PlayerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
