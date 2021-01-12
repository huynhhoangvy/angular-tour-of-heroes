import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/app/hero';
import { HeroService } from 'src/app/hero.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.sass'],
})
export class HeroesComponent implements OnInit {
  heroes!: Hero[];

  constructor(
    private _heroService: HeroService,
    private _messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this._heroService.getHeroes().subscribe(
      heroes => this.heroes = heroes,
      (err) => console.error(err),
      () => console.log('complete'),
    );
  }

  add(name: string): void {
    name = name.trim();
    if ( !name ) {
      return;
    }
    this._heroService.addHero({ name } as Hero)
        .subscribe(
          hero => this.heroes.push(hero),
          err => console.error(err),
          () => console.log('complete'),
        );
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this._heroService.deleteHero(hero)
      .subscribe();
  }
}
