import { Component, OnInit } from '@angular/core';
import { Constant } from '../shared/constant/Contant';
import { LocationTableSetting } from '../shared/tableSettings/LocationTableSetting';
import { SharedService } from '../shared/service/SharedService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { LayoutComponent } from '../layout/layout.component';
import * as alasql from 'alasql';
import { CommonFunction } from '../shared/service/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  alertFadeoutTime = 0;
  branchCode = "";
  branchName = "";
  branchAddress = "";
  
  locationList = [];
  stateList = [];
  selectedStateList = [];
  branchList = [];
  
  locationTableSettings = LocationTableSetting.setting;
  
  loginEmpId = "";
  button = "";
  color1 = "";
  color2 = "";

  multiSelectdropdownSettings = {};
  singleSelectdropdownSettings = {};
  constructor(private router: Router,private sharedService : SharedService,
    private toastr: ToastrService, private layoutComponent : LayoutComponent) { 
      this.loginEmpId = localStorage.getItem("loginEmpId");
      this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
      this.layoutComponent.setPageTitle("Branch");
    }

  ngOnInit() {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
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
    setTimeout(() => {
      $("ng2-smart-table thead").css('background-color',this.color1);
    }, 100);
    this.getStateList();
    this.getAllLocationList();
  }
  
  getStateList(){
    let jsonData = {
      loginEmpId : this.loginEmpId
    }
    this.sharedService.getAllListBySelectType(jsonData,"state")
    .subscribe((response) =>{
      this.stateList = response.state;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getStateList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  getAllLocationList(){
    this.branchList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData,"branch")
    .subscribe((response) =>{
      // console.log(response);
      this.branchList = response.branchList;
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllLocationList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  submitLocData(){
    if(this.branchCode == ""){
      this.toastr.warning("please enter branch code ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    
    else if(this.branchName == ""){
      this.toastr.warning("please enter branch name","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.selectedStateList.length == 0){
      this.toastr.warning("please select select a state","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.branchAddress == ""){
      this.toastr.warning("please enter address","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    let jsonData = {
      branchCode : this.branchCode,
      branchName : this.branchName,
      stateId : CommonFunction.createCommaSeprate(this.selectedStateList),
      address : this.branchAddress
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.submitDataByInsertType(jsonData,"branch")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultToField();
        this.getAllLocationList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submit location data"),"Alert !",{timeOut : this.alertFadeoutTime});
    });

  }



  setDefaultToField(){
    this.branchCode = "";
    this.branchName = "";
    this.selectedStateList = [];
    this.branchAddress = "";
  }

  onCustomAction(event) {
    switch ( event.action) {
      case 'editrecord':
        this.editLocation(event);
        break;
      case 'activerecord':
        this.actionOnBranch(event,1);
        break;
      case 'deactiverecord':
        this.actionOnBranch(event,0);
        break;
    } 
  }

  actionOnBranch(event,action){
    let actionType = action == 1 ? "Activate" : "Deactivate";
    let isConfirm = confirm("Do you want to "+actionType+" this?");
    if(isConfirm){
      let id = event.data.id;
      let jsonData = {
        "id" : id,
        "action" : action
      }
      this.layoutComponent.ShowLoading = true;
      this.sharedService.actionOnDataByUpdateType(jsonData,"branch")
      .subscribe((response) =>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.getAllLocationList();
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("actionOnBranch"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      });
    }
  }

  closeEditModal(){
    if(!this.isDoAnyChange){
      let isConfirm = confirm("Do you want to close?");
      if(isConfirm){
        $("#editLocationModal").modal("hide");
      }
    }
    else{
      $("#editLocationModal").modal("hide");
    }
  }

  isDoAnyChange : boolean = true;
  editableId = "";
  editableBranchCode = "";
  editableBranchName = "";
  editSelectedStateList = [];
  editableAddress = "";
  editLocation(event){
    this.isDoAnyChange = true;
    this.editableId = event.data.id;
    this.editableBranchCode = event.data.branchCode;
    this.editableBranchName = event.data.branchName;
    let stateId = event.data.stateId;
    let tempStateList = [];
    for(let i=0;i<this.stateList.length;i++){
      let stObj = this.stateList[i];
      if(stObj.paramCode == stateId){
        tempStateList.push(stObj);
      }
    }
    this.editSelectedStateList = tempStateList;
    this.editableAddress = event.data.address;


    $("#editLocationModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  editLocationData(){
    let jsonData = {
      id : this.editableId,
      branchCode : this.editableBranchCode,
      branchName : this.editableBranchName,
      stateId : CommonFunction.createCommaSeprate(this.editSelectedStateList),
      address : this.editableAddress,
    }
    // console.log(JSON.stringify(jsonData));
    
    this.layoutComponent.ShowLoading = true;
    this.sharedService.actionOnDataByUpdateType(jsonData,'updateLocation')
    .subscribe((response) =>{
      //console.log(response);
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultToField();
        this.getAllLocationList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submit location data"),"Alert !",{timeOut : this.alertFadeoutTime});
    });

    this.closeAnyModal("editLocationModal");
  }

  exportData(){
    if(this.branchList.length != 0){
      let sql = "SELECT branchCode as `Branch Code`, branchName as `Branch Name`, stateName as `State Name`, (case when address is null then '' else address end) as `Address`, isActive as `Active` ";
      sql += 'INTO XLSXML("Branch.xls",{headers:true}) FROM ?';
      alasql(sql,[this.branchList]);
    }
    else{
      alert("No data for export");
    }
  }

  openAnyModal(modalId){
    $("#"+modalId).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalId){
    $("#"+modalId).modal("hide");
  }


}
