/// <reference path="../module.ts"/>

namespace WM.Admin {
    export class DashboardPage extends ModulePage {

        public refresh(): void {
            alert('DashboardPage Refresh');
        }
    }

    ModuleFactory = function () { return new DashboardPage(); }
}