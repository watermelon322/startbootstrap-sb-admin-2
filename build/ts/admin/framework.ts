/// <reference path="../wm.ts"/>

namespace WM.Admin {
    /**
     * 属性库
     */
    let Attributes = {
        /**
         * 框架属性库
         */
        'WM': {
            /**
             * 唯一键
             * @type string
             */
            'key': 'wm-key',
            'module': 'wm-module',
            'moduleData': {
                /**
                 * 名称
                 */
                'name': 'wm-name',
                /**
                 * 图标
                 */
                'icon': 'wm-icon',
                /**
                 * 地址
                 */
                'url': 'wm-url'
            },
            /**
             * 事件触发器
             */
            'trigger': 'wm-trigger',
            'messageCenter': { 'itemData': 'wm-mc-itemdata' },
            'alertCenter': { 'itemData': 'wm-ac-itemdata' }
        }
    }
    /**
     * css类名库
     */
    let ClassNames = {
        'topbar': {
            'topbarCenter': {
                'root': 'wm-topbarcenter',
                'alertCenter': 'wm-alert',
                'messageCenter': 'wm-message'
            },
            'alertCenter': {
                'item': 'wm-ac-item',
                'itemTime': 'wm-ac-itemtime'
            },
            'messageCenter': {
                'item': 'wm-mc-item',
                'itemTime': 'wm-mc-itemtime'
            }
        },
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
    /**
     * HTML选择器
     */
    let Selectors = {
        'layout': {
            'leftSidebar': '#leftSideBar',
            'topbar': '#content > .navbar',
            'content': '#content',
            'pagebar': '#content > .pagebar',
            'pagefrm': '#content > .pagefrm'
        },
        'topbar': {
            'topbarCenter': {
                'root': `.${ClassNames.topbar.topbarCenter.root}`,
                'alertCenter': `.${ClassNames.topbar.topbarCenter.root}.${ClassNames.topbar.topbarCenter.alertCenter}`,
                'messageCenter': `.${ClassNames.topbar.topbarCenter.root}.${ClassNames.topbar.topbarCenter.messageCenter}`,
                'parts': {
                    'shower': '.wm-tc-shower',
                    'badge': '.wm-tc-badge',
                    'panel': '.wm-tc-panel',
                    'container': '.wm-tc-container',
                    'nodata': '.nodata'
                }
            },
            'alertCenter': {
                'item': `.${ClassNames.topbar.alertCenter.item}`,
                'itemTime': `.${ClassNames.topbar.alertCenter.itemTime}`
            },
            'messageCenter': {
                'item': `.${ClassNames.topbar.messageCenter.item}`,
                'itemTime': `.${ClassNames.topbar.messageCenter.itemTime}`
            }
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

    /**
     * 框架页面事件处理器
     */
    class FrameworkPageEventHandlers {
        /**框架页面 */
        private _framework: IFrameworkPage;
        /**框架页面 */
        public get Framework(): IFrameworkPage {
            return this._framework;
        }

        /**
         * 初始化框架页面事件处理器
         * @param framework 框架页面
         */
        constructor(framework: IFrameworkPage) {
            this._framework = framework;
        }

        /**
         * 退出事件处理器
         * @param event 事件对象
         */
        public onlogout(event: JQuery.Event): void {
            // 打开确认退出对话框
            $(Selectors.dialogs.Logout).modal();
        }
    }

    /**
     * 顶部导航条控制中心
     */
    abstract class TopbarCenter {
        /**JQuery根元素 */
        protected _root: JQuery;
        /**JQuery显示元素 */
        protected _shower: JQuery;
        /**JQuery徽章元素 */
        protected _badge: JQuery;
        /**JQuery面板元素 */
        protected _panel: JQuery;
        /**JQuery面板内容元素 */
        protected _container: JQuery;
        /**JQuery面板无内容显示元素 */
        protected _nodata: JQuery;
        constructor(root: JQuery) {
            this._root = root;
            this._shower = this._root.find(Selectors.topbar.topbarCenter.parts.shower);
            this._badge = this._shower.find(Selectors.topbar.topbarCenter.parts.badge);
            this._panel = this._root.find(Selectors.topbar.topbarCenter.parts.panel);
            this._container = this._panel.find(Selectors.topbar.topbarCenter.parts.container);
            this._nodata = this._container.find(Selectors.topbar.topbarCenter.parts.nodata);
        }
    }
    /**
     * 顶部导航条提醒中心
     */
    class AlertCenter extends TopbarCenter {
        // WM.Admin.Framework.addAlert({level:'success', icon:'fas fa-donate',content:'Hi there! I am wondering if you can help me with a problem I\'ve been having.',timestamp:new Date()})
        /**面板是否有内容 */
        public get HasContent(): boolean {
            return this._container.children(`:not(${Selectors.topbar.topbarCenter.parts.nodata})`).length > 0;
        }
        constructor() {
            super($(Selectors.topbar.topbarCenter.alertCenter));
            this._root.on('show.bs.dropdown', () => {
                this.updateTime();
            });
        }
        /**
         * 新增一或多条提醒
         * @param alerts 提醒
         */
        public add(alerts: IAlertData | IAlertData[]): void {
            if (alerts == undefined) return;
            if (!TypeHelper.isArray(alerts)) alerts = [<IAlertData>alerts];

            _.each(<IAlertData[]>alerts, (m) => {
                let dom = this.createDom(m);
                if (dom != undefined) this._container.append(dom);
            });

            this.adjust();
        }
        /**
         * 调整
         */
        private adjust(): void {
            // 判断面板是否有内容
            if (this.HasContent)
                this._nodata.addClass('hide');
            else
                this._nodata.removeClass('hide');

            // 获取面板内容总高度
            let itemElems = this._container.find(Selectors.topbar.alertCenter.item);
            let height = _.sumBy(itemElems, (o) => $(o).outerHeight(true) || 0);
            let maxHeight = 250;
            if (height <= maxHeight) {
                // 未超过限制, 移除滚动条
                this._container.slimScroll({ destroy: true });
                this._container.removeAttr('style');
            }
            else
                // 已超过限制, 增加滚动条
                this._container.slimScroll({ height: maxHeight + 'px' });

            // 更新徽章内容
            let count = itemElems.length;
            if (count > 0) this._badge.html(count > 99 ? '...' : count.toString());
            else this._badge.empty();
        }
        /**
         * 创建提醒HTML元素
         * @param alert 提醒
         */
        private createDom(alert: IAlertData): JQuery | undefined {
            if (alert == undefined) return undefined;
            let rootElem = $('<a class="dropdown-item d-flex align-items-center" href="#">')
                .addClass(ClassNames.topbar.alertCenter.item);
            rootElem.append($('<div class="mr-3">')
                .append($('<div class="icon-circle">')
                    .addClass(`bg-${alert.level}`)
                    .append($('<i class="text-white"></i>')
                        .addClass(alert.icon))));
            rootElem.append($('<div>')
                .append($('<div class="small text-gray-500">')
                    .addClass(ClassNames.topbar.alertCenter.itemTime))
                .append($('<span>').html(alert.content)));
            rootElem.data(Attributes.WM.alertCenter.itemData, alert);
            this.updateTime(rootElem);
            return rootElem;
        }
        /**
         * 更新提醒时间
         */
        private updateTime(itemElems?: JQuery) {
            let moment = (<any>window).moment;
            if (moment == undefined) return;
            itemElems = itemElems || this._container.find(Selectors.topbar.alertCenter.item);
            _.each(itemElems, (o) => {
                let itemElem = $(o);
                let alertData = itemElem.data(Attributes.WM.alertCenter.itemData) as IMessageData;
                if (alertData == undefined) return;
                let timeElem = itemElem.find(Selectors.topbar.alertCenter.itemTime);
                try {
                    timeElem.html(moment.duration(moment(alertData.timestamp) - moment()).humanize(true));
                } catch (e) { }
            });
        }
    }
    /**
     * 顶部导航条消息中心
     */
    class MessageCenter extends TopbarCenter {
        // WM.Admin.Framework.addMessage({level:'success', avatar:'img/undraw_posting_photo.svg',content:'Hi there! I am wondering if you can help me with a problem I\'ve been having.', from:'Emily Fowler',timestamp:new Date()})
        /**面板是否有内容 */
        public get HasContent(): boolean {
            return this._container.children(`:not(${Selectors.topbar.topbarCenter.parts.nodata})`).length > 0;
        }
        constructor() {
            super($(Selectors.topbar.topbarCenter.messageCenter));
            this._root.on('show.bs.dropdown', () => {
                this.updateTime();
            });
        }
        /**
         * 新增一或多条消息
         * @param alerts 消息
         */
        public add(messages: IMessageData | IMessageData[]): void {
            if (messages == undefined) return;
            if (!TypeHelper.isArray(messages)) messages = [<IMessageData>messages];

            _.each(<IMessageData[]>messages, (m) => {
                let dom = this.createDom(m);
                if (dom != undefined) this._container.append(dom);
            });

            this.adjust();
        }
        /**
         * 调整
         */
        private adjust(): void {
            // 判断面板是否有内容
            if (this.HasContent)
                this._nodata.addClass('hide');
            else
                this._nodata.removeClass('hide');

            // 获取面板内容总高度
            let itemElems = this._container.find(Selectors.topbar.messageCenter.item);
            let height = _.sumBy(itemElems, (o) => $(o).outerHeight(true) || 0);
            let maxHeight = 250;
            if (height <= maxHeight) {
                // 未超过限制, 移除滚动条
                this._container.slimScroll({ destroy: true });
                this._container.removeAttr('style');
            }
            else
                // 已超过限制, 增加滚动条
                this._container.slimScroll({ height: maxHeight + 'px' });

            // 更新徽章内容
            let count = itemElems.length;
            if (count > 0) this._badge.html(count > 99 ? '...' : count.toString());
            else this._badge.empty();
        }
        /**
         * 创建消息HTML元素
         * @param alert 消息
         */
        private createDom(message: IMessageData): JQuery | undefined {
            if (message == undefined) return undefined;
            let rootElem = $('<a class="dropdown-item d-flex align-items-center" href="#">')
                .addClass(ClassNames.topbar.messageCenter.item);
            rootElem.append($('<div class="dropdown-list-image mr-3">')
                .append($('<img class="rounded-circle">')
                    .attr('src', message.avatar))
                .append($('<div class="status-indicator"></div>')
                    .addClass(`bg-${message.level}`)));
            rootElem.append($('<div>')
                .append($('<div class="text-truncate">')
                    .html(message.content))
                .append($('<div class="small text-gray-500">')
                    .append($('<span>').html(message.from))
                    .append($('<span>').addClass(ClassNames.topbar.messageCenter.itemTime))));
            rootElem.data(Attributes.WM.messageCenter.itemData, message);
            this.updateTime(rootElem);
            return rootElem;
        }

        /**
         * 更新提醒时间
         */
        private updateTime(itemElems?: JQuery) {
            let moment = (<any>window).moment;
            if (moment == undefined) return;
            itemElems = itemElems || this._container.find(Selectors.topbar.messageCenter.item);
            _.each(itemElems, (o) => {
                let itemElem = $(o);
                let msgData = itemElem.data(Attributes.WM.messageCenter.itemData) as IMessageData;
                if (msgData == undefined) return;
                let timeElem = itemElem.find(Selectors.topbar.messageCenter.itemTime);
                try {
                    timeElem.html(' - ' + moment.duration(moment(msgData.timestamp) - moment()).humanize(true));
                } catch (e) { }
            });
        }
    }

    /**
     * 框架页面
     */
    export class FrameworkPage implements IFrameworkPage {

        /**模块页集合 */
        protected _modules: Array<ModulePageProxy>;
        /**提醒中心 */
        protected _alertCenter: AlertCenter;
        /**消息中心 */
        protected _messageCenter: MessageCenter;
        /**事件处理器 */
        protected _handlers: FrameworkPageEventHandlers;
        /**事件触发器 */
        protected _events: JQuery<FrameworkPageEventHandlers>;

        /**当前模块页 */
        public get ActivedModule(): ModulePageProxy | undefined {
            return _.find(this.Modules, function (m) { return m.IsActive; });
        }
        /**模块页集合 */
        public get Modules(): Array<ModulePageProxy> {
            return this._modules;
        }
        /**模块页Pagebar标签总宽度 */
        public get AllModuleBarWidth(): number {
            return _.sumBy(this.Modules, function (o) { return o.BarWidth; })
        }
        /**事件处理器 */
        public get EventHandlers(): FrameworkPageEventHandlers {
            return this._handlers;
        }
        /**事件触发器 */
        public get Events(): JQuery<FrameworkPageEventHandlers> {
            return this._events;
        }

        constructor() {
            let framework = this;
            this._modules = new Array<ModulePageProxy>();
            this._alertCenter = new AlertCenter();
            this._messageCenter = new MessageCenter();
            this._handlers = new FrameworkPageEventHandlers(this);
            this._events = $(this._handlers);

            // 重新构造Pagebar及Pagefrm,顺便清理非PagebarItem及PagefrmItem内容
            let pagebarContainer = $(`${Selectors.layout.pagebar} ${Selectors.pagebar.container}`);
            let pagefrm = $(Selectors.layout.pagefrm);
            let pagefrmItems = $(`${Selectors.layout.pagefrm} > iframe`);
            let pagebarItems = $(`${Selectors.layout.pagebar} ${Selectors.pagebar.items}`);
            pagebarContainer.empty();
            pagefrm.empty();
            let count = Math.max(pagefrmItems.length, pagebarItems.length);
            if (count > 0) {
                for (let index = 0; index < count; index++) {
                    const options: IOpenModuleOptions = { closable: false };
                    let pagefrmItem: JQuery | undefined = undefined;
                    let pagebarItem: JQuery | undefined = undefined;
                    // 获取IOpenModuleOptions
                    if (pagefrmItems.length > index) {
                        pagefrmItem = $(pagefrmItems[index]);
                        pagefrm.append(pagefrmItem);
                        options.wmkey = pagefrmItem.attr(Attributes.WM.key) || pagefrmItem.data(Attributes.WM.key);
                        options.icon = pagefrmItem.attr(Attributes.WM.moduleData.icon) || pagefrmItem.data(Attributes.WM.moduleData.icon);
                        options.url = pagefrmItem.attr(Attributes.WM.moduleData.url) || pagefrmItem.data(Attributes.WM.moduleData.url) || pagefrmItem.attr('src');
                    }
                    if (pagebarItems.length > index) {
                        pagebarItem = $(pagebarItems[index]);
                        pagebarContainer.append(pagebarItem);
                        options.wmkey = options.wmkey || pagebarItem.attr(Attributes.WM.key) || pagebarItem.data(Attributes.WM.key);
                        options.icon = options.icon || pagebarItem.attr(Attributes.WM.moduleData.icon) || pagebarItem.data(Attributes.WM.moduleData.icon) || pagebarItem.children('i:first').attr('class');
                        options.name = options.name || pagebarItem.attr(Attributes.WM.moduleData.name) || pagebarItem.data(Attributes.WM.moduleData.name) || $.trim(pagebarItem.text());
                        options.url = options.url || pagebarItem.attr(Attributes.WM.moduleData.url) || pagebarItem.data(Attributes.WM.moduleData.url) || $.trim(<string>pagebarItem.attr('href'));
                        options.closable = pagebarItem.is(`:has(.${ClassNames.pagebar.itemClose})`);
                    }
                    let module = new ModulePageProxy(options, pagebarItem, pagefrmItem);
                    this.Modules.push(module);
                }
                // 将第一个模块页激活为当前模块页
                this.activeModule(this.Modules[0]);
            }

            // 开始绑定事件
            // 绑定元素具有"wm-trigger"属性的框架级事件
            _.each($(Selectors.trigger), (o) => this.bindTrigger($(o)));

            $(window)
                // 绑定窗口尺寸变更事件
                .on('resize', function () {
                    if ($(window).width() as number < 768) {
                        $('.sidebar .collapse').collapse('hide');
                    }

                    framework.fixSize();
                })
                // 绑定窗口焦点失去事件
                .on('blur', function (e) {
                    // 隐藏Pagebar菜单
                    $(Selectors.pagebar.menus.menu).addClass('hide');
                    // 隐藏顶部导航条控制中心弹出面板
                    (<any>$(Selectors.topbar.topbarCenter.parts.shower)).dropdown("hide");
                });

            $(document)
                // 绑定收缩展开LeftSidebar事件
                .on('click', '#sidebarToggle, #sidebarToggleTop', function (e) {
                    $('body').toggleClass('sidebar-toggled');
                    $('.sidebar').toggleClass('toggled');
                    if ($('.sidebar').hasClass('toggled')) {
                        $('.sidebar .collapse').collapse('hide');
                    }
                })
                .on('click', '*', function (e) {
                    // 隐藏Pagebar菜单
                    $(Selectors.pagebar.menus.menu).addClass('hide');
                })
                .on('click', `:not(${Selectors.topbar.topbarCenter.parts.shower})`, function (e) {
                    // 隐藏顶部导航条控制中心弹出面板
                    (<any>$(Selectors.topbar.topbarCenter.parts.shower)).dropdown("hide");
                })
                // 绑定Pagebar右键菜单事件
                .on('contextmenu', `${Selectors.layout.pagebar} ${Selectors.pagebar.container}`, function (e) {
                    let that = $(this);
                    let menuElem = $(Selectors.pagebar.menus.menu);
                    $(Selectors.pagebar.menus.menu).removeClass('hide');
                    // 计算菜单显示位置
                    let mw = <number>menuElem.outerWidth(true);
                    let x = mw + e.pageX + 5;
                    let dw = <number>$(document).width();
                    if (x > dw) x = Math.max(5, dw - mw - 5);
                    else x = e.pageX;
                    menuElem.offset({ 'left': x, 'top': e.pageY });

                    // 获取PagebarItem元素
                    let target: JQuery | undefined = $(e.target);
                    if (!target.is(Selectors.pagebar.items)) {
                        if (!target.is(that))
                            target = target.parent(Selectors.pagebar.items);
                        else target = undefined;
                    }
                    // 查找模块页对象
                    let module = framework.findModule(target);
                    // 根据模块页对象设置相关菜单项禁用启用
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
                // Pagebar右键菜单项点击事件
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.menus.items}:not(.disabled):not(.divider)`, function (e) {
                    let that = $(this);
                    let target: JQuery | undefined = $(e.target);
                    if (!target.is(Selectors.pagebar.menus.menu)) {
                        target = target.parent(Selectors.pagebar.menus.menu);
                    }
                    if (target == undefined || target.length <= 0) return;

                    if (that.is(Selectors.pagebar.menus.closeAll)) {
                        // 关闭全部(除不可关闭外)
                        let modules = _.filter(framework.Modules, function (o) { return <boolean>o.Options.closable; });
                        _.each(modules, function (o) { framework.closeModule(o); });
                        return false;
                    }

                    let module = target.data('module') as ModulePageProxy | undefined;
                    if (module == undefined) return;

                    if (that.is(Selectors.pagebar.menus.refresh)) {
                        // 刷新
                        framework.refreshModule(module);
                    } else if (that.is(Selectors.pagebar.menus.closeSelf)) {
                        // 关闭
                        framework.closeModule(module);
                    } else if (that.is(Selectors.pagebar.menus.closeOther)) {
                        // 关闭其他(除不可关闭外)
                        let modules = _.filter(framework.Modules, function (o) {
                            return module != o && <boolean>o.Options.closable;
                        });
                        _.each(modules, function (o) { framework.closeModule(o); });
                    }
                    return false;
                })
                // Pagebar左移事件
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.leftward}:not(.disabled)`, function (e) {
                    framework.leftwardPagebar();
                    return false;
                })
                // Pagebar右移事件
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.rightward}:not(.disabled)`, function (e) {
                    framework.rightwardPagebar();
                    return false;
                })
                // Pagebar项点击关闭事件
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.itemClose}`, function (e) {
                    let module = framework.findModule($(this).parent());
                    framework.closeModule(module);
                    return false;
                })
                // Pagebar项点击激活事件
                .on('click', `${Selectors.layout.pagebar} ${Selectors.pagebar.items}`, function (e) {
                    let module = framework.findModule($(this));
                    framework.activeModule(module);
                    return false;
                })
                // LeftSidebar模块页菜单点击打开事件
                .on('click', `.sidebar .nav-item > a.nav-link, .sidebar a.collapse-item, [${Attributes.WM.module}]`, function (e) {
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
                            let options: IOpenModuleOptions = {};
                            options.url = aElem.attr(Attributes.WM.moduleData.url) || aElem.data(Attributes.WM.moduleData.url) || aElem.attr('href');
                            options.name = aElem.attr(Attributes.WM.moduleData.name) || aElem.data(Attributes.WM.moduleData.name) || $.trim(aElem.text());
                            options.wmkey = aElem.attr(Attributes.WM.key) || aElem.data(Attributes.WM.key);
                            options.icon = aElem.attr(Attributes.WM.moduleData.icon) || aElem.data(Attributes.WM.moduleData.icon);
                            framework.openModule(options);
                        } catch (error) {
                            Log.error(error);
                        }
                    }
                    return false;
                });

            framework.fixSize();
        }

