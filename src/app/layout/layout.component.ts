import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { SharedService } from '../shared/service/SharedService';
import { Constant } from '../shared/constant/Contant';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('100ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('100ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class LayoutComponent implements OnInit {
  //Toogle Variable for the sidenav.
  ToggleVariable = true;
  //Toogle variable for searchbar.
  ToggledSearch = false;

  ShowLoading = false;
  loginEmpId : string = "";
  loginEmpName : string;
  loginEmpRoleId : string;
  public menuList = [];
  constructor(private router : Router,private sharedService : SharedService,
    private titleService : Title) { 
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpName = localStorage.getItem("loginEmpName");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
  }

  ngOnInit(): void {
    this.loadMenuList();
    setTimeout(() => {
      if(this.loginEmpRoleId != '1'){
        let firstMenuId = localStorage.getItem("firstMenuId");
        this.router.navigate(['/layout/menu/'+firstMenuId]);
      }
    }, 100);
  }

  setPageTitle(pageTitle : string){
    this.titleService.setTitle("Growth | "+pageTitle);
  }

  Logout() {
    let isConfirm = confirm("Do you want to logout ?");
    if(isConfirm){
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  loadMenuList(){
    var jsonStr = {
      loginEmpId:this.loginEmpId,
      loginEmpRoleId:this.loginEmpRoleId
    }
    //console.log(jsonStr);
    this.menuList = [];
    this.sharedService.getMenuListByRoleName(jsonStr)
    .subscribe( (response) =>{
      // console.log(response);
        if(response.code === 200){
          this.menuList = response.menuList;
          for(let i=0;i<this.menuList.length;i++){
            let catId = this.menuList[i].menuId;
            let catName = this.menuList[i].name;
            if(i==0){
              localStorage.setItem("firstMenuId",catId);
            }
            localStorage.setItem(catId,catName);
          }
        }
        else{
         
        }
  },
    (error)=>{
      
    })

  }

}
