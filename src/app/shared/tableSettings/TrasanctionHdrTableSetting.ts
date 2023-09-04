export class TrasanctionHdrTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : true
        },
        pager :{
          perPage : 10
        },
        columns: {
          
        },
        delete: {
          deleteButtonContent: '<button>View</button>',
          mode: 'external'
        }
    }
}