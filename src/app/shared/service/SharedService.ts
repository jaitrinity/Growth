import { Injectable } from '@angular/core';
import { Http , RequestOptions , Response , Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Constant } from '../constant/Contant';

@Injectable()
export class SharedService{
    private phpServicePoint;
    constructor(private http:Http){
        this.phpServicePoint = Constant.phpServiceURL;
    }

    public authenticate(bodyString:any){
        return this.http.post(this.phpServicePoint+'portalAuthenticate.php',bodyString)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuListByRoleName(jsonData : any){
        return this.http.post(this.phpServicePoint+'getMenuList.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuTrasactions(jsonData : any){

        return this.http.post(this.phpServicePoint+'getMenuTrasactions.php',jsonData)
        .map((response:Response) => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuTrasactionsDet(jsonData : any){
        
        return this.http.post(this.phpServicePoint+'getMenuTrasactionsDet.php',jsonData)
        .map((response:Response) => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public changeTransactionStatus(jsonData : any){
        
        return this.http.post(this.phpServicePoint+'changeTransactionStatus.php',jsonData)
        .map((response:Response) => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getCategorySubcategoryByRole(jsonData:  any) {
        return this.http.post(this.phpServicePoint+'getCategorySubcategoryByRole.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public sendOTP(jsonData: any) {
               return this.http.post(this.phpServicePoint+'sendOTPtoMobile.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public changePassword(jsonData: any) {
        
        return this.http.post(this.phpServicePoint+'changePassword.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getAllList(searchType : string) {
        return this.http.get(this.phpServicePoint+'assignToEmp.php?searchType='+searchType)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public submitDataByInsertType(jsonData: any,insertType : string) {
        return this.http.post(this.phpServicePoint+'insertInTable.php?insertType='+insertType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public insertDataByInsertType(jsonData: any, insertType : string) {
        return this.http.post(this.phpServicePoint+'insertInTable.php?insertType='+insertType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getAllListBySelectType(jsonData: any, selectType : string) {
        return this.http.post(this.phpServicePoint+'getAllList.php?selectType='+selectType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public actionOnDataByUpdateType(jsonData: any,updateType : string) {
        return this.http.post(this.phpServicePoint+'updateInTable.php?updateType='+updateType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}