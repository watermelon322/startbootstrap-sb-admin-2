namespace WM.Admin {
    export interface IFrameworkPage {
        readonly Modules: Array<IModulePage>;
        logout(args?: any): void;
    }
    export interface IModulePage {
        readonly Framework: IFrameworkPage;
    }
}