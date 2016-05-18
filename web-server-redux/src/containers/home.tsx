import * as React from 'react';
import {connect} from 'react-redux';
import {play,getList} from '../actions/player';

function mapStateToProps(state) {    
   return state.player
}

function mapDispatchToProps(dispatch) {
  return {
    play: (): void  => dispatch(play()),
    getList:():void=> dispatch(getList())
  };
}

interface IHomeProps extends React.Props<any> {
  text: any;
  items:Array<any>;
  play:()=>void;
  getList:()=>Array<any>
};

class Home extends React.Component<IHomeProps,void> {
 
   componentDidMount(){
       this.props.getList();
   }
   render(){ 
      const {text,play,items,getList}=this.props;      
       return <div>
         <p>{text}</p>
         <ul>
         {items.map(d=>{
             return <li key={d.a}>{d.a}</li>;
         })}
         </ul>
         <button onClick={play}>刷新当前时间</button>
         <button onClick={getList}>刷新列表</button>
       </div>;
   }
   
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);