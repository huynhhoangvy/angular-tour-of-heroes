import { Injectable } from '@angular/core';
import { Hero } from 'src/app/hero';
import { Observable, of } from 'rxjs';
import { MessageService } from 'src/app/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private heroesUrl = 'api/heroes';

  constructor(
    private _messageService: MessageService,
    private _http: HttpClient,
  ) {
  }

  getHeroes(): Observable<Hero[]> {
    // this._messageService.add('HeroService: fetched heroes');
    // return of(HEROES);
    return this._http.get<Hero[]>(this.heroesUrl)
               .pipe(
                 tap(_ => this.log('tap fetched heroes')),
                 catchError(this.handleError<Hero[]>('getHeroes', [])),
               );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this._http.get<Hero[]>(url)
               .pipe(
                 map(heroes => heroes[0]), // returns a {0|1} element array
                 tap(h => {
                   const outcome = h ? `fetched` : `did not find`;
                   this.log(`${outcome} hero id=${id}`);
                 }),
                 catchError(this.handleError<Hero>(`getHero id=${id}`)),
               );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    // this._messageService.add(`HeroService: fetch hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id) || HEROES[0]);
    const url = `${this.heroesUrl}/${id}`;
    return this._http.get<Hero>(url)
               .pipe(
                 tap(_ => this.log(`fetched hero id=${id}`)),
                 catchError(this.handleError<Hero>(`getHero id=${id}`)),
               );
  }

  updateHero(hero: Hero): Observable<any> {
    return this._http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero')),
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this._http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
               .pipe(
                 tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
                 catchError(this.handleError<Hero>('addHero')),
               );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this._http.delete<Hero>(url, this.httpOptions)
               .pipe(
                 tap(_ => this.log(`deleted hero id=${id}`)),
                 catchError(this.handleError<Hero>('deleteHero')),
               );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if ( !term.trim() ) {
      // if not search term, return empty hero array
      return of([]);
    }
    return this._http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
               .pipe(
                 tap(x => x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matching "${term}`)),
                 catchError(this.handleError<Hero[]>('searchHeroes', [])),
               );
  }

  private log(message: string): void {
    this._messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
