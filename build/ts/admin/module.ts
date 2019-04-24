/// <reference path="../wm.ts"/>

namespace WM.Admin {
    export class ModulePage implements IModulePage {
        private _framework: FrameworkPageProxy;
        public get Framework(): FrameworkPageProxy {
            return this._framework;
        }

        constructor(framework?: IFrameworkPage) {
            this._framework = new FrameworkPageProxy(framework);

            // Scroll to top button appear
            $(document).on('scroll', function () {
                let scrollDistance = $(this).scrollTop() as number;
                if (scrollDistance > 100) {
                    $('.scroll-to-top').fadeIn();
                } else {
                    $('.scroll-to-top').fadeOut();
                }
            });

            // Smooth scrolling using jQuery easing
            $(document).on('click', 'a.scroll-to-top', function (e) {
                let $anchor = $(this);
                let selector = $anchor.attr('href');
                if (selector) {
                    let offset = $(selector).offset();
                    if (offset)
                        $('html, body').stop().animate({
                            scrollTop: (offset.top)
                        }, 1000, 'easeInOutExpo');
                }
                e.preventDefault();
            });
        }

        public refresh(): void {
            window.location.reload();
        }
    }

    class FrameworkPageProxy extends Proxy.Proxy<IFrameworkPage> implements IFrameworkPage {
        public get Modules(): IModulePage[] {
            return this.Real.get('Modules');
        }

        constructor(framework?: IFrameworkPage) {
            if (!framework && (window.opener || window.parent)) {
                try {
                    framework = (window.opener || window.parent).WM.Admin.Framework;
                }
                catch (e) { Log.trace(e); }
            }
            super(framework);
        }

        public logout(): void {
            this.Real.invoke('logout', arguments);
        }
        public open(options: IOpenOptions): void {
            this.Real.invoke('open', arguments);
        }

        private renewReal() {
            if (!this.Real.Valid && (window.opener || window.parent)) {
                try {
                    let framework = (window.opener || window.parent).WM.Admin.Framework;
                    this.Real.renew(framework);
                }
                catch (e) { Log.trace(e); }
            }
        }
    }

    export var Module: ModulePage;
    export var ModuleFactory: () => ModulePage;
}

(function ($) {
    $(function () {
        if (WM.Admin.ModuleFactory)
            WM.Admin.Module = WM.Admin.ModuleFactory();
        else
            WM.Admin.Module = new WM.Admin.ModulePage();
    });
})(jQuery); // End of use strict