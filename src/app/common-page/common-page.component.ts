import { Component, OnInit, Inject } from '@angular/core';
import { TrasanctionHdrTableSetting } from '../shared/tableSettings/TrasanctionHdrTableSetting';
import { TrasanctionDetTableSetting } from '../shared/tableSettings/TrasanctionDetTableSetting';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared/service/SharedService';
import { ToastrService } from 'ngx-toastr';
import { Constant } from '../shared/constant/Contant';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutComponent } from '../layout/layout.component';
import * as alasql from 'alasql';
import { CommonFunction } from '../shared/service/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-common-page',
  templateUrl: './common-page.component.html',
  styleUrls: ['./common-page.component.css']
})
export class CommonPageComponent implements OnInit {
  filterStartDate = "";
  filterEndDate = "";
  categoryName = "";
  menuId = "";
  transactionHdrList = [];
  multiSelectdropdownSettings = {};
  singleSelectdropdownSettings = {};
  blankTableSettings :any = {};
  newSetting = TrasanctionHdrTableSetting.setting;
  transactionHdrSettings;
  loginEmpId : any = "";
  loginEmpRoleId : any = "";
  button = "";
  color1 = "";
  color2 = "";
  remark = "";
  columnKeyArr = [];
  columnTitleArr = [];
  formatLabel(value: number) {
    return value;
  }
  
  constructor(private route: ActivatedRoute,private router : Router,
    private sharedService : SharedService, private layoutComponent : LayoutComponent,
    private toastr: ToastrService,
    public dialog: MatDialog) {
      this.loginEmpId = localStorage.getItem("loginEmpId");
      this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
    }
    

