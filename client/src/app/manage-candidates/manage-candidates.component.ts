import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../web-api.service';
import { Candidate } from '../candidate';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-candidates',
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.scss']
})
export class ManageCandidatesComponent implements OnInit {

  candidates: Candidate[] = [];
  page: number = 1;

  constructor(private apiService: WebApiService, private router: Router) {}

  ngOnInit(): void {
    
    this.apiService.getCandidateDetails().then(data => {
      this.candidates = data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  approveCandidate(candidate: any) {
    console.log('approve')
    this.apiService.approveCandidate(candidate.candidateId,true,candidate.email,candidate.firstName).then(response => {
      console.log('Employee data submitted successfully:', response);
      setTimeout(() => {
        this.router.navigateByUrl('/Home', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/HrView']);
        });
      }, 500);
  })
  .catch(error => {
    console.error('Error submitting employee data:', error);
    setTimeout(() => {
      this.router.navigateByUrl('/Home', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/HrView']);
      });
               }, 500);
  });
  }

  rejectCandidate(candidate: any) {
    console.log('reject')
    this.apiService.rejectCandidate(candidate.candidateId,false).then(response => {
      console.log('Employee data submitted successfully:', response);
      setTimeout(() => {
        this.router.navigateByUrl('/Home', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/HrView']);
        });
      }, 500);
  })
  .catch(error => {
    console.error('Error submitting employee data:', error);
    setTimeout(() => {
      this.router.navigateByUrl('/Home', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/HrView']);
      });
               }, 500);
  });
  }

  async downloadResume(resumeId: bigint) {
    try {
      const fileBlob = await this.apiService.downloadResume(resumeId);
      const fileName = `Resume_${resumeId}.pdf`;
      saveAs(fileBlob, fileName);
    } catch (error) {
      console.error('Error downloading the resume', error);
    }
  }
}