import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SharedService } from './shared/service/SharedService';
import { AuthGuard } from './shared/guard/auth.guard';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { LayoutComponent } from './layout/layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatRippleModule} from '@angular/material/core';
import { CommonPageComponent } from './common-page/common-page.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OnlyNumber } from './shared/validations/OnlyNumber';
import { LengthValidater } from './shared/validations/LengthValidater';
import { EmployeeComponent } from './employee/employee.component';
import { LocationComponent } from './location/location.component';
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { ReportsComponent } from './reports/reports.component';
import { ChartsModule } from 'ng2-charts';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { GrowthPlanComponent } from './growth-plan/growth-plan.component';
import { IncentivesComponent } from './incentives/incentives.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    CommonPageComponent,
    OnlyNumber,
    LengthValidater,
    EmployeeComponent,
    LocationComponent,
    WorkInProgressComponent,
    ReportsComponent,
    AccessDeniedComponent,
    GrowthPlanComponent,
    IncentivesComponent,
    SafeHtmlPipe,
    NotificationComponent,
  ],
  imports: [
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRippleModule,
    MatSliderModule,
    MatProgressBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTabsModule,
    ChartsModule,
    MatMenuModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCBRHoDj-z_mh59rKgkXo6_P9eU2KOGoeM' 
    })
  ],
  providers: [AuthGuard,SharedService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
