import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoMovimientosPage } from './auto-movimientos.page';
import { AutoMovimientosPageModule } from './auto-movimientos.module';
import { sqliteMockProvider } from '../../testing/sqlite-mock';

describe('AutoMovimientosPage', () => {
  let component: AutoMovimientosPage;
  let fixture: ComponentFixture<AutoMovimientosPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutoMovimientosPageModule],
      providers: [sqliteMockProvider]
    });
    fixture = TestBed.createComponent(AutoMovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
