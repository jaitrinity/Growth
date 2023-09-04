export class LocationTableSetting{
    public static setting = {
        mode: 'external',
        //hideHeader : true,
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'editrecord', title: 'Edit'},
            { name: 'activerecord', title: 'Active' },
            { name: 'deactiverecord', title: 'Deactive' },
          ],
          
        },
        pager :{
          perPage : 10
        },
        columns: {
          id: {
            title: 'id',
            // sort : false,
            width : '80px'
          },
          branchCode:{
            title : 'Branch Code',
            width : '100px'
          },
          branchName: {
            title: 'Branch Name',
          },
          stateName: {
            title: 'State Name',
          },
          address: {
            title: 'Address'
          },
          isActive: {
            title: 'Active',
            width : '80px'
          }
        }
    }
}