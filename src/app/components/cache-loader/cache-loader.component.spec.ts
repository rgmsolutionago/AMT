import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheLoaderComponent } from './cache-loader.component';

describe('CacheLoaderComponent', () => {
  let component: CacheLoaderComponent;
  let fixture: ComponentFixture<CacheLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
