import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoPage } from './movimiento.page';
import { MovimientoPageModule } from './movimiento.module';
import { sqliteMockProvider } from '../../testing/sqlite-mock';

describe('MovimientoPage', () => {
  let component: MovimientoPage;
  let fixture: ComponentFixture<MovimientoPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovimientoPageModule],
      providers: [sqliteMockProvider]
    });
    fixture = TestBed.createComponent(MovimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
