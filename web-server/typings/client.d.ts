
interface Window{
    pomelo:any;
}
declare var Router:any;
declare module "react-routing/lib/Router"{
    export = Router;
}

declare var Notification:any;
interface Window{
    Notification:any
}