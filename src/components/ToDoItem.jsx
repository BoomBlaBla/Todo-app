import { List , Input } from '@arco-design/web-react';
import React, {Component} from 'react';
import './ToDoItem.css';
import {CheckRadio} from './CheckRadio';
import {StarRadio} from './StarRadio';

class ToDoItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            editing:false,
            content:props.content,
        }
        this.handleRadioClick = this.handleRadioClick.bind(this);
        this.handleStarClick = this.handleStarClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.updateContentAfterEnter = this.updateContentAfterEnter.bind(this);
        this.inputRef = React.createRef();
    }

    handleRadioClick(e){
        this.props.onFinishedRadioClick(this.props.index);
        e.stopPropagation();
    }

    handleStarClick(e){
        this.props.onStarRadioClick(this.props.index);
        e.stopPropagation();
    }

    handleItemClick(){
        if(this.props.onClick) this.props.onClick(this.props.index);
    }

    updateContent(){
        this.props.onContentChange(this.state.content);
    }

    updateContentAfterEnter(){
        this.updateContent();
        this.inputRef.blur();
    }

    render(){
        const props = this.props;
        const TitleElement = this.props.editable?
                                (<Input ref={(ref)=>{this.inputRef = ref}} 
                                    className="no-border"
                                    style={{textDecoration:props.finished&&!props.editing?'line-through':'' , backgroundColor:'white'}} 
                                    defaultValue={props.content} 
                                    onChange={(val)=>{this.setState({content:val})}}
                                    onPressEnter={this.updateContentAfterEnter}
                                    onBlur={this.updateContent}
                                    />):
                                (<span style={{textDecoration:props.finished?'line-through':''}}>
                                    {props.content}
                                </span>);
        const unfinishedStepIndexs = this.props.steps==null || this.props.steps.find((step,index)=>{
            if(!step.finished){
                return index;
            }
        });
        const current = (unfinishedStepIndexs==null?1:(unfinishedStepIndexs[0]+1));
        return (
            <List.Item key={props.id} className="list-item-normal"
                style={props.style}
                onClick={this.handleItemClick}
                extra={
                    <StarRadio fillColor={props.fillColor} className="star-button" important={props.important} onClick={this.handleStarClick}/>
                }>
                <List.Item.Meta
                    avatar={
                        <CheckRadio fillColor={props.fillColor} checked={props.finished} onClick={this.handleRadioClick}/> 
                    }
                    title={TitleElement}
                    description={props.steps!=null && props.steps.length > 0 && "任务#"+props.steps[0] + ' . 第'+current+'步 , 共'+props.steps.length+'步'}
                />
            </List.Item>
        );
    }
}

export {ToDoItem};