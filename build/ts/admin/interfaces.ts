namespace WM.Admin {
    export interface IFrameworkPage {
        readonly Modules: Array<IModulePage>;
        logout(): void;
        openModule(options: IOpenModuleOptions): void;
        addMessage(message: IMessageData): void;
        addAlert(alert: IAlertData): void;
    }
    export interface IModulePage {
        readonly Framework: IFrameworkPage;
        refresh(): void;
    }
    export interface IOpenModuleOptions {
        url?: string;
        name?: string;
        wmkey?: string;
        icon?: string;
        closable?: boolean;
    }
    export interface IAlertData {
        level: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
        icon: string;
        timestamp: Date;
        content: string;
    }
    export interface IMessageData {
        level: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
        avatar: string;
        from: string;
        timestamp: Date;
        content: string;
    }
}