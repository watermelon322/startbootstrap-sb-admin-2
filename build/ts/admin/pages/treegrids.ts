/// <reference path="../module.ts"/>

namespace WM.Admin {
    export class TreegridsPage extends ModulePage {

        constructor() {
            super();
            let data = JSON.parse(
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

            let $table = $('#bootstrapTable');
            $table.bootstrapTable({
                data: data,
                idField: 'id',
                columns: [
                    {
                        field: 'id',
                        title: 'ID'
                    },
                    {
                        field: 'id',
                        title: '父ID'
                    },
                    {
                        field: 'name',
                        title: '名称'
                    },
                    {
                        field: 'status',
                        title: '状态',
                        formatter: function (value: any, row: any, index: any, filed: any) {
                            if (value == 0)
                                return '<a href="javascript:void(0);" class="btn btn-danger btn-sm" role="button">禁用</a>';
                            else
                                return '<a href="javascript:void(0);" class="btn btn-success btn-sm" role="button">启用</a>';
                        }
                    }],
                treeShowField: 'name',
                parentIdField: 'pid',
                onLoadSuccess: function () {
                    console.log('load');
                    (<any>$table).treegrid({
                        treeColumn: 1,
                        onChange: function () {
                            $table.bootstrapTable('resetWidth');
                        }
                    });
                }
            });
            (<any>$table).treegrid({
                initialState: 'collapsed',
                treeColumn: 2,
                expanderExpandedClass: 'glyphicon glyphicon-minus',
                expanderCollapsedClass: 'glyphicon glyphicon-plus',
                onChange: function () {
                    // $table.bootstrapTable('resetWidth');
                }
            });
        }

        public refresh(): void {
            window.location.reload();
        }
    }

    ModuleFactory = function () { return new TreegridsPage(); }
}