import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeService } from './service/employee.service';
import { TarefaComponent } from './components/tarefa/tarefa.component';
import { AlunoComponent } from './components/aluno/aluno.component';

@NgModule({
  declarations: [
    AppComponent,
    TarefaComponent,
    AlunoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DialogModule,
    DividerModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [EmployeeService, ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
