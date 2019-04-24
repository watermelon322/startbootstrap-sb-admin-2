namespace WM.Admin {
    export interface IFrameworkPage {
        readonly Modules: Array<IModulePage>;
        logout(): void;
        open(options: IOpenOptions): void;
    }
    export interface IModulePage {
        readonly Framework: IFrameworkPage;
        refresh(): void;
    }
    export interface IOpenOptions {
        url?: string;
        name?: string;
        wmkey?: string;
        icon?: string;
        closable?: boolean;
    }
}