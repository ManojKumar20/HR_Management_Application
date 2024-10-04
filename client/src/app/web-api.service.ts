import { Injectable } from '@angular/core';
import axios from 'axios';
import { Candidate } from './candidate';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  constructor(private toastr: ToastrService) { }

  private apiGetUrl = '/server/hr_management_function/all';
  //private apiPostUrl = '/server/hr_management_function/submit-employee';
  //private apiUpdateUrl = '/server/hr_management_function/update-status';
  private apiPostUrl = '/server/hr_management_function/submitCandidate';
  private apiUpdateUrl = '/server/hr_management_function/UpdateStatus';


  getCandidateDetails(): Promise<Candidate[]> {
    return axios.get(this.apiGetUrl)
    .then(response => {
      return response.data.data.values.map((data: any) => {
        return new Candidate(
          data.candidateId,
          data.firstName,
          data.lastName,
          data.email,
          data.dob,
          data.panNo,
          data.phone,
          data.address,
          data.status,
          data.resumeId
        );
      });
    });
  }


  approveCandidate(candidateId : bigint,status: boolean, email: string, firstName: string) {
    const body = { candidateId, status, email, firstName };

    return axios.post(this.apiUpdateUrl, body)
      .then(response => {
        console.log('Success:', response.data);
        this.toastr.success('Candidate Approved and Mail sent successfully!', 'Success');
        return response.data;
      })
      .catch(error => {
        console.error('Error:', error);
        this.toastr.error("Error Occurred. Try Again...", 'Error');
        throw error;  
      });
  }

  rejectCandidate(candidateId : bigint,status: boolean) {
    const body = { candidateId, status };

    return axios.post(this.apiUpdateUrl, body)
      .then(response => {
        console.log('Success:', response.data);
        this.toastr.success('Candidate has been rejected', 'Success');
        return response.data;
      })
      .catch(error => {
        console.error('Error:', error);
        this.toastr.error("Error Occurred. Try Again...", 'Error');
        throw error; 
      });
  }

  async downloadResume(fileId: bigint): Promise<Blob> {
    const apiDownloadUrl = `/server/hr_management_function/download/${fileId}`;
    try {
      const response = await axios.get(apiDownloadUrl, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error downloading resume', error);
      throw error;
    }
  }

  saveCandidate(candidateData :any, resume : File)
  {
    const formData = new FormData();
    formData.append('FirstName', candidateData.FirstName);
    formData.append('LastName', candidateData.LastName);
    formData.append('Email', candidateData.Email);
    formData.append('DOB', candidateData.DOB);
    formData.append('PanNo', candidateData.PanNo);
    formData.append('Phone', candidateData.Phone);
    formData.append('Address', candidateData.Address);
    formData.append('Status', candidateData.IsApproved);
    formData.append('Resume', resume);

    return axios.post(this.apiPostUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Success:', response.data);
        this.toastr.success('Candidate data submitted successfully!', 'Success');
        return response.data;
      })
      .catch(error => {
        console.error('Error:', error);
        this.toastr.error(error.response.data.message, 'Error');
        throw error;
      });
  }
}
  
