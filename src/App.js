import React, { Component } from 'react';
import { Layout, List ,Button , Input , Form , Typography, Modal, Space ,DatePicker} from '@arco-design/web-react';
import {Navigation} from './components/Navigation';
import { FloatInput } from './components/FloatInput';
import {ToDoItem} from './components/ToDoItem';
import {
    IconMore,IconHome,IconSun,IconStar,IconBulb,IconClockCircle,IconCalendar,IconClose
} from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import {ThemeContext} from './components/Theme.jsx'
import '@arco-design/web-react/dist/css/index.less'
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.idGenerator = 200;
    this.state = {
      list:[{id:1 , important:false , finished:false , content:'重要|这是一个测试任务' , steps:['任务1']}],
      showDetails:false,
      isModalVisible:false,
      selectedKey:'0',
      editingItem:"",
      selectedListItemIndex:null,
      menuItems:[
        {
          key:'0',
          icon:IconSun,
          description:'我的一天',
          theme:'themeBlue',
          list:[{id:1 , important:false , finished:false , content:'我的一天|这是一个测试任务' , steps:['任务1']}],
        },
        {
          key:'1',
          icon:IconStar,
          description:'重要',
          theme:'themePink',
          list:[{id:1 , important:false , finished:false , content:'重要|这是一个测试任务' , steps:['任务1']}],
        },
        {
          key:'2',
          icon:IconHome,
          description:'任务',
          theme:'themeGreen',
          list:[{id:1 , important:false , finished:false , content:'任务|这是一个测试任务' , steps:['任务1']}],
        }
      ]
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.deleteFromList = this.deleteFromList.bind(this);
    this.handleFinishedRadioClick = this.handleFinishedRadioClick.bind(this);
    this.handleStarRadioClick = this.handleStarRadioClick.bind(this);
    this.listRef = React.createRef();
  }

  componentDidMount(){
    document.getElementById("list-container").addEventListener('wheel',(e)=>{
      let delta = -e.wheelDelta / 9;
      e.preventDefault();
      let myList = document.getElementsByClassName("app-myList")[0];
      myList.scrollTo(0 , myList.scrollTop+delta);
    } ,{passive:false});
    this.handleMenuClick(this.state.menuItems[0].key);
  }

  handleMenuClick(key){
    const newMenuItems = this.state.menuItems.map((menuItem)=>{
      if(menuItem.key===this.state.selectedKey) menuItem.list = this.state.list;
      return menuItem;
    });
    this.setState({menuItems:newMenuItems});
    const items = this.state.menuItems.find((menuItem)=>{if(menuItem.key === key) return true});
    this.setState({selectedKey:key , list:items==null?[]:items.list, 
      isModalVisible:false , selectedListItemIndex:null,
      showDetails:false , offTop:10 , contentHeight:650});
  }

  handleListItemClick(aIndex){
    this.setState({selectedListItemIndex:aIndex , showDetails:!this.state.showDetails});
  }

  handleStarRadioClick(aIndex){
    const newList = this.state.list.map((item,index)=>{
      if(index===aIndex){
        item.important = !item.important;
      }
      return item;
    })
    this.setState({list:newList});
  }

  handleFinishedRadioClick(aIndex){
    const newList = this.state.list.map((item,index)=>{
      if(index===aIndex){
        item.finished = !item.finished;
      }
      return item;
    })
    this.setState({list:newList});
  }

  //修改主题
  switchTheme(index,theme){
    var menuItems = this.state.menuItems;
    menuItems[index].theme = theme;
    this.setState({menuItems:menuItems});
  }
  
  deleteFromList(aIndex){
    
  }

  addNewItemToList(){
    if(this.state.editingItem===null || this.state.editingItem.length==0) return ;
    let newList = [{id:this.idGenerator++,content:this.state.editingItem, steps:[]}].concat(this.state.list);
    this.setState({list:newList , editingItem:""});
  }


  render(){
    const theme = ThemeContext[this.state.menuItems[this.state.selectedKey].theme];
    const TextArea = Input.TextArea;
    const FormItem = Form.Item;
    const Text = Typography.Text;
    const selectedListItem = this.state.selectedListItemIndex!=null && this.state.list[this.state.selectedListItemIndex];
    const themeBlocks = Object.entries(ThemeContext).map((entry)=>{
      return (<Button style={{ width:50 , height:50 , backgroundImage:entry[1].panelBackgroundImage}} 
      onClick={()=>{
        const newMenuItems = this.state.menuItems.map(
          (item)=>{
            if(item.key===this.state.selectedKey)
              item.theme = entry[0];
            return item;
        });
        this.setState({menuItems:newMenuItems});
      }}></Button>);
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
              style={{marginTop:this.state.offTop,paddingTop:150,maxHeight:this.state.contentHeight,paddingBottom:90}}
              className="app-myList"
              dataSource={this.state.list}
              listRef={this.listRef}
              render={(item,index)=>(
                  <ToDoItem style={{minWidth:'420px'}}
                    index={index} key={this.state.selectedKey+'-'+index} 
                    important={item.important} finished={item.finished}
                    steps={item.steps} content={item.content} deadline="2021-11-01"
                    onClick={this.handleListItemClick} fillColor={theme.panelBackgroundColor}
                    onFinishedRadioClick={this.handleFinishedRadioClick}
                    onStarRadioClick={this.handleStarRadioClick}/>
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
              escToExit
              maskClosable
              footer={null}
              mask={false}
              style={{position:'absolute' , top:'64px' , right:'8px' , width:'300px'}}
            >
              <Space wrap size={[12, 18]}>
                {themeBlocks}
              </Space>
            </Modal>
            <div style={{display:'flex' , justifyContent:'center', alignItems:'center', height:74 , position:'absolute' , bottom:0 , right:0 , left:0 , opacity:1}}>
              <FloatInput value={this.state.editingItem}
                onChange={(val)=>{this.setState({editingItem:val})}} onPressEnter={(e)=>{
                this.addNewItemToList();
              }}/>
            </div>
          </div>
        </Layout.Content>
        <Layout.Sider style={{display:(this.state.showDetails?'':'none'), width:280}}>
          <ToDoItem finished={selectedListItem.finished} important={selectedListItem.important} steps={selectedListItem.steps} 
            fillColor={theme.panelBackgroundColor}
            style={{width:'280px'}}
            editable={this.state.showDetails}
            index={this.state.selectedListItemIndex}
            onFinishedRadioClick={this.handleFinishedRadioClick}
            onStarRadioClick={this.handleStarRadioClick}
            onContentChange={(val)=>{
              const newList = this.state.list.map((item,index)=>{
                if(index==this.state.selectedListItemIndex)
                  item.content = val;
                return item;
              });
              this.setState({list:newList});
            }}
            content={selectedListItem.content} deadline="2021-11-01"/>
          <div style={{marginTop:50 , padding:'0px 10px'}}>
            <Form>
                <FormItem label={<IconSun style={{color:'rgb(67,106,242)'}}/>}>
                    <Text style={{color:'rgb(67,106,242)' ,fontSize:18}}>添加到我的一天</Text>
                    <IconClose style={{color:'rgb(67,106,242)' , height:20 , width:20 , marginLeft:20}} onClick={(e)=>{this.deleteFromList()}}></IconClose>
                </FormItem>

                <FormItem label={<IconClockCircle />}>
                  <DatePicker value={selectedListItem.remindDate}
                    triggerElement={<Input placeholder="提醒我"/>}/>
                </FormItem>

                <FormItem label={<IconCalendar/>}>
                  <DatePicker value={selectedListItem.deadline}
                    triggerElement={<Input placeholder="截至日期"/>}/>
                </FormItem>
                <FormItem label={' '}>
                    <TextArea placeholder="添加备注" style={{height:50 , width:"100%"}} value={selectedListItem.memory}/>
                </FormItem>
            </Form>
          </div>
        </Layout.Sider> 
        </Layout>
      </div>)
  };
}
export default App;
