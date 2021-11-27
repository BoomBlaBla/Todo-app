import { IconStar, IconStarFill } from "@arco-design/web-react/icon";
import {Component} from 'react'
class StarRadio extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const props = this.props;
        if(props.important){
            return (
                <span onClick={this.props.onClick} className={props.className} style={props.style}>
                    <IconStarFill className="clickable-icon" style={{width:'100%' , height:'100%' , color:this.props.fillColor}}/>
                </span>
            )
        }
        else return (
            <span onClick={this.props.onClick} className={props.className} style={props.style}>
                <IconStar className="clickable-icon" style={{width:'100%' , height:'100%' , color:'rgb(115,115,115)'}}/>
            </span>
        )
    }
}
export {StarRadio};