        /**
         * 触发框架级事件
         * @param event 事件
         * @param extraParameters 事件数据
         */
        public trigger(event: string | JQuery.Event, extraParameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this._events.trigger(event, extraParameters);
        }

        /**
         * 绑定元素具有"wm-trigger"属性的框架级事件
         * <elment wm-trigger="[{srcEvent}:]{event}" ...>
         * @param srcElement HTML元素
         * @param event 框架级事件
         * @param srcEvent HTML元素事件
         */
        private bindTrigger(srcElement: JQuery<HTMLElement>, event?: string, srcEvent?: string): void {
            let framework = this;
            if (event == undefined || event == '') {
                event = srcElement.attr(Attributes.WM.trigger);
            }
            event = $.trim(event || '');
            if (event == '' || event == ':') return;

            srcEvent = $.trim(srcEvent || '');
            if (event.indexOf(':') >= 0) {
                let temp = event.split(':', 2);
                event = temp[1] != '' ? temp[1] : temp[0];
                if (srcEvent == '')
                    srcEvent = temp[0] != '' ? temp[0] : temp[1];
            }

            srcElement.on(srcEvent, function (e) {
                delete e.type;
                framework.trigger(new jQuery.Event(event as string, e));
            });
        }

        /**
         * 退出操作
         */
        public logout(): void {
            this.trigger(FrameworkPageEvents.Logout, arguments);
        }

