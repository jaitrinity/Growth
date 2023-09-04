export class TrasanctionDetTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false
        },
        pager :{
          perPage : 10
        },
        columns: {
          srNumber: {
            title: 'SR No',
            // sort : false,
            width : '70px'
          },
          checkpoint: {
            title: 'Checkpoint',
            // sort : false,
          },
          value: {
            title: 'Value',
            // sort : false,
          }
        }
    }
}