  ngOnInit() {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
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
      $("ng2-smart-table thead, .myTable thead").css('background-color',this.color1);
    }, 100);

    this.route.paramMap.subscribe(params => {
      this.newSetting.columns = Object.assign({}, this.blankTableSettings);
      this.filterStartDate = "";
      this.filterEndDate = "";
      this.transactionHdrList = [];
      this.menuId = params.get('menuId');
      this.categoryName = localStorage.getItem(this.menuId);
      this.layoutComponent.setPageTitle(this.categoryName);
      this.getDynamicColumn();
      this.getMenuTrasactions(1)
    });
  }

  getDynamicColumn(){
    let dynCol = [];
    this.columnKeyArr = [];
    this.columnTitleArr = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      menuId : this.menuId
    }
    this.sharedService.getAllListBySelectType(jsonData,"dynamicColumn")
    .subscribe((response) =>{
      dynCol = response.dynamicColumn;
      if(dynCol.length == 0){
        dynCol = [
          {columnKey : "transactionId",columnTitle:"Activity Id",columnWidth:"85px"},
          {columnKey : "fillingBy",columnTitle:"Employee Name",columnWidth:"85px"},
          {columnKey : "dateTime",columnTitle:"Date",columnWidth:"85px"},
        ];
      }
      for(let i=0;i<dynCol.length;i++){
        this.newSetting.columns[dynCol[i].columnKey] = {title:dynCol[i].columnTitle,width:dynCol[i].columnWidth};
        this.columnKeyArr.push(dynCol[i].columnKey);
        this.columnTitleArr.push(dynCol[i].columnTitle);
      }
      this.transactionHdrSettings = Object.assign({}, this.newSetting);
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getDynamicColumn"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
    
  }

  getMenuTrasactions(type : any){
    this.transactionHdrList = [];
    if(type == 1)
      this.layoutComponent.ShowLoading = true;
    let json = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId,
      menuId : this.menuId,
      filterStartDate : this.filterStartDate,
      filterEndDate : this.filterEndDate
    }
    this.sharedService.getMenuTrasactions(json)
    .subscribe((response) =>{
     
      this.transactionHdrList = response.wrappedList;
      if(this.transactionHdrList.length == 0){
        this.toastr.info("No record found","Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      }
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getMenuTrasactions"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  transactionId : any = "";
  viewMenuId : any = "";
  viewStatus : any = "";
  viewRemark : any = "";
  transactionDetList = [];
  viewDetails(event){
    this.transactionDetList = [];
    this.transactionId = event.data.transactionId;
    this.viewMenuId = event.data.menuId;
    this.viewStatus = event.data.status;
    this.viewRemark = event.data.remark;
    let jsonData = {
      loginEmpId : this.loginEmpId,
      menuId : this.viewMenuId,
      transactionId : this.transactionId,
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getMenuTrasactionsDet(jsonData)
    .subscribe((response) =>{
      this.transactionDetList = response.wrappedList[0].transactionDetList; 
      this.viewActionButton();

      $("#viewDetailsModal").modal({
        backdrop : 'static',
        keyboard : false
      });
      setTimeout(() => {
        $("ng2-smart-table thead, .myTable thead").css('background-color',this.color1);
      }, 100);
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("transactionDetList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  actionButtonArr = [];
  viewActionButton() : void{
    this.remark = "";
    this.actionButtonArr = [];
    // HR Head(8), Complaint Head(9), Referral Head(10), Sales Head(11)
    if(!(this.loginEmpRoleId == 8 || this.loginEmpRoleId == 9 || this.loginEmpRoleId == 10 || 
      this.loginEmpRoleId == 11)){
        return;
    }
    if(this.menuId == "2"){
      let actArr = [{
        action: 'Approved',
        button: 'Approve'
      },{
        action: 'Rejected',
        button: 'Reject'
      }];
      this.actionButtonArr = actArr;
    }
    else if(this.menuId == "3"){
      let actArr = [{
        action: 'Resolved',
        button: 'Resolve'
      },{
        action: 'Rejected',
        button: 'Reject'
      }];
      this.actionButtonArr = actArr;
    }
    else if(this.menuId == "6"){
      let actArr = [{
        action: 'Selected',
        button: 'Selected'
      },{
        action: 'Rejected',
        button: 'Rejected'
      }];
      this.actionButtonArr = actArr;
    }
  }

  changeTransactionStatus(status) : void{
    if(this.remark == ""){
      alert("Enter remark");
      return;
    }
    let jsonData = {
      transactionId: this.transactionId,
      menuId: this.menuId,
      viewMenuId: this.viewMenuId,
      remark: this.remark,
      status: status
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.actionOnDataByUpdateType(jsonData,"changeTransactionStatus")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.getMenuTrasactions(1);
          this.closeAnyModal("viewDetailsModal");
        }
        this.toastr.success(result.responseDesc,"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("changeTransactionStatus"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      }
    )
  }
  
  innerHTMLTxt = "";
  openMedia(media, typeId){
    // window.open(v);

    var myWindow = window.open("", "_blank", "fullscreen=yes");
    if(media.indexOf(".png") > -1 || media.indexOf(".jpg") > -1){
      this.innerHTMLTxt = "<div style='background-color:#aaa4a4;display:flex'>"+
      "<div style='width:30%'></div>"+
      "<div><img src='"+media+"' style='width:100%; height:100%' /></div>"+
      "<div style='width:30%'></div>"+
      "</div>";
      myWindow.document.write(this.innerHTMLTxt);
    }
    else if(media.indexOf(".mp4") > -1){
      this.innerHTMLTxt = "<video controls>"+
                            "<source src='"+media+"'>"+
                          "</video>";
      myWindow.document.write(this.innerHTMLTxt);
    }
    else{
      this.innerHTMLTxt = "<object data='"+media+"' width='100%' height='100%'></object>";
      myWindow.document.write(this.innerHTMLTxt);
    } 
    // #####################################################
    // if(typeId == 7){
    //   this.innerHTMLTxt = "<div style='display:flex'>"+
    //   "<div style='width:30%'></div>"+
    //   "<div><img src='"+media+"' width='100%' height='100%' /></div>"+
    //   "<div style='width:30%'></div>"+
    //   "</div>";
    //   myWindow.document.write(this.innerHTMLTxt);
    // }
    // else if(typeId == 8){
    //     this.innerHTMLTxt = "<video controls>"+
    //                           "<source src='"+media+"'>"+
    //                         "</video>";
    //     myWindow.document.write(this.innerHTMLTxt);
    // }
    // else{
    //   if(media.indexOf(".png") > -1 || media.indexOf(".jpg") > -1){
    //     this.innerHTMLTxt = "<div style='display:flex'>"+
    //     "<div style='width:30%'></div>"+
    //     "<div><img src='"+media+"' width='100%' height='100%' /></div>"+
    //     "<div style='width:30%'></div>"+
    //     "</div>";
    //     myWindow.document.write(this.innerHTMLTxt);
    //   }
    //   else if(media.indexOf(".mp4") > -1){
    //     this.innerHTMLTxt = "<video controls>"+
    //                           "<source src='"+media+"'>"+
    //                         "</video>";
    //     myWindow.document.write(this.innerHTMLTxt);
    //   }
    //   else{
    //     this.innerHTMLTxt = "<object data='"+media+"' width='100%' height='100%'></object>";
    //     myWindow.document.write(this.innerHTMLTxt);
    //   }   
    // }
    // #####################################################
    // if(typeId == 7){
    //   this.innerHTMLTxt = "<img src='"+v+"' width='100%' height='100%'/>";
    //   $("#showImgModal").modal({
    //     backdrop : 'static',
    //     keyboard : false
    //   });
    // }
    // else if(typeId == 8){
    //   this.innerHTMLTxt = "<video width='100%' height='100%' controls>"+
    //                           "<source src='"+v+"'>"+
    //                         "</video>";
    //   $("#showImgModal").modal({
    //     backdrop : 'static',
    //     keyboard : false
    //   });
    // }
    // else{
    //   var myWindow = window.open("", "MsgWindow", "fullscreen=yes");
    //   this.innerHTMLTxt = "<object data='"+v+"' width='100%' height='100%'></object>";
    //   myWindow.document.write(this.innerHTMLTxt);
    // }

    
  }

  exportData(){
    if(this.transactionHdrList.length != 0){
      CommonFunction.downloadFile(this.transactionHdrList,
        this.categoryName+'_Report.csv', 
        this.columnKeyArr, 
        this.columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  closeAnyModal(modlalName : string){
    $("#"+modlalName).modal("hide");
  }
}