        /**
         * 修正框架iframe,Pagebar尺寸
         */
        private fixSize(): void {

            let navbarHeight = $(Selectors.layout.topbar).outerHeight(true) as number;
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
         * @param module 模块页对象
         * @param alignment 对齐方向，null：自动，true：向左对齐，false：向右对齐
         */
        private adjustPagebar(module?: ModulePageProxy, alignment?: boolean): void {
            let pagebar = $(Selectors.layout.pagebar);
            let pagebarTabs = pagebar.find(Selectors.pagebar.tabs);
            let pagebarTab = pagebarTabs.find(Selectors.pagebar.tab);
            let pagebarContainer = pagebarTabs.find(Selectors.pagebar.container);
            let allPagebarItemWidth = this.AllModuleBarWidth;

            pagebarTabs.removeClass(ClassNames.pagebar.morepage);
            let pagebarTabMaxWidth = pagebarTab.width() || 0;

            if (pagebarTabMaxWidth > allPagebarItemWidth) {
                // 标签总宽度不溢出, 清除偏移量
                pagebarContainer.css({ 'left': '' });
            } else {
                pagebarTabs.addClass(ClassNames.pagebar.morepage);
                let pagebarTabMinWidth = pagebarTab.width() || 0;
                if (module == undefined) module = this.ActivedModule;
                if (module == undefined) return;

                // 当前偏移量
                let offsetLeft = parseFloat(pagebarContainer.css('left'));
                offsetLeft = isNaN(offsetLeft) ? 0 : offsetLeft;
                let moduleLeft = module.BarOffsetLeft;
                // 计算模块页标签左右位置
                let moduleRange = { 'left': moduleLeft + offsetLeft, 'right': moduleLeft + offsetLeft + module.BarWidth };
                if (moduleRange.left < 0 || moduleRange.left > pagebarTabMinWidth
                    || moduleRange.right < 0 || moduleRange.right > pagebarTabMinWidth) {
                    // 模块页标签有溢出, 计算保证模块页标签不溢出的左移动量和右移动量
                    let left = 0 - moduleRange.left;
                    let right = pagebarTabMinWidth - moduleRange.right;

                    // 未指定对齐方向
                    if (TypeHelper.getType(alignment) != "boolean") {
                        // 哪个方向移动量小, 取哪个方向
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

                // 设置手动移动控制元素是否可用
                let pagebarLeftward = pagebarTabs.find(Selectors.pagebar.leftward);
                let pagebarRightward = pagebarTabs.find(Selectors.pagebar.rightward);
                if (offsetLeft >= 0) pagebarLeftward.addClass('disabled');
                else pagebarLeftward.removeClass('disabled');
                if (Math.abs(offsetLeft + allPagebarItemWidth - pagebarTabMinWidth) <= 0.01) pagebarRightward.addClass('disabled');
                else pagebarRightward.removeClass('disabled');
            }
        }

        /**
         * 打开模块页, 如已打开自动激活模块页
         * @param options 
         */
        public openModule(options: IOpenModuleOptions): void {
            let framework = this;
            var options: IOpenModuleOptions = $.extend({
                'closable': true,
                'icon': 'wfs wf-module'
            }, options);
            options.wmkey = options.wmkey || '';
            options.name = options.name || '';
            options.url = options.url || '';

            // 根据wmkey查找已打开模块页
            let module = this.findModule(options.wmkey);
            if (module == undefined && $.trim(options.url) == '') return;
            else if (module == undefined && $.trim(options.url) != '') {
                // 未找到且地址不为空, 创建新模块页对象
                module = new ModulePageProxy(options);
                this.Modules.push(module);
            }
            // 激活模块页
            framework.activeModule(module);
        }
        /**
         * 激活模块页
         * @param module 指定模块页激话
         */
        private activeModule(module?: ModulePageProxy): void {
            if (module == undefined) return;
            _.each(this.Modules, (o) => {
                if (module != o)
                    o.inactive();
                else module.active();
            });
            this.adjustPagebar();
        }
        /**
         * 关闭模块页
         * @param module 指定模块页关闭
         */
        private closeModule(module?: ModulePageProxy): void {
            if (module == undefined || !module.Options.closable) return;
            // 获取关闭后需要调整或激活的模块页
            let nextModule: ModulePageProxy | undefined;
            if (this.Modules.length > 1) {
                let offset = _.indexOf(this.Modules, module);
                // 是否最后一个
                if (offset + 1 == this.Modules.length)
                    // 是, 取前一个
                    nextModule = this.Modules[offset - 1];
                else
                    // 否, 取下一个
                    nextModule = this.Modules[offset + 1];
            }
            let active = module.IsActive;
            _.pull(this.Modules, module);
            module.close();
            if (active && nextModule) this.activeModule(nextModule);
            else if (!active && nextModule) this.adjustPagebar(nextModule);
            else this.adjustPagebar();
        }
        /**
         * 刷新模块页
         * @param module 指定模块页刷新
         */
        private refreshModule(module?: ModulePageProxy): void {
            if (module == undefined) return;
            module.refresh();
        }
        /**
         * 查找模块页
         * @param condition string: wmkey, JQuery|Dom: pagebarItem, pagefrmItem
         */
        private findModule(condition: string | JQuery | HTMLElement | undefined): ModulePageProxy | undefined {

            let module: ModulePageProxy | undefined;
            if (!condition) return module;
            let type = TypeHelper.getType(condition);
            if (type == 'string' && $.trim(condition as string) == '') return module;
            if (type == 'string') {
                _.each(this.Modules, (o) => {
                    if (o.Options.wmkey == $.trim(condition as string)) {
                        module = o;
                        return false;
                    }
                });
            } else {
                let tmpElem: JQuery = $(condition as JQuery | HTMLElement);
                _.each(this.Modules, (o) => {
                    if (tmpElem.is(o.PagebarItem as JQuery)
                        || tmpElem.is(o.PagefrmItem as JQuery)) {
                        module = o;
                        return false;
                    }
                });
            }

            return module;
        }

        /**
         * 消息中心添加消息
         * @param message 消息数据
         */
        public addMessage(message: IMessageData) {
            this._messageCenter.add(message);
        }
        /**
         * 提醒中心添加提醒
         * @param alert 提醒数据
         */
        public addAlert(alert: IAlertData) {
            this._alertCenter.add(alert);
        }
    }

    /**
     * 模块页, 代理模式处理子页面操作
     */
    class ModulePageProxy extends Proxy.Proxy<IModulePage> implements IModulePage {
        protected _options: IOpenModuleOptions;
        public PagebarItem?: JQuery;
        public PagefrmItem?: JQuery;

        /**标签宽度 */
        public get BarWidth(): number {
            return this.PagebarItem == undefined ? 0 : (this.PagebarItem.outerWidth(true) || 0);
        }
        /**标签位置 */
        public get BarOffsetLeft(): number {
            if (this.PagebarItem == undefined) return 0;
            let offset = this.PagebarItem.offset() as JQuery.Coordinates;
            let parentOffset = this.PagebarItem.parent().offset() as JQuery.Coordinates;;
            return offset.left - parentOffset.left;
        }
        /**是否激活 */
        public get IsActive(): boolean {
            if (this.PagebarItem && this.PagebarItem.hasClass(ClassNames.pagebar.itemActive))
                return true;
            if (this.PagefrmItem && this.PagefrmItem.hasClass(ClassNames.pagefrm.itemActive))
                return true;
            return false;
        }
        public get Options(): IOpenModuleOptions {
            return this._options;
        }
        public get Framework(): IFrameworkPage {
            return this.Real.get('FrameworkPage');
        }
        constructor(options: IOpenModuleOptions, pagebarItem?: JQuery, pagefrmItem?: JQuery) {
            super(undefined);

            this._options = options;

            this.PagebarItem = pagebarItem;
            this.PagefrmItem = pagefrmItem;
            this.createDom();
        }

        /**激活 */
        public active(): void {
            if (this.PagebarItem)
                this.PagebarItem.addClass(ClassNames.pagebar.itemActive);
            if (this.PagefrmItem)
                this.PagefrmItem.addClass(ClassNames.pagefrm.itemActive);
        }
        /**取消激活 */
        public inactive(): void {
            if (this.PagebarItem)
                this.PagebarItem.removeClass(ClassNames.pagebar.itemActive);
            if (this.PagefrmItem)
                this.PagefrmItem.removeClass(ClassNames.pagefrm.itemActive);
        }
        /**关闭 */
        public close(): void {
            if (this.PagebarItem)
                this.PagebarItem.remove();
            if (this.PagefrmItem)
                this.PagefrmItem.remove();
        }
        /**刷新 */
        public refresh(): void {
            this.refreshMode1() || this.refreshMode2() || this.refreshMode3();
        }
        /**刷新模式1, 子页面WM.Admin.Module.refresh() */
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
        /**刷新模式2, 子页面win.location.reload() */
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
        /**刷新模式3, iframe.src */
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

        /**
         * 更新子页面代理真实对象
         */
        private renewReal() {
            if (!this.Real.Valid && this.PagefrmItem && this.PagefrmItem.length > 0) {
                try {
                    let pagefrmWin = (this.PagefrmItem[0] as HTMLIFrameElement).contentWindow as any;
                    this.Real.renew(pagefrmWin.WM.Admin.Module);
                }
                catch (e) { Log.trace(e); }
            }
        }

        /**
         * 创建HTML元素
         */
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
