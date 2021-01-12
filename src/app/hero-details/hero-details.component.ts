import { Component, Input, OnInit } from '@angular/core';
import { Hero } from 'src/app/hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from 'src/app/hero.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.sass'],
})
export class HeroDetailsComponent implements OnInit {
  @Input() hero: Hero = { id: 0, name: '' };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _heroService: HeroService,
    private _location: Location,
  ) {
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this._heroService.getHero(id)
        .subscribe(
          hero => this.hero = hero,
          err => console.error(err),
          () => console.log('complete'),
        );
  }

  goBack(): void {
    this._location.back();
  }

  save(): void {
    this._heroService.updateHero(this.hero)
        .subscribe(
          () => this.goBack(),
          err => console.error(err),
          () => console.log('complete'),
        );
  }

}
