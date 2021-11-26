import { List , Button} from '@arco-design/web-react';
import React, {Component} from 'react';
import {CheckRadio} from './CheckRadio';
import {IconCalendar , IconCheck,IconPlus} from '@arco-design/web-react/icon';

class AdviceItem extends Component{
    constructor(props){
        super(props);
        this.handleCheckRadioClick = this.handleCheckRadioClick.bind(this);
        this.handleAddRadioClick = this.handleAddRadioClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.inputRef = React.createRef();
    }

    handleCheckRadioClick(e){
        this.props.onFinishedRadioClick();
        e.stopPropagation();
    }

    handleAddRadioClick(e){
        this.props.onAddRadioClick();
        e.stopPropagation();
    }

    handleItemClick(e){
        if(this.props.onItemClick) this.props.onItemClick(e);
    }

    render(){
        const props = this.props;
        const TitleElement = (<span>
                                {props.content}
                            </span>);
        const steps = props.steps || [];
        const unfinishedSteps = steps.filter((step)=>{
            return !step.finished;
        }) || [];
        const Icon = unfinishedSteps.length==0?IconCheck:()=>{return (<> . </>)}
        const current = steps.length - unfinishedSteps.length;
        return (
            <List.Item key={'advice-'+props.index} className={props.className}
                index={props.index}
                style={props.style}
                onClick={this.handleItemClick}
                extra={
                    <div className="flex-col">
                        <Button icon={<IconPlus />} style={{color:'rgb(0,95,184)',width:28,height:28}} onClick={this.handleAddRadioClick}/>
                    </div>
                }>
                <List.Item.Meta
                    avatar={
                        <CheckRadio style={{width:26,height:26}} fillColor={props.fillColor} checked={props.finished} onClick={this.handleCheckRadioClick}/> 
                    }
                    title={TitleElement}
                    description={
                        <div className="task-description">
                            <span className="step-description" style={{display:steps.length > 0 ?'':'none'}}>
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

export {AdviceItem};