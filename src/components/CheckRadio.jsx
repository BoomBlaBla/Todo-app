import React from 'react';
import {IconCheck} from '@arco-design/web-react/icon';
class CheckRadio extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.state = {mouseOver:false}; 
    }

    handleClick(e){
        this.props.onClick(e);
    }

    //只有unchecked时，才会有进出的动态效果
    handleMouseOver(){
        if(this.props.checked===false) this.setState({mouseOver:true});
    }

    handleMouseOut(){
        if(this.props.checked===false) this.setState({mouseOver:false});
    }

    render(){
        const checked = this.props.checked ;
        const mouseOver = this.state.mouseOver;
        const displayVal = (checked || mouseOver) ?'inline':'none';
        const checkedStyle = {height:'26px' , width:'26px' , borderRadius:'50%' , backgroundColor:this.props.fillColor};
        const uncheckedStyle = {color:'rgb(115,115,115)' , borderRadius:'50%' , height:'20px' , width:'20px' , border:'3px solid'};
        return (<span style={checked?checkedStyle:uncheckedStyle} onClick={this.handleClick} onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
                <IconCheck style={{color:checked?'white':'rgb(115,115,115)',display:displayVal  , height:'100%' , width:'100%'}}/>
            </span>)
    }
}
export {CheckRadio};