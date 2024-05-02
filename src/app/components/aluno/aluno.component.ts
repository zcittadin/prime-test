import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../service/employee.service';
import { ConfirmationService, MessageService } from 'primeng/api';

const electron = (<any>window).require('electron');

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.css'
})
export class AlunoComponent implements OnInit {

  visible: boolean = false;
  idEditing: number = 0;
  idRemove: number = 0;
  formEmployee!: FormGroup;
  employees!: Employee[];
  dialogTitle!: string;

  constructor(private formBuilder: FormBuilder,
    private empService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, private zone: NgZone
  ) {
    electron.ipcRenderer.on('insert_done', this.insertDone);
    electron.ipcRenderer.on('update_done', this.updateDone);
    electron.ipcRenderer.on('remove_done', this.removeDone);
    electron.ipcRenderer.on('fetch_done', this.fetchDone);
  }

  ngOnInit(): void {
    const emp = new Employee();
    this.formEmployee = this.formBuilder.group({
      firstName: [emp.firstName],
      lastName: [emp.lastName],
      salary: [emp.salary]
    })
    this.getAll();
  }

  ngOnDestroy(): void {
    this.messageService.clear();
    electron.ipcRenderer.removeListener('insert_done', this.insertDone);
    electron.ipcRenderer.removeListener('update_done', this.updateDone);
    electron.ipcRenderer.removeListener('remove_done', this.removeDone);
    electron.ipcRenderer.removeListener('fetch_done', this.fetchDone);
  }

  getAll() {
    electron.ipcRenderer.send('get_all', null);
  }

  onSubmit() {
    if (this.idEditing !== 0) {
      const param = {
        id: this.idEditing,
        data: this.formEmployee.value
      };
      electron.ipcRenderer.send('update', param);
      this.formEmployee.reset();
      this.visible = false;
      this.idEditing = 0;
    } else {
      electron.ipcRenderer.send('insert', this.formEmployee.value);
      this.formEmployee.reset();
      this.visible = false;
    }
  }

  edit(employee: Employee) {
    console.log(JSON.stringify(employee));
    this.formEmployee.get('firstName')?.setValue(employee.firstName);
    this.formEmployee.get('lastName')?.setValue(employee.lastName);
    this.formEmployee.get('salary')?.setValue(employee.salary);
    this.dialogTitle = "Edição de registro"
    this.idEditing = employee.id;
    this.visible = true;
  }

  remove(employee: Employee) {
    this.idRemove = employee.id;
    electron.ipcRenderer.send('remove', employee.id);
  }

  confirm(employee: Employee) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Deseja realmente remover esse registro?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.remove(employee);
      },
      reject: () => {
        this.visible = false;
      }
    });
  }

  showDialog() {
    this.dialogTitle = "Adicionar registro"
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.formEmployee.reset();
  }

  insertDone = (event: any, arg: any) => {
    this.zone.run(() => {
      const emp: Employee = arg;
      this.employees.push(emp);
    });
    this.messageService.add({ severity: 'success', summary: 'OK', detail: 'Adicionado com sucesso.', life: 3000 });
  }

  updateDone = (event: any, arg: any) => {
    this.zone.run(() => {
      this.getAll();
    });
    this.messageService.add({ severity: 'info', summary: 'OK', detail: 'Atualizado com sucesso.', life: 3000 });
  }

  removeDone = (event: any, arg: any) => {
    this.zone.run(() => {
      this.employees = this.employees.filter(item => item.id !== this.idRemove);
    });
    this.messageService.add({ severity: 'warn', summary: 'OK', detail: 'Removido com sucesso.', life: 3000 });
  }

  fetchDone = (event: any, arg: any) => {
    this.zone.run(() => {
      this.employees = JSON.parse(arg);
    });
  }

}
