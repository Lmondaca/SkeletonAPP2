import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoMoviPage } from './auto-movi.page';
import { AutoMoviPageModule } from './auto-movi.module';
import { sqliteMockProvider } from '../../testing/sqlite-mock';

describe('AutoMoviPage', () => {
  let component: AutoMoviPage;
  let fixture: ComponentFixture<AutoMoviPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutoMoviPageModule],
      providers: [sqliteMockProvider]
    });
    fixture = TestBed.createComponent(AutoMoviPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
