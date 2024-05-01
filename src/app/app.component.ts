import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from './model/employee';
import { EmployeeService } from './service/employee.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  visible: boolean = false;
  idEditing: number = 0;
  formEmployee!: FormGroup;
  employees!: Employee[];
  dialogTitle!: string;

  constructor(private formBuilder: FormBuilder,
    private empService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getEmployeeList();
    const emp = new Employee();
    this.formEmployee = this.formBuilder.group({
      firstName: [emp.firstName],
      lastName: [emp.lastName],
      salary: [emp.salary]
    })
  }

  showDialog() {
    this.dialogTitle = "Adicionar registro"
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.formEmployee.reset();
  }

  getEmployeeList() {
    this.empService.getEmployeeList().subscribe({
      next: (res) => {
        console.log(res);
        this.employees = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    if (this.idEditing !== 0) {
      this.empService.updateEmployee(this.idEditing, this.formEmployee.value).subscribe({
        next: (val: any) => {
          console.log(val);
          this.formEmployee.reset();
          this.visible = false;
          this.idEditing = 0;
          this.getEmployeeList();
        },
        error: (err: any) => {
          console.error(err);
          alert("Error while adding the employee!");
        },
      });
    } else {
      this.empService.addEmployee(this.formEmployee.value).subscribe({
        next: (val: any) => {
          console.log(val);
          this.employees.push(val);
          this.formEmployee.reset();
          this.visible = false;
        },
        error: (err: any) => {
          console.error(err);
          alert("Error while adding the employee!");
        },
      });
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
    this.empService.deleteEmployee(employee.id).subscribe({
      next: (res) => {
        this.getEmployeeList();
      },
      error: (err) => {
        console.log(err);
      },
    });
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
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        this.visible = false;
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

}
