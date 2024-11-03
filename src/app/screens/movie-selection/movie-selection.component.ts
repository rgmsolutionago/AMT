import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CustomErrorComponent } from '../../components/custom-error/custom-error.component';

/**
 * Allow to Select a Movie
 */
@Component({
  selector: 'app-movie-selection',
  templateUrl: './movie-selection.component.html'
})
export class MovieSelectionComponent implements OnInit {

  @ViewChild('errorPopup')
  errorPopup: CustomErrorComponent;

  development = !environment.production;

  @ViewChild('carousel')
  carousel: ElementRef;

  movies = [];
  movieCount: number | boolean;
  movieCountForStyle: number | boolean;

  slideConfig = {
    infinite: false,
    centerMode: false,
    dots: true,
    arrows: true,
    rows: 2,
    slidesToShow: 12,
    slidesPerRow: 6,
    slidesToScroll: 8,
    vertical: false
  };

  constructor(private router: Router, 
    private logic: MovieLogic) { }

  addMovieTest = () => this.development ? this.movies.push(this.movies[0]) : undefined;
  removeMovieTest = () => this.development ? this.movies.splice(this.movies.length - 1, 1) : undefined;

  slickStart() {
    const allMovies = this.logic.getMovies();
    const sortedMovies = allMovies.sort((a, b) => (a.OriginalTitle < b.OriginalTitle ? -1 : 1));
    const movies = sortedMovies.reduce((groups, item) => {
      const originalTitle = this.capitalizeFirstLetter(item.OriginalTitle);
      if(originalTitle === null) { //If movie does not have OriginaTitle skip
        return groups;
      }

      const group = groups[originalTitle] || [];
      group.push(item);
      groups[originalTitle] = group;
      return groups;
    }, {});

    this.movies = Object.entries(movies).map(([originalTitle, feature]) => ({ originalTitle, feature }));
    if(this.movies.length == 0){
      this.error("No hay funciones disponibles");
      return;
    }

    this.movieCount = this.movies.length;
    this.movieCountForStyle = this.movies.length;

    // if (this.movieCount < 4) {
    //   this.slideConfig.rows = 1;
    //   this.slideConfig.slidesToShow = this.movieCount;
    //   this.slideConfig.slidesPerRow = this.movieCount;
    // } else if (this.movieCount < 8) {
    //   this.slideConfig.rows = 1;
    //   this.slideConfig.slidesToShow = this.movieCount;
    //   this.slideConfig.slidesPerRow = this.movieCount;
    // } else if (this.movieCount < 12) {
    //   this.slideConfig.rows = 2;
    //   this.slideConfig.slidesToShow = this.movieCount;
    //   this.slideConfig.slidesPerRow = this.movieCount / 2;
    // } else {
    //   this.movieCountForStyle = 12;
    //   this.slideConfig.rows = 2;
    //   this.slideConfig.slidesToShow = 12;
    //   this.slideConfig.slidesPerRow = 2;
    // }

    //Hardcoded configs, commented configs have problems depending on movie count.
    this.movieCountForStyle = 4;
    this.slideConfig.rows = 1;
    this.slideConfig.slidesToShow = 4;
    this.slideConfig.slidesPerRow = 4;
    this.slideConfig.slidesToScroll = 4;
  }

  ngOnInit() {
    this.slickStart();
  }

  select(selectedMovie) {
    this.logic.saveOrder({
      selectedMovie: selectedMovie,
      level: 20
    });

    this.router.navigate(['/funciones']);
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  error(message: string) {
    this.errorPopup.open(message);
  }

  capitalizeFirstLetter(string) {
    if(string === null) {
      return null;
    }

    const words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
    }
    return words.join(" ");
  }
}
