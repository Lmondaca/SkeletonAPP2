import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenPage } from './resumen.page';
import { ResumenPageModule } from './resumen.module';
import { sqliteMockProvider } from '../../testing/sqlite-mock';

describe('ResumenPage', () => {
  let component: ResumenPage;
  let fixture: ComponentFixture<ResumenPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResumenPageModule],
      providers: [sqliteMockProvider]
    });
    fixture = TestBed.createComponent(ResumenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
