import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlunoComponent } from './components/aluno/aluno.component';
import { TarefaComponent } from './components/tarefa/tarefa.component';

const routes: Routes = [
  { path: '', component: AlunoComponent },
  { path: 'alunos', component: AlunoComponent },
  { path: 'tarefas', component: TarefaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
