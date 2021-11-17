import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  base_url = 'https://booksed17b015.herokuapp.com/api/';
  external = 'external-books/';
  internal = 'v1/books/';

  constructor(private http: HttpClient) { }

  setBaseURL(url: string) {
    this.base_url = url;
  }

  getExternalBooks(name: string) {
    return this.http.get(this.base_url+this.external, {params: {'name': name}});
  }

  getAllBooks(filters: any) {
    Object.keys(filters).forEach((k) => filters[k] == '' && delete filters[k]);
    if('year' in filters) {
      filters['release_date'] = +filters['year'];
      delete filters['year'];
    }
    return this.http.get(this.base_url+this.internal, {params: filters});
  }

  getBookByID(id: number) {
    return this.http.get(this.base_url+this.internal+id);
  }

  deleteBook(id: number) {
    return this.http.delete(this.base_url+this.internal+id);
  }

  postBook(book: object) {
    return this.http.post(this.base_url+this.internal, book);
  }

  patchBook(id: number, book: object) {
    return this.http.patch(this.base_url+this.internal+id+'/', book);
  }

}
