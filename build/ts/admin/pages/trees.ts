/// <reference path="../module.ts"/>

namespace WM.Admin {
    export class TreesPage extends ModulePage {

        constructor() {
            super();
            let setting = {
                view: {
                    addHoverDom: false,
                    removeHoverDom: false,
                    selectedMulti: false
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: true
                }
            };
            let zNodes = [
                { id: 1, pId: 0, name: "[core] 基本功能 演示", open: true },
                { id: 101, pId: 1, name: "最简单的树 --  标准 JSON 数据" },
                { id: 102, pId: 1, name: "最简单的树 --  简单 JSON 数据" },
                { id: 103, pId: 1, name: "不显示 连接线" },
                { id: 104, pId: 1, name: "不显示 节点 图标" },
                { id: 108, pId: 1, name: "异步加载 节点数据" },
                { id: 109, pId: 1, name: "用 zTree 方法 异步加载 节点数据" },
                { id: 110, pId: 1, name: "用 zTree 方法 更新 节点数据" },
                { id: 111, pId: 1, name: "单击 节点 控制" },
                { id: 112, pId: 1, name: "展开 / 折叠 父节点 控制" },
                { id: 113, pId: 1, name: "根据 参数 查找 节点" },
                { id: 114, pId: 1, name: "其他 鼠标 事件监听" },
                { id: 2, pId: 0, name: "[excheck] 复/单选框功能 演示", open: false },
                { id: 201, pId: 2, name: "Checkbox 勾选操作" },
                { id: 206, pId: 2, name: "Checkbox nocheck 演示" },
                { id: 211, pId: 2, name: "Radio halfCheck 演示" },
                { id: 205, pId: 2, name: "用 zTree 方法 勾选 Radio" },
                { id: 3, pId: 0, name: "[exedit] 编辑功能 演示", open: false },
                { id: 301, pId: 3, name: "拖拽 节点 基本控制" },
                { id: 302, pId: 3, name: "拖拽 节点 高级控制" },
                { id: 304, pId: 3, name: "基本 增 / 删 / 改 节点" },
                { id: 305, pId: 3, name: "高级 增 / 删 / 改 节点" },
                { id: 307, pId: 3, name: "异步加载 & 编辑功能 共存" },
                { id: 308, pId: 3, name: "多棵树之间 的 数据交互" },
                { id: 4, pId: 0, name: "大数据量 演示", open: false },
                { id: 401, pId: 4, name: "一次性加载大数据量" },
                { id: 402, pId: 4, name: "分批异步加载大数据量" },
                { id: 403, pId: 4, name: "分批异步加载大数据量" },
            ];
            (<any>$).fn.zTree.init($("#ztree"), setting, zNodes);
        }

        public refresh(): void {
            window.location.reload();
        }
    }

    ModuleFactory = function () { return new TreesPage(); }
}