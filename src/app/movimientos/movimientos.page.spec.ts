import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientosPage } from './movimientos.page';
import { MovimientosPageModule } from './movimientos.module';
import { sqliteMockProvider } from '../../testing/sqlite-mock';

describe('MovimientosPage', () => {
  let component: MovimientosPage;
  let fixture: ComponentFixture<MovimientosPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovimientosPageModule],
      providers: [sqliteMockProvider]
    });
    fixture = TestBed.createComponent(MovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
