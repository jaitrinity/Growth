import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../shared/service/SharedService';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { DatePipe } from '@angular/common';
declare var $: any;
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.scss']
})
export class IncentivesComponent implements OnInit {
  languageList = [];
  language = "";
  menuId = "";
  currentDate: Date = new Date();
  monthYear = "";
  alertFadeoutTime = 0;
  pointSize = 0;
  fontList = [5,10,12,14,16,18,20,22,25,28,30,35];
  colorList = ['Red','Green','Yellow'];
  incentive = "point";
  loginEmpId = "";
  loginEmpRoleId = "";
  attachmentStr : any = "";
  button = "";
  color1 = "";
  color2 = "";

  constructor(private toastr: ToastrService, private sharedService : SharedService,
    private layoutComponent : LayoutComponent, private datePipe: DatePipe) { 
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button");
    this.color1 = localStorage.getItem("color1");
    this.color2 = localStorage.getItem("color2");
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.layoutComponent.setPageTitle("Incentives");
    this.monthYear = this.datePipe.transform(this.currentDate, 'MMM-y');
    // console.log(this.monthYear)
  }

  ngOnInit(): void {
    this.getLanguageList();
    this.addRemoveMore('+');
    this.getIncentiveData();
  }

  getLanguageList(){
    this.languageList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData, "language")
    .subscribe((response) =>{
      this.languageList = response.languageList;
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getLanguageList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  bulletPoint = "";
  type = ""; // 1 = point, 2 = URL
  getIncentiveData(){
    let jsonData = {
      menuId: this.menuId
    }
    this.sharedService.getAllListBySelectType(jsonData,"incentiveData")
    .subscribe(
      (result)=>{
        this.bulletPoint = result.bulletPoint;
        this.type = result.type;
      },
      (error)=>{
        
      }
    )
  }

  addRemoveMore(type:string){
    if(type == "+")
      this.pointSize++;
    else{
      if(this.pointSize > 1){
        this.pointSize--;
      }
    }
      
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  pointList = [];
  validateData(): any{
    this.pointList = [];
    for(let i=1;i<=this.pointSize;i++){
      let p = $("#point"+i).val();
      let fs = $("#fontSize"+i).val();
      let co = $("#color"+i).val();
      if(p != ""){
        if(fs == ""){
          this.toastr.warning("please select font size of "+i,"Alert !",{timeOut : this.alertFadeoutTime});
          return false;
        }
        else if(co == ""){
          this.toastr.warning("please select color of "+i,"Alert !",{timeOut : this.alertFadeoutTime});
          return false;
        }
        let json = {
          point: p,
          fontSize: fs,
          color: co
        }
        this.pointList.push(json);
      } 
    }
    return true;
  }

  
  submitIncentive(){
    if(this.language == ""){
      this.toastr.warning("please select a language","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    else if(!this.validateData()){
      return;
    }
    else if(this.pointList.length == 0){
      this.toastr.warning("please add a point","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    let jsonData = {
      loginEmpId: this.loginEmpId,
      menuId: this.menuId,
      pointList: this.pointList
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "incentiveBullet")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(result.responseDesc,"Alert !");
          this.pointList = [];
          this.pointSize = 1;
          this.createRange(this.pointSize);
          $(".setBlank").val("");
          this.getIncentiveData();
        }
        else{
          this.toastr.warning(result.responseDesc,"Alert !");
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{

      }
    )
  }

  changeListener($event, i): void {
    this.readThis($event.target, i);
  }
  readThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".pdf") > -1 || fileName.indexOf(".ppt") > -1)){
      this.toastr.warning("only .pdf, .ppt format accepted, please choose right file.","Alert !");
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if (optionNumber == 1) {
        this.attachmentStr = image;
        if(wrongFile){
          $("#attachment").val("");
          this.attachmentStr = "";
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  uploadIncentivePoint(){
    if(this.language == ""){
      this.toastr.warning("please select a language","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    else if(this.attachmentStr == ""){
      this.toastr.warning("Select valid file","Alert !");
      return;
    }
    let jsonData = {
      type: "Incentive",
      menuId: this.menuId,
      attachmentStr: this.attachmentStr
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "uploadIncentivePoint")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(result.responseDesc,"Alert !");
          $("#attachment").val("");
          this.attachmentStr = "";
          this.getIncentiveData();
        }
        else{
          this.toastr.warning(result.responseDesc,"Alert !");
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{

      }
    )
  }

  arrayBuffer : any;
  importData = [];
  fileName : any;
  selectExcel(event){
    var file : File = event.target.files[0];
    this.fileName = file.name;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = xlsx.read(bstr, {type:"binary",cellText:false,cellDates:true});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      
      this.importData = xlsx.utils.sheet_to_json(worksheet,{raw:false,dateNF: "dd-MMM-yy"});
    }
    fileReader.readAsArrayBuffer(file);
  }

  importIncentive(){
    if(this.importData.length == 0){
      this.toastr.warning("Select valid file","Alert !");
      return;
    }
    //if(this.fileName.indexOf(".csv") > -1){
      let tempArr = [];
      for(let i=0;i<this.importData.length;i++){
        let e = this.importData[i].EmpId;
        let m = this.importData[i].MonthYear;
        let mSplit = m.split("-");
        if(this.fileName.indexOf(".csv") > -1){
          // for .csv
          m = mSplit[1]+"-20"+mSplit[0];
        }
        else{
          // for else .csv
          m = mSplit[1]+"-20"+mSplit[2];
        }
          
        let ins = this.importData[i].Incentive;
        
        let list = {
          EmpId:e,
          MonthYear:m,
          Incentive:ins
        }
        tempArr.push(list)
      }
      this.importData = tempArr;
    //}
    // console.log(JSON.stringify(this.importData))
    let jsonData = {
      //menuId: this.menuId,
      monthYear:this.monthYear,
      importData: this.importData
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "importIncentive")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          $("#excelData").val("");
          this.toastr.success(result.responseDesc,"Alert !");
          this.importData = [];
        }
        else{
          this.toastr.warning(result.responseDesc,"Alert !");
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{

      }
    )
  }

  downloadReport(reportType : number){
    var time = new Date();
    let millisecond = Math.round(time.getTime()/1000);
   
    let jsonData = {
      loginEmpId : this.loginEmpId,
      reportType : reportType,
      millisecond : millisecond
    }
    window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));
  }

  selectLanguage(evt){
    let selectedIndex:number = evt.target["selectedIndex"];
    this.menuId = evt.target.options[selectedIndex].getAttribute("menuId");
    // console.log(this.menuId);
    this.getIncentiveData();
  }

}
