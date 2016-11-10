import { connect } from 'react-redux'
import { actions } from '../modules/home'


import Home from '../components/Home'

var x = 11;
const mapDispatchToProps = {
    initAsync: actions.initAsync,
    addAsync: actions.addAsync,
    playAsync: actions.playAsync,
    removeAsync: actions.removeAsync,
    nextPlayAsync: actions.nextPlayAsync,
    removeNextPlayAsync: actions.removeNextPlayAsync
}

const mapStateToProps = (state) =>state.home;

export default connect(mapStateToProps, mapDispatchToProps)(Home)
