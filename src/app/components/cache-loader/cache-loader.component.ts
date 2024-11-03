import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../../app/services/cache.service';

@Component({
  selector: 'app-cache-loader',
  templateUrl: './cache-loader.component.html'
})
export class CacheLoaderComponent implements OnInit {
  constructor(private cache: CacheService) {}

  ngOnInit() {}
}
