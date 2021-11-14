import React , {Component} from 'react';

//实现一个流式Panel
class Panel extends Component{
    constructor(props){
        super(props);
        this.state = props;
    }

    updateContent(index , newValue){
        if(this.state.splited){
            let contents = this.state.contents ;
            contents[index] = newValue;
            this.setState({contents:contents});
        }
        else this.setState({content:newValue});
    }

    closeSplited(index){
        if(this.state.splited==true){
            this.setState({splited:false})
            this.updateContent(index , this.state.contents[index]);
        }
    }

    render(){
        const splited = this.props.splited;
        const cols = this.props.cols ;
        const contents = this.props.contents; 
        let componentRet = null ;
        if(splited){
            let coms = [];
            for(let index = 0 ; index < cols ; index++)
                coms.push(<div style={{display:'inline-block' , width:100/cols+'%' , height:this.props.style.height}}>{contents[index]}</div>)
            componentRet = (<div className={"flex-row "+this.props.className} style={this.props.style} >
                    {coms}
                </div>)
        }
        else {
            componentRet = (
                <div className={this.props.className} style={this.props.style}>
                    {this.props.content}
                </div>
            )
        } 
        return componentRet;
    }
}