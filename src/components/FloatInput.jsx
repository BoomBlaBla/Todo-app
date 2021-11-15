import { IconPlus } from '@arco-design/web-react/icon';
import {Component} from 'react';
import {Input} from '@arco-design/web-react';

class FloatInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            isFocused:false
        }
        this.handleFocusAndBlur = this.handleFocusAndBlur.bind(this);
    }

    handleFocusAndBlur(){
        this.setState({isFocused:!this.state.isFocused});
    }

    render(){
        return (<Input 
            value={this.props.value}
            onChange={this.props.onChange}
            onPressEnter={this.props.onPressEnter}
            onFocus={(e)=>{this.handleFocusAndBlur();e.preventDefault();}} 
            onBlur={(e)=>{this.handleFocusAndBlur()}} 
            placeholder="添加任务"
            prefix={this.state.isFocused?(<div style={{display:'flex',height:22 , width:22 , borderRadius:'50%' , border:'2px solid black' ,zIndex:10001}}/>):(<IconPlus style={{height:29,width:29,opacity:1,zIndex:10001}}/>)} 
            style={{height:48 , margin:'0px auto',  width:'80%' , minWidth:500 , backgroundColor:'rgba(115,115,115)' , opacity:0.88 , borderRadius:10, color:'white' , fontSize:19}}/>);
    }
}

export {FloatInput};