import { Menu ,Badge } from '@arco-design/web-react';
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
                <div className="flex-row" style={{justifyContent:'space-between'}}>
                    <span><item.icon style={selectedKey===item.key?iconChosenColor:{}}></item.icon> {item.description}</span>
                    <Badge count={item.list.length} dotStyle={{background: 'rgb(231,231,231)', color: '#86909C' }}></Badge>
                </div>
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