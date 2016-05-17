import * as React from 'react';
import {connect} from 'react-redux';
import {play} from '../actions/player';

function mapStateToProps(state) {    
   return state.player
}

function mapDispatchToProps(dispatch) {
  return {
    play: (): void  => dispatch(play()),
  };
}

interface IHomeProps extends React.Props<any> {
  text: any;
  play:()=>void;
};

class Home extends React.Component<IHomeProps,void> {
 
   render(){ 
      const {text,play}=this.props;
       return <div>
         <p>{text}</p>
         <button onClick={play}>刷新当前时间</button>
       </div>;
   }
   
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);