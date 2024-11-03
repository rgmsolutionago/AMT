import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieLogic } from '../../services/movie-logic.service';

@Component({
  selector: 'app-clean-cache',
  templateUrl: './clean-cache.component.html'
})
export class CleanCacheComponent implements OnInit {
  constructor(private router: Router, private logic: MovieLogic) {}

  ngOnInit() {
    this.logic.cleanOrder();
    this.logic.cleanLastWebCodeTicket();
    this.router.navigate(['/']);
  }
}
