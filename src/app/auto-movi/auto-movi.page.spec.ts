import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoMoviPage } from './auto-movi.page';

describe('AutoMoviPage', () => {
  let component: AutoMoviPage;
  let fixture: ComponentFixture<AutoMoviPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoMoviPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
