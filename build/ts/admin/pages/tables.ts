/// <reference path="../module.ts"/>

namespace WM.Admin {
    export class TablesPage extends ModulePage {

        constructor() {
            super();
            var data = JSON.parse(
                '[{"id":1,"pid":0,"status":1,"name":"用户管理","permissionValue":"open:user:manage"},' +
                '{"id":2,"pid":0,"status":1,"name":"系统管理","permissionValue":"open:system:manage"},' +
                '{"id":3,"pid":1,"status":1,"name":"新增用户","permissionValue":"open:user:add"},' +
                '{"id":4,"pid":1,"status":1,"name":"修改用户","permissionValue":"open:user:edit"},' +
                '{"id":5,"pid":1,"status":0,"name":"删除用户","permissionValue":"open:user:del"},' +
                '{"id":6,"pid":2,"status":1,"name":"系统配置管理","permissionValue":"open:systemconfig:manage"},' +
                '{"id":7,"pid":6,"status":1,"name":"新增配置","permissionValue":"open:systemconfig:add"},' +
                '{"id":8,"pid":6,"status":1,"name":"修改配置","permissionValue":"open:systemconfig:edit"},' +
                '{"id":9,"pid":6,"status":0,"name":"删除配置","permissionValue":"open:systemconfig:del"},' +
                '{"id":10,"pid":2,"status":1,"name":"系统日志管理","permissionValue":"open:log:manage"},' +
                '{"id":11,"pid":10,"status":1,"name":"新增日志","permissionValue":"open:log:add"},' +
                '{"id":12,"pid":10,"status":1,"name":"修改日志","permissionValue":"open:log:edit"},' +
                '{"id":13,"pid":10,"status":0,"name":"删除日志","permissionValue":"open:log:del"}]');

            $('#bootstrapTable').bootstrapTable({
                data: data,
                idField: 'id',
                columns: [
                    {
                        field: 'id',
                        title: 'ID'
                    },
                    {
                        field: 'name',
                        title: '名称'
                    }]
            });
            $('#datatables').DataTable({
                data: data,
                autoWidth: true,
                columns: [
                    {
                        title: 'ID',
                        data: 'id'
                    },
                    {
                        title: '父ID',
                        data: 'pid'
                    },
                    {
                        title: '名称',
                        data: 'name'
                    },
                    {
                        title: '状态',
                        data: 'status',
                        render: function (data, type, row, meta) {
                            return '<a href="' + data + '">Download</a>';
                        }
                    }
                ],
                pagingType: 'full_numbers',
                language: { url: '../../../../../js/datatables.zh-cn.json' }
            });
        }

        public refresh(): void {
            window.location.reload();
        }
    }

    ModuleFactory = function () { return new TablesPage(); }
}