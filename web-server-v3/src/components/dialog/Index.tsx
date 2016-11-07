import * as React from "react";
import * as ReactDOM from "react-dom";


export class Dialog extends React.Component<{ onClose}, {}> {

    close() {
        this.props.onClose(true);
    }
    render() {
        return <div className="modal">确定要离开此页面
            <a href="javascript:;" onClick={() => this.close()}>close</a>
        </div>
    }
    static show() {
        var host = document.createElement("div");
        host.className = "modal-host";
        document.body.appendChild(host);
        return new Promise((resolve, reject) => {
            ReactDOM.render(<Dialog onClose={(data) => {
                if (ReactDOM.unmountComponentAtNode(host)) {
                    resolve(data);
                }
            } }  />, host);
        }).then((...args) => {
            host.remove();            
            return args;
        });
    }
}

