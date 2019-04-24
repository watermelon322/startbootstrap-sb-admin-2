namespace WM {
    export var debug: boolean;
    debug = WM.debug || true;
    export abstract class Log {
        public static log(message: any) {
            console.log(message);
        }
        public static trace(message: any) {
            if (!WM.debug)
                return;
            console.trace(message);
        }
        public static debug(message: any) {
            if (!WM.debug)
                return;
            console.debug(message);
        }
        public static info(message: any) {
            console.info(message);
        }
        public static warn(message: any) {
            console.warn(message);
        }
        public static error(message: any) {
            console.error(message);
        }
        public static exception(message: any) {
            console.exception(message);
        }
    }
    export class Exception {
        private _message?: string;
        private _inner?: Exception;

        public get Message(): string | undefined { return this._message; }
        public get Inner(): Exception | undefined { return this._inner; }

        constructor(message?: string, exception?: Exception) {
            this._message = message;
            this._inner = exception;
        }

        public toString(): string {
            let message: string = this.Message || '';
            if (this.Inner) message += ' => ' + this.Inner;
            return message;
        }
    }

    export class NullReferenceException extends Exception {
        constructor(message?: string, exception?: Exception) {
            super(message || '空引用!', exception);
        }
    }

    export class InvalidOperationException extends Exception {
        constructor(message?: string, exception?: Exception) {
            super(message, exception);
        }
    }

    export class PropertyNotFoundException extends Exception {
        private _property?: string;

        constructor(property: string, message?: string, exception?: Exception) {
            super(message || `属性${property}不存在!`, exception);
            this._property = property;
        }
    }

    export abstract class TypeHelper {
        public static Valid(instance: any) {
            return instance !== null && instance !== undefined;
        }
        public static getName(instance: any) {
            if (instance === null)
                return 'null';
            else if (instance === undefined)
                return 'undefined';
            else
                return instance.constructor.name;
        }
        public static getType(instance: any) {
            if (instance === null)
                return 'null';
            else if (instance === undefined)
                return 'undefined';
            else
                return typeof instance;
        }
        public static isFunction(instance: any) {
            return TypeHelper.getType(instance) === 'function';
        }
        public static get(instance: any, member: string, error: boolean = false) {
            if (!TypeHelper.Valid(instance)) {
                if (error)
                    throw new WM.NullReferenceException();
                return undefined;
            }
            if (!(member in instance) && error)
                throw new WM.PropertyNotFoundException(member);
            return instance[member];
        }
        public static set(instance: any, member: string, arg: any, error: boolean = false) {
            if (!TypeHelper.Valid(instance)) {
                if (error)
                    throw new WM.NullReferenceException();
                return undefined;
            }
            if (!(member in instance) && error)
                throw new WM.PropertyNotFoundException(member);
            instance[member] = arg;
        }
        public static invoke(instance: any, member: string, args: any[] | IArguments = [], error: boolean = false) {
            if (error === void 0) { error = false; }
            var method = TypeHelper.get(instance, member, error);
            if (!TypeHelper.isFunction(method)) {
                if (error)
                    throw new WM.InvalidOperationException(`非法调用方法${member}!`);
                return;
            }
            return method.apply(instance, args);
        }
    }

    export abstract class ReflectionClass<T> {
        protected _instance?: T;

        public get Name(): string { return TypeHelper.getName(this._instance); }
        public get Valid(): boolean { return TypeHelper.Valid(this._instance); }

        constructor(instance?: T) { this._instance = instance; }

        public renew(instance?: T): void {
            this._instance = instance;
        }

        public get(member: string, error: boolean = false) {
            return TypeHelper.get(this._instance, member, error);
        }
        public set(member: string, arg: any, error: boolean = false) {
            TypeHelper.set(this._instance, member, arg, error);
        }
        public invoke(member: string, args: any[] | IArguments = [], error: boolean = false) {
            return TypeHelper.invoke(this._instance, member, args, error);
        }
    }

    export namespace Proxy {
        export class Real<T> extends ReflectionClass<T>{
            constructor(instance?: T) {
                super(instance);
            }
        }
        export class Proxy<T>{
            private _real: Real<T>;
            public get Real(): Real<T> { return this._real; }

            constructor(instance?: T) {
                this._real = new Real(instance);
            }
        }
    }
}