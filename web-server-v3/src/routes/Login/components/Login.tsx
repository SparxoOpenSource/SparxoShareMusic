import * as React from 'react';
import * as ws from "../../../api/socket";
import { browserHistory } from 'react-router';

class Login extends React.Component<any, { active: boolean }> {

    componentWillMount() {
        this.setState({ active: true });
    }

    onEnter(e: any) {
        e.preventDefault();
        var user_input = this.refs['username'] as HTMLInputElement,
            room = this.refs['room'] as HTMLSelectElement;
        if (user_input.value == "") {
            alert("please enter user name");
            return;
        }
        ws.join(user_input.value, room.value).then(user => {
            this.props.set(user);
            browserHistory.replace("/home");
        }).catch(() => {
            alert("user name already exists");
        });
        return false;
    }
    render() {
        var active = this.state.active || false;
        return <div className="modal face in" style={{ display: active ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Login</h4>
                    </div>
                    <div className="modal-body">
                        <form className="form-horizontal" role="form" onSubmit={(e) => this.onEnter(e)}>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-sm-3 control-label">User Name</label>
                                <div className="col-sm-9">
                                    <input type="text" ref="username" className="form-control" id="inputEmail3" placeholder="User Name" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-sm-3 control-label">Room</label>
                                <div className="col-sm-9">
                                    <select ref="room" className="form-control">
                                        <option value="1">Sparxo Drug Manufacturing Laboratories</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-3 col-sm-9">
                                    <button type="submit" className="btn btn-default">Enter</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Login;