namespace WM.Admin {
    export class FrameworkPage implements IFrameworkPage {
        private _modules: Array<ModulePageProxy>;
        public get Modules(): Array<ModulePageProxy> {
            return this._modules;
        }

        constructor() {
            this._modules = new Array<ModulePageProxy>();
        }

        public logout(): void {
            ($('#logoutModal') as any).modal();
        }
    }

    class ModulePageProxy extends Proxy.Proxy<IModulePage> implements IModulePage {
        public get Framework(): IFrameworkPage {
            return this.Real.get('FrameworkPage');
        }

        constructor(instance: IModulePage) {
            super(instance);
        }
    }
    export var Framework: FrameworkPage;
}

(function ($) {
    $(function () {
        WM.Admin.Framework = new WM.Admin.FrameworkPage();

        let Selector = {
            'content': '#content',
            'navbar': '#content > .navbar',
            'pagebar': '#content > .pagebar',
            'pagefrm': '#content > .pagefrm'
        };

        function fixPagefrm() {

            let navbarHeight = $(Selector.navbar).outerHeight(true) as number;
            let pagebarHeight = $(Selector.pagebar).outerHeight(true) as number;
            let contentHeight = $(Selector.content).height() as number;
            $(Selector.pagefrm).height(contentHeight - navbarHeight - pagebarHeight);
        }

        // Toggle the side navigation
        $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
            $("body").toggleClass("sidebar-toggled");
            $(".sidebar").toggleClass("toggled");
            if ($(".sidebar").hasClass("toggled")) {
                ($('.sidebar .collapse') as any).collapse('hide');
            }
        });

        // Close any open menu accordions when window is resized below 768px
        $(window).resize(function () {
            if ($(window).width() as number < 768) {
                ($('.sidebar .collapse') as any).collapse('hide');
            }

            fixPagefrm();
        });

        fixPagefrm();
    });
})(jQuery); // End of use strict
