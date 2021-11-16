import { IconPlus } from '@arco-design/web-react/icon';
import React , {Component} from 'react';
import {Input} from '@arco-design/web-react';

class FloatInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            isFocused:false
        }
        this.inputRef = React.createRef();
        this.handleFocusAndBlur = this.handleFocusAndBlur.bind(this);
        this.handlePressEnter = this.handlePressEnter.bind(this);
    }

    handleFocusAndBlur(){
        this.setState({isFocused:!this.state.isFocused});
    }
    
    handlePressEnter(){
        this.props.onPressEnter();
        this.inputRef.blur();
    }

    render(){
        return (<Input 
            className="no-border"
            value={this.props.value}
            onChange={this.props.onChange}
            onPressEnter={this.handlePressEnter}
            onFocus={(e)=>{this.handleFocusAndBlur();e.preventDefault();}} 
            onBlur={(e)=>{this.handleFocusAndBlur()}} 
            placeholder="添加任务"
            ref={(ref)=>{this.inputRef=ref}}
            prefix={this.state.isFocused?(<div style={{display:'flex',height:22 , width:22 , borderRadius:'50%' , border:'2px solid black' ,zIndex:10001}}/>):(<IconPlus style={{height:29,width:29,opacity:1,zIndex:10001}}/>)} 
            style={{height:48 , margin:'0px auto',  width:'80%' , minWidth:500 , backgroundColor:'rgba(115,115,115)' , opacity:0.88 , borderRadius:10, color:'white' , fontSize:19}}/>);
    }
}

export {FloatInput};