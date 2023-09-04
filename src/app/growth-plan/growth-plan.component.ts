import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';
import { LayoutComponent } from '../layout/layout.component';
declare var $: any;

@Component({
  selector: 'app-growth-plan',
  templateUrl: './growth-plan.component.html',
  styleUrls: ['./growth-plan.component.scss']
})
export class GrowthPlanComponent implements OnInit {

  language = "";
  languageList = [];
  menuId = "";
  alertFadeoutTime = 0;
  pointSize = 0;
  fontList = [5,10,12,14,16,18,20,22,25,28,30,35];
  colorList = ['Red','Green','Yellow'];
  growthPlan = "point";
  loginEmpId = "";
  loginEmpRoleId = "";
  attachmentStr : any = "";
  button = "";
  color1 = "";
  color2 = "";
  constructor(private toastr: ToastrService, private sharedService : SharedService,
    private layoutComponent : LayoutComponent) { 
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button");
    this.color1 = localStorage.getItem("color1");
    this.color2 = localStorage.getItem("color2");
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.layoutComponent.setPageTitle("Growth Plan");
  }

  ngOnInit(): void {
    this.getLanguageList();
    this.addRemoveMore('+');
    this.getGrowthData();
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
  getGrowthData(){
    let jsonData = {
      menuId: this.menuId
    }
    this.sharedService.getAllListBySelectType(jsonData,"growthData")
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

  
  submitGrowth(){
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
    this.sharedService.insertDataByInsertType(jsonData, "growthBullet")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(result.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.pointList = [];
          this.pointSize = 1;
          this.createRange(this.pointSize);
          $(".setBlank").val("");
          this.getGrowthData();
        }
        else{
          this.toastr.warning(result.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
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

  uploadGrowthPoint(){
    if(this.language == ""){
      this.toastr.warning("please select a language","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    else if(this.attachmentStr == ""){
      this.toastr.warning("Select valid file","Alert !");
      return;
    }
    let jsonData = {
      type: "Growth",
      menuId: this.menuId,
      attachmentStr: this.attachmentStr
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "uploadGrowthPoint")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(result.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          $("#attachment").val("");
          this.attachmentStr = "";
          this.getGrowthData();
        }
        else{
          this.toastr.warning(result.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{

      }
    )

  }

  selectLanguage(evt){
    let selectedIndex:number = evt.target["selectedIndex"];
    this.menuId = evt.target.options[selectedIndex].getAttribute("menuId");
    // console.log(this.menuId);
    this.getGrowthData();
  }

}
