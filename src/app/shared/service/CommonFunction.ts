export class CommonFunction{
    public static createCommaSeprate(listData : any):string{
        let commSeprateValue = "";
        for(let i=0;i<listData.length;i++){
            commSeprateValue += listData[i].paramCode;
            if(i != listData.length-1){
            commSeprateValue += ",";
            }
        }
        return commSeprateValue;
    }

    public static createCommaSeprateByParamDesc(listData : any):string{
        let commSeprateValue = "";
        for(let i=0;i<listData.length;i++){
            commSeprateValue += listData[i].paramDesc;
            if(i != listData.length-1){
            commSeprateValue += ",";
            }
        }
        return commSeprateValue;
    }

    public static getBooleanValue(bolValue : boolean) : number{
        let v = 0;
        if(bolValue){
          v = 1;
        }
        return v;
    }

    public static prepareCommaSeprateValue(listData : any):string{
        let commSeprateValue = "";
        for(let i=0;i<listData.length;i++){
            commSeprateValue += listData[i];
            if(i != listData.length-1){
                commSeprateValue += ",";
            }
        }
        return commSeprateValue;
    }

    public static downloadFile(data, filename, columnKeyArr : any, columnTitleArr : any ) {
        let arrHeader = columnKeyArr;
        let csvData = this.convertToCSV(data, arrHeader, columnTitleArr);
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }

    private static convertToCSV(objArray, headerList, columnTitleArr : any) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        let row = '';
    
        let newHeaders = columnTitleArr;
    
        for (let index in newHeaders) {
          row += newHeaders[index] + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (let i = 0; i < array.length; i++) {
          let line = '';
          for (let index in headerList) {
            let head = headerList[index];
    
            line += this.strRep(array[i][head])+',';
          }
          str += line + '\r\n';
        }
        return str;
    }

    private static strRep(data) {
        if(typeof data == "string") {
          let newData = data.replace(/,/g, " ");
           return newData.trim();
        }
        else if(typeof data == "undefined") {
          return "-";
        }
        else if(typeof data == "number") {
          return  data.toString();
        }
        else {
          return data;
        }
    }
}