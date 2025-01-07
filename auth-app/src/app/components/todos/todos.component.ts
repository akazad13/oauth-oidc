import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Injector,
} from '@angular/core';
import { Todo } from '../../models/todo';
import { Auth } from '../../interface/auth';
import { TodoService } from '../../services/todo.service';
import { AuthSvcVer } from '../../models/auth-svc-ver.enum';
import { AuthV1Service } from '../../services/auth-v1.service';
import { AuthV2Service } from '../../services/auth-v2.service';
import { Constants } from '../../constants';
import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-todos',
  imports: [NgFor],
  templateUrl: './todos.component.html',
  styles: ``,
})
export class TodosComponent implements AfterViewInit {
  todoList: Todo[] = [];
  dialog: any;
  todoId: string = '';

  private readonly authService: Auth;

  constructor(
    private readonly injector: Injector,
    private readonly todoService: TodoService,
    private readonly alertifyService: AlertifyService
  ) {
    if (AuthSvcVer.V1 === Constants.authSvcVer) {
      this.authService = injector.get(AuthV1Service);
    } else {
      this.authService = injector.get(AuthV2Service);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.authService.getUserInfo(), 1000);
  }

  public getTodoList(): void {
    this.todoList = [];

    this.todoService
      .getTodos()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle unauthorized
            this.alertifyService.error('Unauthorized');
          }
          return [];
        })
      )
      .subscribe((resp) => {
        if (resp) this.todoList = resp.body ?? [];
      });
  }

  public getTodoById(): void {
    this.todoList = [];
    this.dialog.close();
    this.todoService.getTodoById(this.todoId).subscribe((resp) => {
      if (resp.body) {
        this.todoList.push(resp.body);
      }
      this.todoId = '';
    });
  }
}
