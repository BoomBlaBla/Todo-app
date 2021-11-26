import { List , Input } from '@arco-design/web-react';
import React, {Component} from 'react';
import './ToDoItem.css';
import {CheckRadio} from './CheckRadio';
import {StarRadio} from './StarRadio';
import {IconCalendar , IconCheck} from '@arco-design/web-react/icon';

class ToDoItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            editing:false,
        }
        this.handleRadioClick = this.handleRadioClick.bind(this);
        this.handleStarClick = this.handleStarClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.updateContentToApp = this.updateContentToApp.bind(this);
        this.inputRef = React.createRef();
    }

    handleRadioClick(e){
        this.props.onFinishedRadioClick();
        e.stopPropagation();
    }

    handleStarClick(e){
        this.props.onStarRadioClick();
        e.stopPropagation();
    }

    handleItemClick(e){
        if(this.props.onClick) this.props.onClick(e);
    }

    updateContent(val,updateToApp){
        this.props.onContentChange(val , updateToApp);
    }

    updateContentToApp(){
        this.updateContent(this.inputRef.dom.value , true);
        this.inputRef.blur();
    }

    render(){
        const props = this.props;
        const TitleElement = props.editable?
                                (<Input ref={(ref)=>{this.inputRef = ref}} 
                                    className="no-border"
                                    style={{textDecoration:props.finished&&!props.editing?'line-through':'' , backgroundColor:'white'}} 
                                    value={props.content}
                                    onChange={(val)=>{this.updateContent(val , false)}}
                                    onPressEnter={this.updateContentToApp}
                                    onBlur={this.updateContentToApp}
                                    />):
                                (<span style={{textDecoration:props.finished?'line-through':''}}>
                                    {props.content}
                                </span>);
        const steps = props.steps || [];
        const unfinishedSteps = steps.filter((step)=>{
            return !step.finished;
        }) || [];
        const Icon = unfinishedSteps.length==0?IconCheck:()=>{return (<> . </>)}
        const current = steps.length - unfinishedSteps.length;
        return (
            <List.Item key={'task-'+props.index} {...props}
                onClick={this.handleItemClick}
                extra={
                    <div className="flex-col">
                        <StarRadio fillColor={props.fillColor} className="star-button" important={props.important} onClick={this.handleStarClick}/>
                    </div>
                }>
                <List.Item.Meta
                    avatar={
                        <CheckRadio style={{width:26,height:26}} fillColor={props.fillColor} checked={props.finished} onClick={this.handleRadioClick}/> 
                    }
                    title={TitleElement}
                    description={
                        <div className="task-description">
                            <span className="step-description" style={{display:steps.length > 0 && props.showStepInfo!=false ?'':'none'}}>
                                任务
                                <Icon/>               
                                {'第'+(current)+'步 , 共'+steps.length+'步'}
                            </span>
                            <span className="step-description" style={{color:'rgb(220,40,43)' , display:props.deadline?'':'none'}}>
                                <IconCalendar/>{props.deadline}
                            </span>
                        </div>
                    }
                />
            </List.Item>
        );
    }
}

export {ToDoItem};