import { Routes } from '@angular/router';
import { TodosComponent } from './components/todos/todos.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'todos', component: TodosComponent },
];
