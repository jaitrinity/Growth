import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';
import * as alasql from 'alasql';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  monthList = [];
  selectedMonthList = [];
  monthYear = "";
  fromDate = "";
  toDate = "";
  currentYear = "";
  alertFadeoutTime = 0;
  loginEmpId = "";
  button = "";
  color1 = "";
  color2 = "";
  singleSelectdropdownSettings = {};
  constructor(private datePipe : DatePipe,private sharedService : SharedService, 
    private toastr: ToastrService,
    private layoutComponent : LayoutComponent) { 
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.button = localStorage.getItem("button");
    this.color1 = localStorage.getItem("color1");
    this.color2 = localStorage.getItem("color2");
    this.layoutComponent.setPageTitle("Report");
  }

  ngOnInit(): void {
    this.singleSelectdropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection : true
    };

    this.currentYear = this.datePipe.transform(new Date(),'yyyy');
    let previousYear = parseInt(this.currentYear) - 1;
    let nextYear = parseInt(this.currentYear) + 1;
   
    this.monthList  = [
      {"paramCode" : "4-"+this.currentYear,"paramDesc":"Apr-"+this.currentYear},
      {"paramCode" : "5-"+this.currentYear,"paramDesc":"May-"+this.currentYear},
      {"paramCode" : "6-"+this.currentYear,"paramDesc":"Jun-"+this.currentYear},
      {"paramCode" : "7-"+this.currentYear,"paramDesc":"Jul-"+this.currentYear},
      {"paramCode" : "8-"+this.currentYear,"paramDesc":"Aug-"+this.currentYear},
      {"paramCode" : "9-"+this.currentYear,"paramDesc":"Sep-"+this.currentYear},
      {"paramCode" : "10-"+this.currentYear,"paramDesc":"Oct-"+this.currentYear},
      {"paramCode" : "11-"+this.currentYear,"paramDesc":"Nov-"+this.currentYear},
      {"paramCode" : "12-"+this.currentYear,"paramDesc":"Dec-"+this.currentYear},
      {"paramCode" : "1-"+nextYear,"paramDesc":"Jan-"+nextYear},
      {"paramCode" : "2-"+nextYear,"paramDesc":"Feb-"+nextYear},
      {"paramCode" : "3-"+nextYear,"paramDesc":"Mar-"+nextYear}
    ]
    // console.log(this.monthList)
  }

  // downloadReport(reportType : number){
  //   var time = new Date();
  //   let millisecond = Math.round(time.getTime()/1000);
      
  //   let jsonData = {
  //     loginEmpId : this.loginEmpId,
  //     loginEmpRole : this.loginEmpRole,
  //     monthYear : this.monthYear,
  //     fromDate : this.fromDate,
  //     toDate : this.toDate,
  //     reportType : reportType,
  //     millisecond : millisecond
  //   }
  //   window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));
  // }

  downloadReport(reportType : number){
    this.layoutComponent.ShowLoading = true;
    let jsonData = {
      loginEmpId : this.loginEmpId,
      monthYear : this.monthYear,
      fromDate : this.fromDate,
      toDate : this.toDate,
      reportType : reportType
    }
    this.sharedService.getAllListBySelectType(jsonData,'downloadReport')
    .subscribe(
      (result)=>{
        let fileName = reportType == 1 ? "Shakti_Enrolment_Report" : "Shakti_n_Sathi_Report";
        let exportData = result.exportData;
        let sql = "SELECT * ";
        sql += "INTO XLSXML('"+fileName+".xls',{headers:true}) FROM ?";
        alasql(sql,[exportData]);
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("downloadReport"),"Alert",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      }
    );
  }

}
