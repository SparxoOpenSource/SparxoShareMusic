import * as React from 'react'
import Header from '../../components/Header'

import '../../styles/core.less';
import './CoreLayout.less';

class CoreLayout extends React.Component<{}, {}> {

    render() {
        return <div style={{ height:"100%" }}>
            {this.props.children}
        </div>
    }
    static propTypes = {
        children: React.PropTypes.element.isRequired

    }
}
export default CoreLayout
