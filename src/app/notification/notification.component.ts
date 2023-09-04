import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/service/SharedService';
import { ToastrService } from 'ngx-toastr';
import { Constant } from '../shared/constant/Contant';
import { CommonFunction } from '../shared/service/CommonFunction';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  alertFadeoutTime = 0;
  branchList = [];
  loginEmpId = "";
  loginEmpRoleId = "";
  selectedBranchList = [];
  employeeList = [];
  title = "";
  notification = "";
  button = "";
  selectedEmployeeList = [];
  multiSelectdropdownSettings = {};
  constructor(private sharedService : SharedService,
    private toastr: ToastrService, private layoutComponent : LayoutComponent) { 
      this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
      this.loginEmpId = localStorage.getItem("loginEmpId");
      this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
      this.button = localStorage.getItem("button");
      this.layoutComponent.setPageTitle("Push Notification");
    }

  ngOnInit(): void {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.getAllList();
  }

  getAllList(){
    this.sharedService.getAllList('forNotification')
    .subscribe((response) =>{
      this.branchList = response.branchList;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllList"),"Alert !",{timeOut : this.alertFadeoutTime});
    });
  }

  onSelectOrDeselectBranch(item){
    // console.log(this.selectedBranchList);
    let branchCode = CommonFunction.createCommaSeprate(this.selectedBranchList);
    this.getEmpByBranchCode(branchCode);
  }
  onSelectAllOrDeselectAllBranch(item){
    this.selectedBranchList = item;
    let branchCode = CommonFunction.createCommaSeprate(this.selectedBranchList);
    this.getEmpByBranchCode(branchCode);
  }

  onSelectOrDeselectEmployee(item){

  }
  onSelectAllOrDeselectAllEmployee(item){
    this.selectedEmployeeList = item;
  }

  getEmpByBranchCode(brCode){
    if(brCode == ""){
      this.employeeList = [];
      this.selectedEmployeeList = [];
      return;
    }
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId,
      brCode: brCode
    }
    this.sharedService.getAllListBySelectType(jsonData, "empByBranch")
    .subscribe(
      (result)=>{
        this.employeeList = result;
        if(this.employeeList.length == 0){
          this.employeeList = [];
          this.selectedEmployeeList = [];
        }
        // console.log(result);
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("getEmpByBranchCode"),"Alert !",{timeOut : this.alertFadeoutTime});
      }
    )
  }
  // console.log(brCode)

  failResult = "";
  sendNotification(){
    if(this.selectedBranchList.length == 0){
      this.toastr.warning("Select one branch","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    if(this.selectedEmployeeList.length == 0){
      this.toastr.warning("Select one employee","Alert !",{timeOut : this.alertFadeoutTime});

    }
    else if(this.title == ""){
      this.toastr.warning("Enter title","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    else if(this.notification == ""){
      this.toastr.warning("Notification","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    this.failResult = "";
    let empMobile = CommonFunction.createCommaSeprate(this.selectedEmployeeList);
    // console.log(empMobile)
    let jsonData = {
      mobile: empMobile,
      title: this.title,
      notification: this.notification
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData,"pushNotification")
    .subscribe(
      (response)=>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.setDefaultAllField();
        }
        else{
          let fail = response.failResult;
          for(let i=0;i<fail.length;i++){
            let mobile = fail[i];
            let obj = this.selectedEmployeeList.filter(x => x.paramCode == mobile)[0];
            if(this.failResult == ""){
              this.failResult += obj["paramDesc"];
            }
            else{
              this.failResult += ", "+obj["paramDesc"];
            }
            
          }
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("sendNotification"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      }
    )
  }

  setDefaultAllField(){
    this.selectedBranchList = [];
    this.employeeList = [];
    this.selectedEmployeeList = [];
    this.title = "";
    this.notification = "";
  }

}
