import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoMovimientosPage } from './auto-movimientos.page';

describe('AutoMovimientosPage', () => {
  let component: AutoMovimientosPage;
  let fixture: ComponentFixture<AutoMovimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoMovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
