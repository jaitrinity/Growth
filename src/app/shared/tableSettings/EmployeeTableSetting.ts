export class EmployeeTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'editrecord', title: 'Edit'},
            { name: 'activerecord', title: 'Activate' },
            { name: 'deactiverecord', title: 'Deactivate' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          empId: {
            title: 'Emp Id',
            width : "90px",
          },
          empName: {
            title: 'Emp name'
          },
          doj:{
            title: 'DOJ'
          },
          emailId: {
            title: 'Email Id',
            width : "200px",
          },
          mobile: {
            title: 'Mobile'
          },
          roleName: {
            title: 'Role'
          },
          // branchName: {
          //   title: 'Branch'
          // },
          active: {
            title: 'Active',
            width : "90px",
          }
        }
    }
}