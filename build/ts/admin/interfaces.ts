namespace WM.Admin {
    export interface IFrameworkPage {
        readonly Modules: Array<IModulePage>;
        logout(): void;
    }
    export interface IModulePage {
        readonly Framework: IFrameworkPage;
    }
}