import {Component} from 'react';

//自定义滚动条
class ScrollBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const props = this.props;
        return (<div style={{position:'absolute' , right:3 , top:0 , height:window.innerHeight , display:props.visibleHeight < props.contentHeight?'flex':'none' , padding:'1px 0px'}}>
            <div style={{height:props.visibleHeight*window.innerHeight/props.contentHeight , width:3 , marginTop:props.offsetY*window.innerHeight/props.contentHeight, backgroundColor:'rgba(25,25,25,0.52)' , borderRadius:2}}></div>
        </div>)
    }
}

export {ScrollBar};