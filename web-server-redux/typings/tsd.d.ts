/// <reference path="q/Q.d.ts" />
/// <reference path="react-router/react-router.d.ts" />
/// <reference path="react/react-dom.d.ts" />
/// <reference path="react/react.d.ts" />
/// <reference path="redux/redux.d.ts" />
/// <reference path="react-redux/react-redux.d.ts" />
/// <reference path="react-router-redux/react-router-redux.d.ts" />
/// <reference path="redux-thunk/redux-thunk.d.ts" />
/// <reference path="react-router/history.d.ts" />
/// <reference path="classnames/classnames.d.ts" />
/// <reference path="redux-form/redux-form.d.ts" />
/// <reference path="jquery/jquery.d.ts" />
interface Window{
    EventEmitter:any
}
declare var pomelo:any;
declare module "pomelo-jsclient-websocket/lib/pomelo-client"{
    export =pomelo;
}
declare module "pomelo-protobuf/lib/client/protobuf"{
    export =pomelo;
}
declare module "pomelo-protocol/lib/protocol"{
    export =pomelo;
}

declare var require:(name:string)=>any;
