import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router,private titleService:Title) { 
    this.titleService.setTitle("HR Application");
  }

  title = 'hr-management-app';
  
  HomeClick(){
    this.router.navigate(['Home']);
  }
}
