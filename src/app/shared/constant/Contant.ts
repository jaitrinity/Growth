export class Constant{

    // public static phpServiceURL = "/GrowthApp/";
    // public static phpServiceURL = "http://www.trinityapplab.co.in/GrowthApp/";

    // public static phpServiceURL = "/Mygrowth/";
    public static phpServiceURL = "http://mygrowthapp.aviom.co/Mygrowth/";
    // public static phpServiceURL = "http://3.108.72.146/Mygrowth/";
    
    public static SUCCESSFUL_STATUS_CODE = "200";
    public static NO_RECORDS_FOUND_CODE = "102001";
    public static MYGROWTH_PRIVATE_KEY = "MYGROWTHPRIVATEKEY";
    public static TOSTER_FADEOUT_TIME = 1000;
    public static ALERT_FADEOUT_TIME = 2000;
    
    public static returnServerErrorMessage(serviceName:string):string{
        return "Server error while invoking "+serviceName+ " service";
    }
    
}