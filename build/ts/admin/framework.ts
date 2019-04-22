namespace WM.Admin {
    let Attributes = {
        'Trigger': 'wm-trigger'
    }
    let Selectors = {
        'Dialogs': {
            'Logout': '#wmd-logout'
        },
        'Sidebar': {
            'Left': {
                'Main': '#leftSideBar',
                'Logo': '#fixedLogo',
                'FixedMenus': '#fixedMenus',
                'ScrollMenus': '#scrollMenus'
            }
        },
        'Layout': {
            'Navbar': '#content > .navbar',
            'Content': '#content',
            'Pagebar': '#content > .pagebar',
            'Pagefrm': '#content > .pagefrm'
        },
        'Trigger': `[${Attributes.Trigger}]`
    };

    class FrameworkPageEventHandlers {
        private _framework: IFrameworkPage;
        public get Framework(): IFrameworkPage {
            return this._framework;
        }

        constructor(framework: IFrameworkPage) {
            this._framework = framework;
        }

        public onlogout(event: JQuery.Event): void {
            $(Selectors.Dialogs.Logout).modal();
        }
    }

    export class FrameworkPage implements IFrameworkPage {

        private _modules: Array<ModulePageProxy>;

        private _handlers: FrameworkPageEventHandlers;

        public get Modules(): Array<ModulePageProxy> {
            return this._modules;
        }

        constructor() {
            let framework = this;
            this._modules = new Array<ModulePageProxy>();
            this._handlers = new FrameworkPageEventHandlers(framework);

            $(Selectors.Trigger).each(function () {
                framework.bindTrigger($(this));
            });

            // Close any open menu accordions when window is resized below 768px
            $(window).resize(function () {
                if ($(window).width() as number < 768) {
                    $('.sidebar .collapse').collapse('hide');
                }

                framework.fixSize();
            });

            // Toggle the side navigation
            $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
                $("body").toggleClass("sidebar-toggled");
                $(".sidebar").toggleClass("toggled");
                if ($(".sidebar").hasClass("toggled")) {
                    $('.sidebar .collapse').collapse('hide');
                }
            });

            framework.fixSize();
        }

        public trigger(event: string | JQuery.Event, extraParameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            $(this._handlers).trigger(event, extraParameters);
        }

        private bindTrigger(elem: JQuery<HTMLElement>, trigger?: string, event?: string): void {
            if (trigger == undefined || trigger == '') {
                trigger = elem.attr(Attributes.Trigger);
            }
            trigger = $.trim(trigger || '');
            if (trigger == '' || trigger == ':') return;

            event = $.trim(event || '');
            if (trigger.indexOf(':') >= 0) {
                let temp = trigger.split(':', 2);
                trigger = temp[1] != '' ? temp[1] : temp[0];
                if (event == '')
                    event = temp[0] != '' ? temp[0] : temp[1];
            }

            elem.on(event, (e) => {
                delete e.type;
                this.trigger(new jQuery.Event(trigger as string, e));
            });
        }

        public logout(): void {
            this.trigger('logout', arguments);
        }

        private fixSize(): void {

            let navbarHeight = $(Selectors.Layout.Navbar).outerHeight(true) as number;
            let pagebarHeight = $(Selectors.Layout.Pagebar).outerHeight(true) as number;
            let contentHeight = $(Selectors.Layout.Content).height() as number;
            $(Selectors.Layout.Pagefrm).height(contentHeight - navbarHeight - pagebarHeight);

            let leftSidebarHeight = $(Selectors.Sidebar.Left.Main).height() as number;
            let leftLogoHeight = $(Selectors.Sidebar.Left.Logo).outerHeight(true) as number;
            let fixedMenusHeight = $(Selectors.Sidebar.Left.FixedMenus).outerHeight(true) as number;
            $(Selectors.Sidebar.Left.ScrollMenus).slimScroll({
                height: (leftSidebarHeight - leftLogoHeight - fixedMenusHeight) + 'px'
            });
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
    });
})(jQuery); // End of use strict
