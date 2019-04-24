/// <reference path="../wm.ts"/>

namespace WM.Admin {
    let Attributes = {
        'WM': {
            'key': 'wm-key',
            'icon': 'wm-icon',
            'trigger': 'wm-trigger',
        }
    }
    let ClassNames = {
        'pagebar': {
            'leftward': 'pagebar-leftward',
            'rightward': 'pagebar-rightward',
            'tabs': 'pagebar-tabs',
            'tab': 'pagebar-tab',
            'morepage': 'morepage',
            'container': 'pagebar-tab-container',
            'item': 'pagebar-tab-item',
            'itemTitle': 'pagebar-title',
            'itemClose': 'pagebar-close',
            'itemActive': 'active',
            'menus': {
                'menu': 'pagebar-menus',
                'refresh': 'refresh',
                'closeSelf': 'closeSelf',
                'closeOther': 'closeOther',
                'closeAll': 'closeAll'
            }
        },
        'pagefrm': {
            'itemActive': 'active'
        },
    }
    let Selectors = {
        'layout': {
            'leftSidebar': '#leftSideBar',
            'navbar': '#content > .navbar',
            'content': '#content',
            'pagebar': '#content > .pagebar',
            'pagefrm': '#content > .pagefrm'
        },
        'topbar': {
            'alertcenter': { 'alertsContainer': '#alertsContainer' },
            'messagecenter': { 'messagesContainer': '#messagesContainer' }
        },
        'sidebar': {
            'left': {
                'logo': '#fixedLogo',
                'FixedMenus': '#fixedMenus',
                'scrollMenus': '#scrollMenus'
            }
        },
        'pagebar': {
            'leftward': `.${ClassNames.pagebar.leftward}`,
            'rightward': `.${ClassNames.pagebar.rightward}`,
            'tabs': `.${ClassNames.pagebar.tabs}`,
            'tab': `.${ClassNames.pagebar.tab}`,
            'container': `.${ClassNames.pagebar.container}`,
            'items': `.${ClassNames.pagebar.container} > .${ClassNames.pagebar.item}`,
            'itemClose': `.${ClassNames.pagebar.container} > .${ClassNames.pagebar.item} > .${ClassNames.pagebar.itemClose}`,
            'menus': {
                'menu': `.${ClassNames.pagebar.menus.menu}`,
                'items': `.${ClassNames.pagebar.menus.menu} > .pagebar-menuitem`,
                'refresh': `.${ClassNames.pagebar.menus.refresh}`,
                'closeSelf': `.${ClassNames.pagebar.menus.closeSelf}`,
                'closeOther': `.${ClassNames.pagebar.menus.closeOther}`,
                'closeAll': `.${ClassNames.pagebar.menus.closeAll}`
            }
        },
        'pagefrm': {},
        'dialogs': {
            'Logout': '#wmd-logout'
        },
        'trigger': `[${Attributes.WM.trigger}]`
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
            $(Selectors.dialogs.Logout).modal();
        }
    }

    export class FrameworkPage implements IFrameworkPage {

        private _modules: Array<ModulePageProxy>;

        private _handlers: FrameworkPageEventHandlers;

        public get ActivedModule(): ModulePageProxy | undefined {
            return _.find(this.Modules, function (m) { return m.IsActive; });
        }
        public get Modules(): Array<ModulePageProxy> {
            return this._modules;
        }
        public get AllModuleBarWidth(): number {
            return _.sumBy(this.Modules, function (o) { return o.BarWidth; })
        }

        constructor() {
            let framework = this;
            this._modules = new Array<ModulePageProxy>();
            this._handlers = new FrameworkPageEventHandlers(framework);

            $(Selectors.trigger).each(function (n, o) {
                framework.bindTrigger($(o));
            });

            // clear pagebar-tab-container space
            let pagebarContainer = $(`${Selectors.layout.pagebar} ${Selectors.pagebar.container}`);
            let pagefrm = $(Selectors.layout.pagefrm);
            let pagefrmItems = $(`${Selectors.layout.pagefrm} > iframe`);
            let pagebarItems = $(`${Selectors.layout.pagebar} ${Selectors.pagebar.items}`);
            pagebarContainer.empty();
            pagefrm.empty();
            let count = Math.max(pagefrmItems.length, pagebarItems.length);
            if (count > 0) {
                for (let index = 0; index < count; index++) {
                    const options: IOpenOptions = { closable: false };
                    let pagefrmItem: JQuery | undefined = undefined;
                    let pagebarItem: JQuery | undefined = undefined;
                    if (pagefrmItems.length > index) {
                        pagefrmItem = $(pagefrmItems[index]);
                        pagefrm.append(pagefrmItem);
                        options.wmkey = pagefrmItem.attr(Attributes.WM.key) || pagefrmItem.data(Attributes.WM.key);
                        options.icon = pagefrmItem.attr(Attributes.WM.icon) || pagefrmItem.data(Attributes.WM.icon);
                        options.url = pagefrmItem.attr('src');
                    }
                    if (pagebarItems.length > index) {
                        pagebarItem = $(pagebarItems[index]);
                        pagebarContainer.append(pagebarItem);
                        options.wmkey = options.wmkey || pagebarItem.attr(Attributes.WM.key) || pagebarItem.data(Attributes.WM.key);
                        options.icon = options.icon || pagebarItem.attr(Attributes.WM.icon) || pagebarItem.data(Attributes.WM.icon) || pagebarItem.children('i:first').attr('class');
                        options.name = $.trim(pagebarItem.text());
                        options.closable = pagebarItem.is(`:has(.${ClassNames.pagebar.itemClose})`);
                    }
                    let module = new ModulePageProxy(options, pagebarItem, pagefrmItem);
                    this.Modules.push(module);
                }
                this.activeModule(this.Modules[0]);
            }

            // Close any open menu accordions when window is resized below 768px
            $(window)
                .on('resize', function () {
                    if ($(window).width() as number < 768) {
                        $('.sidebar .collapse').collapse('hide');
                    }

                    framework.fixSize();
                }).on('blur', function (e) {
                    $(Selectors.pagebar.menus.menu).addClass('hide');
                });;

            $(document)
                .on('click', '#sidebarToggle, #sidebarToggleTop', function (e) {
                    $('body').toggleClass('sidebar-toggled');
                    $('.sidebar').toggleClass('toggled');
                    if ($('.sidebar').hasClass('toggled')) {
                        $('.sidebar .collapse').collapse('hide');
                    }
                })
                .on('click', '*', function (e) {
                    $(Selectors.pagebar.menus.menu).addClass('hide');
                })
                .on('contextmenu', `${Selectors.layout.pagebar} ${Selectors.pagebar.container}`, function (e) {
                    let that = $(this);
                    let menuElem = $(Selectors.pagebar.menus.menu);
                    $(Selectors.pagebar.menus.menu).removeClass('hide');
                    let mw = <number>menuElem.outerWidth(true);
                    let x = mw + e.pageX + 5;
                    let dw = <number>$(document).width();
                    if (x > dw) x = Math.max(5, dw - mw - 5);
                    else x = e.pageX;
                    menuElem.offset({ 'left': x, 'top': e.pageY });

                    let target: JQuery | undefined = $(e.target);
                    if (!target.is(Selectors.pagebar.items)) {
                        if (!target.is(that))
                            target = target.parent(Selectors.pagebar.items);
                        else target = undefined;
                    }
                    let module = framework.findModule(target);
                    if (module != undefined) {
                        menuElem.data('module', module);
                        menuElem.find(Selectors.pagebar.menus.refresh).removeClass('disabled');
                        if (module.Options.closable)
                            menuElem.find(Selectors.pagebar.menus.closeSelf).removeClass('disabled');
                        else
                            menuElem.find(Selectors.pagebar.menus.closeSelf).addClass('disabled');
                        menuElem.find(Selectors.pagebar.menus.closeOther).removeClass('disabled');
                    }
                    else {
                        menuElem.find(Selectors.pagebar.menus.refresh).addClass('disabled');
                        menuElem.find(Selectors.pagebar.menus.closeSelf).addClass('disabled');
                        menuElem.find(Selectors.pagebar.menus.closeOther).addClass('disabled');
                        menuElem.data('module', undefined);
                    }
                    return false;
                })
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.menus.items}:not(.disabled):not(.divider)`, function (e) {
                    let that = $(this);
                    let target: JQuery | undefined = $(e.target);
                    if (!target.is(Selectors.pagebar.menus.menu)) {
                        target = target.parent(Selectors.pagebar.menus.menu);
                    }
                    if (target == undefined || target.length <= 0) return;

                    if (that.is(Selectors.pagebar.menus.closeAll)) {
                        let modules = _.filter(framework.Modules, function (o) { return <boolean>o.Options.closable; });
                        _.each(modules, function (o) { framework.closeModule(o); });
                        return false;
                    }

                    let module = target.data('module') as ModulePageProxy | undefined;
                    if (module == undefined) return;

                    if (that.is(Selectors.pagebar.menus.refresh)) {
                        framework.refreshModule(module);
                    } else if (that.is(Selectors.pagebar.menus.closeSelf)) {
                        framework.closeModule(module);
                    } else if (that.is(Selectors.pagebar.menus.closeOther)) {
                        let modules = _.filter(framework.Modules, function (o) {
                            return module != o && <boolean>o.Options.closable;
                        });
                        _.each(modules, function (o) { framework.closeModule(o); });
                    }
                    return false;
                })
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.leftward}:not(.disabled)`, function (e) {
                    framework.leftwardPagebar();
                    return false;
                })
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.rightward}:not(.disabled)`, function (e) {
                    framework.rightwardPagebar();
                    return false;
                })
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.itemClose}`, function (e) {
                    let module = framework.findModule($(this).parent());
                    framework.closeModule(module);
                    return false;
                })
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.items}`, function (e) {
                    let module = framework.findModule($(this));
                    framework.activeModule(module);
                    return false;
                })
                .on('click', '.sidebar .nav-item > a.nav-link, .sidebar a.collapse-item', function (e) {
                    let aElem = $(this);
                    let divElem = aElem.next('div.collapse');
                    if (divElem.length > 0) {
                        if (aElem.hasClass('collapsed')) {
                            aElem.removeClass('collapsed');
                            divElem.addClass('show');
                        } else {
                            aElem.addClass('collapsed');
                            divElem.removeClass('show');
                        }
                    } else {
                        try {
                            let options: IOpenOptions = {};
                            options.url = aElem.attr('href');
                            options.name = $.trim(aElem.text());
                            options.wmkey = aElem.attr(Attributes.WM.key) || aElem.data(Attributes.WM.key);
                            options.icon = aElem.attr(Attributes.WM.icon) || aElem.data(Attributes.WM.icon);
                            framework.open(options);
                        } catch (error) {
                            Log.error(error);
                        }
                    }
                    return false;
                });

            $(Selectors.topbar.alertcenter.alertsContainer).slimScroll({
                height: '250px'
            });
            $(Selectors.topbar.messagecenter.messagesContainer).slimScroll({
                height: '250px'
            });
            framework.fixSize();
        }

        public trigger(event: string | JQuery.Event, extraParameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            $(this._handlers).trigger(event, extraParameters);
        }

        private bindTrigger(elem: JQuery<HTMLElement>, trigger?: string, event?: string): void {
            let framework = this;
            if (trigger == undefined || trigger == '') {
                trigger = elem.attr(Attributes.WM.trigger);
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

            elem.on(event, function (e) {
                delete e.type;
                framework.trigger(new jQuery.Event(trigger as string, e));
            });
        }

        public logout(): void {
            this.trigger('logout', arguments);
        }

        public open(options: IOpenOptions): void {
            let framework = this;
            var options: IOpenOptions = $.extend({
                'closable': true,
                'icon': 'wfs wf-module'
            }, options);
            options.wmkey = options.wmkey || '';
            options.name = options.name || '';
            options.url = options.url || '';

            let module = this.findModule(options.wmkey);
            if (module == undefined && $.trim(options.url) == '') return;
            else if (module == undefined && $.trim(options.url) != '') {
                module = new ModulePageProxy(options);
                this.Modules.push(module);
            }
            framework.activeModule(module);
        }

        /**
         * 修正框架iframe,Pagebar尺寸
         */
        private fixSize(): void {

            let navbarHeight = $(Selectors.layout.navbar).outerHeight(true) as number;
            let pagebarHeight = $(Selectors.layout.pagebar).outerHeight(true) as number;
            let contentHeight = $(Selectors.layout.content).height() as number;
            $(Selectors.layout.pagefrm).height(contentHeight - navbarHeight - pagebarHeight);

            let leftSidebarHeight = $(Selectors.layout.leftSidebar).height() as number;
            let leftLogoHeight = $(Selectors.sidebar.left.logo).outerHeight(true) as number;
            let fixedMenusHeight = $(Selectors.sidebar.left.FixedMenus).outerHeight(true) as number;
            $(Selectors.sidebar.left.scrollMenus).slimScroll({
                height: (leftSidebarHeight - leftLogoHeight - fixedMenusHeight) + 'px'
            });
            this.adjustPagebar();
        }

        /**
         * Pagebar向左移动
         */
        private leftwardPagebar(): void {
            let pagebar = $(Selectors.layout.pagebar);
            let pagebarTabs = pagebar.find(Selectors.pagebar.tabs);
            let pagebarTab = pagebarTabs.find(Selectors.pagebar.tab);
            let pagebarContainer = pagebarTabs.find(Selectors.pagebar.container);
            let allPagebarItemWidth = this.AllModuleBarWidth;
            let pagebarTabWidth = pagebarTab.width() || 0;

            let position = parseFloat(pagebarContainer.css('left'));
            position = isNaN(position) ? 0 : Math.abs(position);

            let index = _.findLastIndex(this.Modules, function (o) {
                return o.BarOffsetLeft <= position;
            });
            let module = this.Modules[index];
            this.adjustPagebar(module, false);
        }
        /**
         * Pagebar向右移动
         */
        private rightwardPagebar(): void {
            let pagebar = $(Selectors.layout.pagebar);
            let pagebarTabs = pagebar.find(Selectors.pagebar.tabs);
            let pagebarTab = pagebarTabs.find(Selectors.pagebar.tab);
            let pagebarContainer = pagebarTabs.find(Selectors.pagebar.container);
            let allPagebarItemWidth = this.AllModuleBarWidth;
            let pagebarTabWidth = pagebarTab.width() || 0;

            let position = parseFloat(pagebarContainer.css('left'));
            position = isNaN(position) ? 0 : Math.abs(position);
            position += pagebarTabWidth;

            let index = _.findIndex(this.Modules, function (o) {
                return o.BarOffsetLeft + o.BarWidth >= position;
            });
            let module = this.Modules[index];
            this.adjustPagebar(module, true);
        }
        /**
         * 调整Pagebar偏移位置
         * @param module 模块对象
         * @param alignment 对齐方向，null：自动，true：向左对齐，false：向右对齐
         */
        private adjustPagebar(module?: ModulePageProxy, alignment?: boolean): void {
            let pagebar = $(Selectors.layout.pagebar);
            let pagebarTabs = pagebar.find(Selectors.pagebar.tabs);
            let pagebarTab = pagebarTabs.find(Selectors.pagebar.tab);
            let pagebarContainer = pagebarTabs.find(Selectors.pagebar.container);
            let allPagebarItemWidth = this.AllModuleBarWidth;

            pagebarTabs.addClass(ClassNames.pagebar.morepage);
            let pagebarTabMinWidth = pagebarTab.width() || 0;
            pagebarTabs.removeClass(ClassNames.pagebar.morepage);
            let pagebarTabMaxWidth = pagebarTab.width() || 0;

            if (pagebarTabMaxWidth > allPagebarItemWidth) {
                pagebarContainer.css({ 'left': '' });
            } else {
                pagebarTabs.addClass(ClassNames.pagebar.morepage);
                if (module == undefined) module = this.ActivedModule;
                if (module == undefined) return;

                let offsetLeft = parseFloat(pagebarContainer.css('left'));
                offsetLeft = isNaN(offsetLeft) ? 0 : offsetLeft;
                let moduleLeft = module.BarOffsetLeft;
                let moduleRange = { 'left': moduleLeft + offsetLeft, 'right': moduleLeft + offsetLeft + module.BarWidth };
                if (moduleRange.left < 0 || moduleRange.left > pagebarTabMinWidth
                    || moduleRange.right < 0 || moduleRange.right > pagebarTabMinWidth) {
                    let left = 0 - moduleRange.left;
                    let right = pagebarTabMinWidth - moduleRange.right;
                    if (TypeHelper.getType(alignment) != "boolean") {
                        alignment = Math.abs(left) < Math.abs(right);
                    }
                    if (alignment)
                        offsetLeft += left;
                    else
                        offsetLeft += right;
                }
                offsetLeft = Math.min(0, offsetLeft);
                offsetLeft = Math.max(pagebarTabMinWidth - allPagebarItemWidth, offsetLeft);
                if (offsetLeft >= 0)
                    pagebarContainer.css('left', '');
                else
                    pagebarContainer.css('left', offsetLeft + 'px');
                let pagebarLeftward = pagebarTabs.find(Selectors.pagebar.leftward);
                let pagebarRightward = pagebarTabs.find(Selectors.pagebar.rightward);
                if (offsetLeft >= 0) pagebarLeftward.addClass('disabled');
                else pagebarLeftward.removeClass('disabled');
                if (Math.abs(offsetLeft + allPagebarItemWidth - pagebarTabMinWidth) <= 0.01) pagebarRightward.addClass('disabled');
                else pagebarRightward.removeClass('disabled');
            }
        }
        private activeModule(module?: ModulePageProxy): void {
            if (module == undefined) return;
            $.each(this.Modules, function (n, o) {
                if (module != o)
                    o.inactive();
                else module.active();
            });
            this.adjustPagebar();
        }
        private closeModule(module?: ModulePageProxy): void {
            if (module == undefined || !module.Options.closable) return;
            let nextModule: ModulePageProxy | undefined;
            if (this.Modules.length > 1) {
                let offset = _.indexOf(this.Modules, module);
                if (offset + 1 == this.Modules.length)
                    nextModule = this.Modules[offset - 1];
                else
                    nextModule = this.Modules[offset + 1];
            }
            let active = module.IsActive;
            _.pull(this.Modules, module);
            module.close();
            if (active && nextModule) this.activeModule(nextModule);
            else if (!active && nextModule) this.adjustPagebar(nextModule);
            else this.adjustPagebar();
        }
        private refreshModule(module?: ModulePageProxy): void {
            if (module == undefined) return;
            module.refresh();
        }
        private findModule(condition: string | JQuery | HTMLElement | undefined): ModulePageProxy | undefined {

            let module: ModulePageProxy | undefined;
            if (!condition) return module;
            let type = TypeHelper.getType(condition);
            if (type == 'string' && $.trim(condition as string) == '') return module;
            if (type == 'string') {
                $.each(this.Modules, function (n, o) {
                    if (o.Options.wmkey == $.trim(condition as string)) {
                        module = o;
                        return false;
                    }
                });
            } else {
                let tmpElem: JQuery = $(condition as JQuery | HTMLElement);
                $.each(this.Modules, function (n, o) {
                    if (tmpElem.is(o.PagebarItem as JQuery)
                        || tmpElem.is(o.PagefrmItem as JQuery)) {
                        module = o;
                        return false;
                    }
                });
            }

            return module;
        }
    }

    class ModulePageProxy extends Proxy.Proxy<IModulePage> implements IModulePage {
        protected _options: IOpenOptions;
        public PagebarItem?: JQuery;
        public PagefrmItem?: JQuery;

        public get BarWidth(): number {
            return this.PagebarItem == undefined ? 0 : (this.PagebarItem.outerWidth(true) || 0);
        }
        public get BarOffsetLeft(): number {
            if (this.PagebarItem == undefined) return 0;
            let offset = this.PagebarItem.offset() as JQuery.Coordinates;
            let parentOffset = this.PagebarItem.parent().offset() as JQuery.Coordinates;;
            return offset.left - parentOffset.left;
        }
        public get IsActive(): boolean {
            if (this.PagebarItem && this.PagebarItem.hasClass(ClassNames.pagebar.itemActive))
                return true;
            if (this.PagefrmItem && this.PagefrmItem.hasClass(ClassNames.pagefrm.itemActive))
                return true;
            return false;
        }
        public get Options(): IOpenOptions {
            return this._options;
        }
        public get Framework(): IFrameworkPage {
            return this.Real.get('FrameworkPage');
        }
        constructor(options: IOpenOptions, pagebarItem?: JQuery, pagefrmItem?: JQuery) {
            super(undefined);

            this._options = options;

            this.PagebarItem = pagebarItem;
            this.PagefrmItem = pagefrmItem;
            this.createDom();
        }

        public active(): void {
            if (this.PagebarItem)
                this.PagebarItem.addClass(ClassNames.pagebar.itemActive);
            if (this.PagefrmItem)
                this.PagefrmItem.addClass(ClassNames.pagefrm.itemActive);
        }
        public inactive(): void {
            if (this.PagebarItem)
                this.PagebarItem.removeClass(ClassNames.pagebar.itemActive);
            if (this.PagefrmItem)
                this.PagefrmItem.removeClass(ClassNames.pagefrm.itemActive);
        }
        public close(): void {
            if (this.PagebarItem)
                this.PagebarItem.remove();
            if (this.PagefrmItem)
                this.PagefrmItem.remove();
        }
        public refresh(): void {
            this.refreshMode1() || this.refreshMode2() || this.refreshMode3();
        }
        private refreshMode1(): boolean {
            try {
                this.renewReal();
                this.Real.invoke('refresh', arguments, true);
                return true;
            } catch (error) {
                Log.trace(error);
                return false;
            }
        }
        private refreshMode2(): boolean {
            try {
                if (this.PagefrmItem && this.PagefrmItem.length > 0) {
                    let win = (this.PagefrmItem[0] as HTMLIFrameElement).contentWindow as Window;
                    win.location.reload();
                }
                return true;
            } catch (error) {
                Log.trace(error);
                return false;
            }
        }
        private refreshMode3(): boolean {
            try {
                if (this.PagefrmItem && this.PagefrmItem.length > 0) {
                    this.PagefrmItem.attr('src', this.PagefrmItem.attr('src') as string);
                }
                return true;
            } catch (error) {
                Log.trace(error);
                return false;
            }
        }

        private renewReal() {
            if (!this.Real.Valid && this.PagefrmItem && this.PagefrmItem.length > 0) {
                try {
                    let pagefrmWin = (this.PagefrmItem[0] as HTMLIFrameElement).contentWindow as any;
                    this.Real.renew(pagefrmWin.WM.Admin.Module);
                }
                catch (e) { Log.trace(e); }
            }
        }

        private createDom(): void {
            if (this.PagebarItem == undefined) {
                let pagebar = $(Selectors.layout.pagebar);
                let pagebarContainer = pagebar.find(Selectors.pagebar.container);
                this.PagebarItem = $(`<div class="${ClassNames.pagebar.item}">`);
                if ($.trim(this._options.icon as string) != '') {
                    this.PagebarItem.append($(`<i class="${this._options.icon}">`));
                }
                if ($.trim(this._options.name as string) != '') {
                    this.PagebarItem.append($(`<span class="${ClassNames.pagebar.itemTitle}">`).html(this._options.name as string));
                }
                if (this._options.closable as boolean) {
                    this.PagebarItem.append($(`<i class="${ClassNames.pagebar.itemClose} wfs wf-close">`));
                }
                pagebarContainer.append(this.PagebarItem);
            }

            if (this.PagefrmItem == undefined) {
                let pagefrm = $(Selectors.layout.pagefrm);
                this.PagefrmItem = $(`<iframe>`).attr('src', this._options.url as string);
                pagefrm.append(this.PagefrmItem);
            }
        }
    }
    export var Framework: FrameworkPage;
    export var FrameworkFactory: () => FrameworkPage;
}

(function ($) {
    $(function () {
        if (WM.Admin.FrameworkFactory)
            WM.Admin.Framework = WM.Admin.FrameworkFactory();
        else
            WM.Admin.Framework = new WM.Admin.FrameworkPage();
    });
})(jQuery); // End of use strict
