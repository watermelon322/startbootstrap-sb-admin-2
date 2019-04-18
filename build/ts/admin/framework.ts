namespace WM.Admin {
    let Attributes = {
        'Trigger': 'wm-trigger'
    }
    let Selectors = {
        'Dialogs': {
            'Logout': '#wmd-logout'
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
        }

        public trigger(event: string | JQuery.Event, extraParameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            $(this._handlers).trigger(event, extraParameters);
        }

        public logout(): void {
            this.trigger('logout', arguments);
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
                $('.sidebar .collapse').collapse('hide');
            }
        });

        // Close any open menu accordions when window is resized below 768px
        $(window).resize(function () {
            if ($(window).width() as number < 768) {
                $('.sidebar .collapse').collapse('hide');
            }

            fixPagefrm();
        });

        fixPagefrm();
    });
})(jQuery); // End of use strict
