import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { HomeComponent } from './home/home.component';
import { ManageCandidatesComponent } from './manage-candidates/manage-candidates.component';

const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full'},
  { path: 'Home', component: HomeComponent},
  { path: 'AddCandidate', component: AddCandidateComponent},
  { path: 'HrView', component: ManageCandidatesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
