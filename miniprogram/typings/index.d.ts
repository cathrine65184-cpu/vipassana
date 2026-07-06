/**
 * 轻量全局类型声明。
 * 如需完整的微信小程序 API 类型，可安装 miniprogram-api-typings，
 * 此处提供宽松声明以保证项目开箱即可编译。
 */
declare const wx: any
declare function App(options: any): void
declare function Page(options: any): void
declare function Component(options: any): void
declare function getApp<T = any>(): T
declare function getCurrentPages(): any[]
declare function setInterval(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): number
declare function clearInterval(id: number | undefined): void
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): number
declare function clearTimeout(id: number | undefined): void
declare const console: any
declare const module: any
declare const require: any
