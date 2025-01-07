import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Todo } from '../models/todo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todosUrl = 'https://localhost:7169/api/todos'; // URL to web api

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<HttpResponse<Todo[]>> {
    return this.http.get<Todo[]>(this.todosUrl, { observe: 'response' });
  }

  getTodoById(id: string): Observable<HttpResponse<Todo>> {
    const url = `${this.todosUrl}/${id}`;

    return this.http.get<Todo>(url, { observe: 'response' });
  }
}
