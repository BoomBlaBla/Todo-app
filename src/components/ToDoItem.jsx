import { List } from '@arco-design/web-react';
import React, {Component} from 'react';
import './ToDoItem.css';
import {CheckRadio} from './CheckRadio';
import {StarRadio} from './StarRadio';

class ToDoItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            finished:props.finished,
            important:props.important,
            content:props.content,
            steps:props.steps,
            current:0,
            deadline:props.deadline,
        }
        this.handleRadioClick = this.handleRadioClick.bind(this);
        this.handleStarClick = this.handleStarClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleRadioClick(e){
        this.setState({finished : !this.state.finished});
        e.stopPropagation();
    }

    handleStarClick(e){
        this.setState({important : !this.state.important});
        e.stopPropagation();
    }

    handleItemClick(){
        console.log('click');
        this.props.onClick(this.state);
    }

    render(){
        const props = this.props;
        const state = this.state ; 
        return (
            <List.Item key={props.id} className="list-item-normal"
                onClick={this.handleItemClick}
                extra={
                    <StarRadio fillColor={this.props.fillColor} className="star-button" important={state.important} onClick={this.handleStarClick}/>
                }>
                <List.Item.Meta
                    avatar={
                        <CheckRadio fillColor={this.props.fillColor} checked={state.finished} onClick={this.handleRadioClick}/> 
                    }
                    title={
                        <span style={{textDecoration:state.finished?'line-through':''}}>
                            {props.content}
                        </span>
                        }
                    description={props.steps!=null && props.steps.length > 0 && "任务#"+props.steps[0] + ' . 第'+state.current+'步 , 共'+state.steps.length+'步'}
                />
            </List.Item>
        );
    }
}

export {ToDoItem};