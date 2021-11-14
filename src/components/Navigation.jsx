import { Menu } from '@arco-design/web-react';
import {Component} from 'react'
import {ThemeContext} from './Theme';
const MenuItem = Menu.Item;

class Navigation extends Component{
    constructor(props){
        super(props);
    }
    /*
    [
        {
            key:keyVal
            icon:iconVal
            description:descriptionVal
            theme:themeStrVal
        },
        ....

    ]

    */

    render(){
        const selectedKey = this.props.selectedKey;
        const menuItems = this.props.menuItems; 
        const context = ThemeContext;
        
        let matchedTheme = null ;
        this.props.menuItems.forEach((item)=>{if(item.key==selectedKey) matchedTheme = context[item.theme];})
        const iconChosenColor= {color:matchedTheme.panelBackgroundColor}; 
        const menuChosenStyle = {borderLeft:'2px solid' , borderColor:matchedTheme.panelBackgroundColor , color:matchedTheme.panelBackgroundColor , fontWeight:'bold'};
        
        const generatedMenuItems = menuItems.map((item)=>{
            return (<MenuItem key={item.key} style={selectedKey===item.key?menuChosenStyle:{}}>
                <><item.icon style={selectedKey===item.key?iconChosenColor:{}}></item.icon> {item.description}</>
            </MenuItem>)
        });
        return (
            <Menu style={this.props.style}
                onClickMenuItem={this.props.onClickMenuItem}
                defaultSelectedKeys={this.props.selectedKey}>
                {generatedMenuItems}
            </Menu>
        );
    }
}
export {Navigation}