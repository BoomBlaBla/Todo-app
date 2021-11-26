import React from 'react';
import {IconCheck} from '@arco-design/web-react/icon';
class CheckRadio extends React.Component{
    constructor(props){
        super(props);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.state = {mouseOver:false}; 
    }

    //只有unchecked时，才会有进出的动态效果
    handleMouseOver(){
        if(this.props.checked===false) this.setState({mouseOver:true});
    }

    handleMouseOut(){
        if(this.props.checked===false) this.setState({mouseOver:false});
    }

    render(){
        const props = this.props;
        const checked = this.props.checked ;
        const mouseOver = this.state.mouseOver;
        const displayVal = (checked || mouseOver) ?'':'none';
        let style = {};
        style.borderRadius = "50%";
        if(checked){
            style.backgroundColor = props.fillColor;
        }
        else {
            style.color = 'rgb(115,115,115)';
            style.border = '3px solid';
            style.height = props.style.height-6;
            style.width = props.style.width-6;     
        }
        //属性展开
        return (<span {...props} style={{...props.style , ...style}} onClick={this.props.onClick} onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
                <IconCheck className="clickable-icon" style={{color:checked?'white':'rgb(115,115,115)',display:displayVal  , height:'100%' , width:'100%'}}/>
            </span>)
    }
}
export {CheckRadio};