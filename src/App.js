import React, { Component } from 'react';
import { Layout, List ,Button , Input , Form , Typography, Modal, Grid } from '@arco-design/web-react';
import {Navigation} from './components/Navigation';
import { FloatInput } from './components/FloatInput';
import {ToDoItem} from './components/ToDoItem';
import {
    IconMore,IconHome,IconSun,IconStar,IconBulb,IconClockCircle,IconCalendar
} from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import {ThemeContext} from './components/Theme.jsx'
import '@arco-design/web-react/dist/css/index.less'
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      list:props.list===[{id:1 , content:'这是一个测试任务' , steps:['任务1']}],
      showDetails:false,
      isModalVisible:false,
      offTop:160,
      contentHeight:500 , 
      selectedKey:0,
      selectedListItem:{id:1 , steps:['这是我的一天#任务1'] , content:'这是我的一天'},
      menuItems:[
        {
          key:'0',
          icon:IconSun,
          description:'我的一天',
          theme:'themeBlue'
        },
        {
          key:'1',
          icon:IconStar,
          description:'重要',
          theme:'themePink'
        },
        {
          key:'2',
          icon:IconHome,
          description:'任务',
          theme:'themeGreen'
        }
      ]
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.listRef = React.createRef();
  }

  componentDidMount(){
    document.getElementById("list-container").addEventListener('wheel',(e)=>{
      let delta = -e.wheelDelta / 9;
      e.preventDefault();
      if(this.state.offTop<11){
        let myList = document.getElementsByClassName("app-myList")[0];
        if(delta>0 || myList.scrollTop > 0){ 
          myList.scrollTo(0 , myList.scrollTop+delta);
          return ;
        }
      }
      let newOffTop = this.state.offTop - delta , newHeight = this.state.contentHeight + delta;      
      if(newOffTop>160) {
        newOffTop = 160;
        newHeight = 500;
      }
      else if(newOffTop<10) {
        newOffTop = 10;
        newHeight = 650;
      }
      this.setState({offTop:newOffTop , contentHeight:newHeight});
    } ,{passive:false});
  }

  handleMenuClick(key){
    let items = [] ;
    let cnt = 10;
    switch(key){
      case '0':
        while(cnt-->0)items.push({id:1 , steps:['这是我的一天#任务1'] , content:'这是我的一天'});
        break;
      case '1':
        while(cnt-->0)items.push({id:1 , steps:['这是重要的任务#任务1'] , content:'这是重要的任务'});
        break;
      case '2':
        while(cnt-->0)items.push({id:1 , steps:['这是所有任务'] , content:'这是所有任务'});
        break;
      default:break;
    }
    this.setState({selectedKey:key , list:items , showDetails:false , offTop:160 , contentHeight:500});
  }

  handleListItemClick(ele){
    this.setState({selectedListItem:ele , showDetails:!this.state.showDetails});
  }

  //修改主题
  switchTheme(index,theme){
    var menuItems = this.state.menuItems;
    menuItems[index].theme = theme;
    this.setState({menuItems:menuItems});
  }

  render(){
    const theme = ThemeContext[this.state.menuItems[this.state.selectedKey].theme];
    const TextArea = Input.TextArea;
    const FormItem = Form.Item;
    const Text = Typography.Text;
    const Row = Grid.Row;
    const Col = Grid.Col;
    const selectedListItem = this.state.selectedListItem===null?{}:this.state.selectedListItem;
    const cols = Object.values(ThemeContext).map((tv)=>{
      return (<Col span={4}><div style={{display:'inline-block' , width:50 , height:50 , backgroundImage:tv.panelBackgroundImage}}></div></Col>);
    })
    return (
      <div className="App">
        <Layout>
        <Layout.Sider>
          <div style={{height:30 , color:'rgb(115,115,115)'}}>
            <span style={{marginLeft:15}}>Fake ToDo by YZC</span>
          </div>
          <Navigation style={{width:200}} 
            menuItems={this.state.menuItems}
            onClickMenuItem={this.handleMenuClick} 
            selectedKey={this.state.selectedKey}/>
        </Layout.Sider>
        <Layout.Content>
          <div style={{position:'relative' , backgroundImage:theme.panelBackgroundImage}} class="task-list-container" id="list-container">
            <div style={{display:'flex' , alignItems:'center' , height:'132px' , position:'absolute' , top:'0px' , right:'0px' , left:'0px' , backgroundColor:theme.panelBackgroundColor , opacity:'0.92456'}}>
              <span style={{marginLeft:'40px'}}><IconHome style={{height:'40px', width:'40px',color:'white'}}></IconHome><span style={{color:'white' , fontSize:'39px', fontWeight:'bold' , marginLeft:'23px'}}>任务</span></span>
            </div>
            <List hoverable={true}
              bordered={false}
              split={false}
              style={{marginTop:this.state.offTop , maxHeight:this.state.contentHeight , paddingBottom:90}}
              className="app-myList"
              dataSource={this.state.list}
              listRef={this.listRef}
              render={(item,index)=>(
                  <ToDoItem key={this.state.selectedKey+'-'+index} finished={false} important={false} steps={item.steps}
                    onClick={this.handleListItemClick} fillColor={theme.panelBackgroundColor}
                    content={item.content} deadline="2021-11-01"/>
                )} 
            />
            <Button icon={<IconBulb style={{color:'white'}}/>}
              style={{borderRadius:7,position:'absolute' , right:'63px', top:'28px' ,zIndex:'10000' ,width:30,height:30,backgroundColor:'rgba(25,25,25,0.56)'}}
              onClick={(e)=>{this.setState({showDetails:!this.state.showDetails})}}
            />
            <Button icon={<IconMore style={{color:'white'}}/>}
              style={{borderRadius:7,position:'absolute' , right:'16px' , top:'28px' , zIndex:'10000',width:30,height:30,backgroundColor:'rgba(25,25,25,0.56)'}}
              onClick={(e)=>{this.setState({isModalVisible:!this.state.isModalVisible})}}
            />
            <Modal
              title="主题"
              className="theme-modal-box"
              visible={this.state.isModalVisible}
              footer={null}
              mask={false}
              style={{position:'absolute' , top:'64px' , right:'8px' , width:'300px'}}
            >
              <Row gutter='1'>
                {cols}
              </Row>
            </Modal>
            <div style={{display:'flex' , justifyContent:'center', alignItems:'center', height:74 , position:'absolute' , bottom:0 , right:0 , left:0 , opacity:1}}>
              <FloatInput onChange={(e)=>{console.log('input changed')}}/>
            </div>
          </div>
        </Layout.Content>
        <Layout.Sider style={{display:(this.state.showDetails?'':'none') , width:300}}>
          <ToDoItem finished={selectedListItem.finished} important={selectedListItem.important} steps={selectedListItem.steps} 
            onClick={this.handleListItemClick} fillColor={theme.panelBackgroundColor}
            content={selectedListItem.content} deadline="2021-11-01"/>
          <Form >
              <FormItem label={<IconSun/>}>
                  <Input placeholder="添加到我的一天"/>
              </FormItem>

              <FormItem label={<IconClockCircle />}>
                  <Input placeholder="提醒我"/>
              </FormItem>

              <FormItem label={<IconCalendar/>}>
                  <Input placeholder="截止日期"/>
              </FormItem>
              <FormItem>
                  <TextArea placeholder="添加备注" style={{height:50 , width:'100%' }}/>
              </FormItem>
          </Form>
        </Layout.Sider> 
        </Layout>
      </div>)
  };
}
export default App;
