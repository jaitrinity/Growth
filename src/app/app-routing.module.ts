import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CommonPageComponent } from './common-page/common-page.component';
import { EmployeeComponent } from './employee/employee.component';
import { LocationComponent } from './location/location.component';
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { ReportsComponent } from './reports/reports.component';
import { GrowthPlanComponent } from './growth-plan/growth-plan.component';
import { IncentivesComponent } from './incentives/incentives.component';
import { NotificationComponent } from './notification/notification.component';


const routes: Routes = [
  {path : '' ,  redirectTo: '/login', pathMatch: 'full'},
  {path : 'login', component :LoginComponent},
  {path : 'layout', component :LayoutComponent,  canActivate: [AuthGuard],
  children: [
    {path: '', redirectTo: 'm1', pathMatch: 'full'},
    { path: 'menu/:menuId', component: CommonPageComponent },
    { path: 'm1', component: EmployeeComponent },
    { path: 'm2', component: LocationComponent },
    { path: 'm11', component: ReportsComponent },
    { path: 'growth-plan', component: GrowthPlanComponent },
    { path: 'incentives', component: IncentivesComponent },
    { path: 'notification', component: NotificationComponent },
    { path: '**', component: WorkInProgressComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
