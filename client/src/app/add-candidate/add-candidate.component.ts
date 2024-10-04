import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WebApiService } from '../web-api.service';

@Component({
  selector: 'app-add-candidate',
  //standalone: true,
  //imports: [],
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})

export class AddCandidateComponent implements OnInit{
  addEmployeeForm: employeeForm = new employeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;

  constructor(private router: Router,private apiService: WebApiService) { }

  ngOnInit(): void {
  }
  onFileChange(event: any) {
    this.addEmployeeForm.resumeFile = event.target.files[0];
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.addEmployeeForm.resumeFile = fileList[0];
    } else {
      this.addEmployeeForm.resumeFile = null;
    }
  }

  AddCandidate(isValid: any)
  {
    this.isSubmitted = true;
    if (isValid && this.addEmployeeForm.resumeFile != null) {
      this.apiService.saveCandidate(this.addEmployeeForm,this.addEmployeeForm.resumeFile).then(response => {
        console.log('Employee data submitted successfully:', response);
        setTimeout(() => {
          this.router.navigate(['/Home']);
        }, 500);
    })
    .catch(error => {
      console.error('Error submitting employee data:', error);
      setTimeout(() => {
                   this.router.navigate(['/Home']);
                 }, 500);
    });
    }
  }
}

export class employeeForm {
  FirstName: string = "";
  LastName: string = "";
  Email: string = "";
  PanNo: string = "";
  DOB: Date | undefined;
  Address: string = "";
  Phone: string = "";
  IsApproved: boolean | null = null;
  resumeFile: File | null = null;
}
