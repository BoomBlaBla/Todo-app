import {List,Input} from '@arco-design/web-react';
import React , {Component} from 'react'
import {CheckRadio} from './CheckRadio'
class StepItem extends Component{
    constructor(props){
        super(props);
        this.inputRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(){
        this.props.onClick(this.props.index);
    }

    handleChange(val){
        this.props.onChange(val,this.props.index);
    }

    render(){
        const props = this.props;
        const onPressEnter = props.onPressEnter || (()=>{this.inputRef.blur()});
        const onBlur = props.onBlur ;
        const {forwardedRef,...rest} = this.props;
        return (<List.Item key={'step-'+props.index} className={props.className}>
                <List.Item.Meta
                    avatar={
                        <CheckRadio style={{width:24 , height:24}} fillColor={props.fillColor} checked={props.data.finished} onClick={this.handleClick}/>
                    }
                    title={
                        <div style={{paddingBottom:'3px',borderBottom:'2px solid rgb(229,230,235)'}}>
                            <Input className="no-border" ref={(ref)=>{
                                    this.inputRef = ref;
                                    if(forwardedRef) forwardedRef.current=ref;
                                }}
                                style={{textDecoration:props.finished?'line-through':'' , backgroundColor:'inherit', fontSize:'12px' , color:!props.finished?'black':'gray'}} 
                                value={props.data.content}
                                onChange={(val)=>{this.handleChange(val)}}
                                onPressEnter={onPressEnter}
                                onBlur={onBlur}
                            />
                        </div>}
                />
            </List.Item>)
    }
}

export {StepItem};