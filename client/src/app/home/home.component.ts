import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router) { }

  CandidateBtnClick(){
    this.router.navigate(['AddCandidate']);
  }

  HrBtnClick(){
    this.router.navigate(['HrView']);
  }
}
