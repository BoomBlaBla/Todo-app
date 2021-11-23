import React, { Component } from 'react';
import { Layout, List ,Button ,Divider, Input , Form , Typography, Modal, Space ,DatePicker} from '@arco-design/web-react';
import {Navigation} from './components/Navigation';
import { FloatInput } from './components/FloatInput';
import {ToDoItem} from './components/ToDoItem';
import {StepItem} from './components/StepItem'
import {ScrollBar} from './components/ScrollBar';
import {
    IconCheck,IconDelete,IconPlus,IconMore,IconHome,IconSun,IconStar,IconBulb,IconClockCircle,IconCalendar,IconClose
} from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import {ThemeContext} from './components/Theme.jsx'
import '@arco-design/web-react/dist/css/index.less'
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.idGenerator = 200;
    this.initialized = false;
    this.state = {
      list:[],
      showDetails:false,
      isModalVisible:false,
      selectedKey:'我的一天',
      editingItem:"",
      selectedItemEditingTempField:{},
      selectedListItemIndex:null,
      appSize:{width:window.innerWidth,height:window.innerHeight},
      contextMenuXY:{},
      showContextMenu:false,
      menuItems:[
        {
          key:'我的一天',
          icon:IconSun,
          description:'我的一天',
          theme:'themeBlue',
          list:[{id:1 , important:false , finished:false , content:'我的一天|这是一个测试任务' , steps:[{content:'任务1',finished:false} , {content:'任务2',finished:false}]}],
        },
        {
          key:'重要',
          icon:IconStar,
          description:'重要',
          theme:'themePink',
          list:[{id:1 , important:false , finished:false , content:'重要|这是一个测试任务' , steps:[{content:'任务1',finished:false}]}],
        },
        {
          key:'任务',
          icon:IconHome,
          description:'任务',
          theme:'themeGreen',
          list:[{id:1 , important:false , finished:false , content:'任务|这是一个测试任务' , steps:[]}],
        }
      ],
      scrollBarConfig:
      {
        offsetY:0 ,
        contentHeight:0,
        visibleHeight:0,
      }
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.deleteFromList = this.deleteFromList.bind(this);
    this.handleFinishedRadioClick = this.handleFinishedRadioClick.bind(this);
    this.handleStarRadioClick = this.handleStarRadioClick.bind(this);
    this.updateScrollBar = this.updateScrollBar.bind(this);
    this.handleStepItemClick = this.handleStepItemClick.bind(this);
    this.handleStepContentChange = this.handleStepContentChange.bind(this);
    this.addNewStep = this.addNewStep.bind(this);
    this.deleteFromList = this.deleteFromList.bind(this);
    this.addToList = this.addToList.bind(this);
    this.moveToList = this.moveToList.bind(this);
    this.listRef = React.createRef();
    this.stepInputRef = React.createRef();
  }

  componentDidMount(){
    var repaintScrollBar = null ;
    document.getElementById("list-container").addEventListener('wheel',(e)=>{
      let delta = -e.wheelDelta/9;
      let myList = document.getElementsByClassName("app-myList")[0];
      if(!repaintScrollBar){
        repaintScrollBar = setTimeout(()=>{
          const newScrollTop = myList.scrollTop+delta;
          myList.scrollTo(0 , newScrollTop);
          this.updateScrollBar();
          repaintScrollBar = null ;
        },15)
      }
    } ,{passive:false});
    this.handleMenuClick(this.state.menuItems[0].key);

    var resizeTimeOut = null ;
    window.addEventListener('resize',()=>{
      if(!resizeTimeOut){
        resizeTimeOut = setTimeout(()=>{
          const newAppSize = {width : window.innerWidth<800?800:window.innerWidth , height:window.innerHeight<600?600:window.innerHeight}
          this.setState({appSize:newAppSize});
          resizeTimeOut = null;
        },60);
      }
    },false);
    

    document.onselectstart = ()=>{return false;}
    document.oncontextmenu = (e)=>{
      let index ;
      let taskClicked = false;
      let stepClicked = false;
      for(let domNode of e.path){
        if(domNode.classList){
          domNode.classList.forEach((clz)=>{
            if(clz == 'task-item') {
              taskClicked = true;
            }
            if(clz == 'step-item'){
              stepClicked = true;
            }
          })
          if(stepClicked || taskClicked){
            index = parseInt(domNode.getAttribute("index"));
            break;
          }
        }
      }
      const ccontextMenu = ()=>{
        if(taskClicked){
          return (<div class="menu-container">
            <div class="menu-item" onClick={()=>this.moveToList(index , '我的一天')}>添加到我的一天</div>
            <div class="menu-item" onClick={(e)=>{console.log("重要")}}>标记为重要</div>
            <div class="menu-item" onClick={(e)=>{console.log("已完成")}}>标记为已完成</div>
            <Divider/>
            <div class="menu-item" onClick={(e)=>{
              this.deleteFromList(index);
              console.log(index);
              this.setState({showContextMenu:false});
            }}>删除任务</div>
          </div>
        )}
        else if(stepClicked){
          return (<div class="menu-container">
            <div class="menu-item" onClick={()=>{}}>标记为完成</div>
            <div class="menu-item" onClick={()=>{
              this.deleteFromList(index);
              this.setState({showContextMenu:false});
            }}>删除步骤</div>
          </div>)
        }
        else return (<></>)
      }
      this.setState({contextMenu:ccontextMenu , contextMenuXY:{
        clientX:e.clientX,
        clientY:e.clientY
      } , showContextMenu:taskClicked||stepClicked});
      return false;
    }
    document.addEventListener('click',(e)=>{
      this.setState({showContextMenu:false})
    });
  }
  
  getCurrentMenuItem(){
    return this.state.menuItems.find((item)=>{if(item.key == this.state.selectedKey) return item})
  }

  getCurrentItem(){
    return this.state.list[this.state.selectedListItemIndex];
  }

  updateScrollBar(){
    const listWrapperDom = this.listRef.current.dom.children[0];
    this.setState({
      scrollBarConfig:
      {
        offsetY:listWrapperDom.scrollTop,
        contentHeight:listWrapperDom.scrollHeight,
        visibleHeight:listWrapperDom.clientHeight,
      }
    });
  }

  handleMenuClick(key){
    let newMenuItems = this.state.menuItems;
    if(this.initialized){
      newMenuItems = this.state.menuItems.map((menuItem)=>{
        if(menuItem.key===this.state.selectedKey) menuItem.list = this.state.list;
        return menuItem;
      });
    }
    const item = newMenuItems.find((menuItem)=>{if(menuItem.key === key) return true});
    this.setState({selectedKey:key , 
      menuItems:newMenuItems,
      list:item==null?[]:item.list,
      isModalVisible:false , selectedListItemIndex:null ,
      showDetails:false , offTop:10 , contentHeight:648},this.updateScrollBar);
    this.initialized = true;
  }

  handleStepItemClick(index){
    const list = this.state.list;
    const steps = list[this.state.selectedListItemIndex].steps || [];
    if(index<steps.length){
      steps[index].finished = !steps[index].finished;
      list[this.state.selectedListItemIndex].steps = steps ;
      this.setState({list:list});
    }
  }

  handleStepContentChange(val,index){
    const list = this.state.list;
    const steps = list[this.state.selectedListItemIndex].steps || [];
    if(index < steps.length){
      steps[index].content = val;
      list[this.state.selectedListItemIndex].steps = steps;
      this.setState({list:list});
    }
  }

  addNewStep(){
    const newList = this.state.list; 
    const selectedItem = newList[this.state.selectedListItemIndex];
    selectedItem.steps = selectedItem.steps || [];
    const val = this.state.newStepContent;
    if(val && val.length>0){
      selectedItem.steps.push({content:val , finished:false});
      this.setState({list:newList});
    }
  }

  handleListItemClick(aIndex,e){
    const newSelectedItemEditingTempField = JSON.parse(JSON.stringify(this.state.list[aIndex]));//需要深拷贝
    if(this.state.selectedListItemIndex===aIndex)this.setState({showDetails:!this.state.showDetails , selectedItemEditingTempField:newSelectedItemEditingTempField});
    else this.setState({selectedListItemIndex:aIndex , selectedItemEditingTempField:newSelectedItemEditingTempField, showDetails:true});
    e.preventDefault();
  }

  handleStarRadioClick(aIndex){
    this.state.list[aIndex].important = !this.state.list[aIndex].important;
    this.setState({list:this.state.list});
  }

  handleFinishedRadioClick(aIndex){
    this.state.list[aIndex].finished = !this.state.list[aIndex].finished;
    this.setState({list:this.state.list});
  }

  //修改主题
  switchTheme(index,theme){
    this.state.menuItems[index].theme = theme;
    this.setState({menuItems:this.state.menuItems});
  }

  switchState(){

  }
  
  deleteFromList(aIndex){
    let listItem = this.state.list[aIndex];
    const newMenuItems = this.state.menuItems;
    const menu = newMenuItems.find((item)=>{if(item.key == this.state.selectedKey) return item});
    const mList = menu.list.filter((item,index)=>{return index != aIndex}) || [];
    menu.list = mList;
    this.setState({menuItems:newMenuItems, list:mList});
    return listItem;
  }

  addToList(item , mKey){
    const newMenuItems = this.state.menuItems;
    const menu = this.state.menuItems.find((item)=>{if(item.key == mKey) return item;})
    const newList = [item].concat(menu.list);
    menu.list = newList;
    this.setState({menuItems:newMenuItems});
  }

  moveToList(aIndex , mKey){
    const item = this.deleteFromList(aIndex);
    this.addToList(item , mKey);
  }

  addNewItemToList(){
    if(this.state.editingItem===null || this.state.editingItem.length==0) return ;
    let newList = [{id:this.idGenerator++,content:this.state.editingItem, steps:[] , important:false, finished:false}].concat(this.state.list);
    this.setState({list:newList , editingItem:"" , selectedListItemIndex:this.state.selectedListItemIndex+1 } , this.updateScrollBar);
  }

  render(){
    const theme = ThemeContext[this.getCurrentMenuItem().theme];
    const TextArea = Input.TextArea;
    const FormItem = Form.Item;
    const ContextMenu = this.state.contextMenu;
    const Text = Typography.Text;
    const selectedListItem = this.state.selectedListItemIndex==null || this.state.list[this.state.selectedListItemIndex] || {};

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
        <Layout.Content style={{overflowY:"hidden"}} id="app-main-content">
          <div style={{height:this.state.appSize.height-10 ,padding:'5px 32px', position:'relative' , backgroundImage:theme.panelBackgroundImage}} class="task-list-container" id="list-container">
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
                    className="task-item list-item-normal"
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
            <ScrollBar offsetY={this.state.scrollBarConfig.offsetY} visibleHeight={this.state.scrollBarConfig.visibleHeight} contentHeight={this.state.scrollBarConfig.contentHeight} target={'dsa'}/>
          </div>
        </Layout.Content>
        <Layout.Sider className="right-sider" style={{display:(this.state.showDetails?'':'none'), minWidth:280 , height:this.state.appSize.height-1 , overflow:'hidden hidden'}} >
          <div style={{padding:'0px 12px 8px 12px'}}>
          <ToDoItem finished={selectedListItem.finished} important={selectedListItem.important} steps={selectedListItem.steps} 
            fillColor={theme.panelBackgroundColor}
            editable={this.state.showDetails}
            index={this.state.selectedListItemIndex}
            showStepInfo={false}
            onFinishedRadioClick={this.handleFinishedRadioClick}
            onStarRadioClick={this.handleStarRadioClick}
            onContentChange={(val,updateToApp)=>{
              let newSelectedItemEditingTempField = this.state.selectedItemEditingTempField;
              newSelectedItemEditingTempField.content = val ;
              if(updateToApp===true){
                let newList = this.state.list;
                newList[this.state.selectedListItemIndex].content = val ;
                this.setState({list:newList , selectedItemEditingTempField:newSelectedItemEditingTempField});
              }
              else {
                this.setState({selectedItemEditingTempField:newSelectedItemEditingTempField});
              }
            }}
            content={this.state.selectedItemEditingTempField.content} deadline="2021-11-01"/>
          <Space/>
          <div style={{padding:'20px 10px' , border:'1px solid rgb(221 210 210)'}}>
            <List
              split={false}
              dataSource={selectedListItem.steps}
              hoverable={true}
              noDataElement={<></>}
              render={(step,index)=>{
                return (<StepItem
                  className="step-item"
                  style={{fontSize:'12px' , padding:'3px 0px'}}
                  fillColor={theme.panelBackgroundColor}
                  content={step.content}
                  finished={step.finished}
                  index={index}
                  onClick={this.handleStepItemClick}
                  onChange={this.handleStepContentChange}
                />)
              }}
            />
            <div>
              <div onClick={(e)=>{
                  if(!this.state.editingNewStep){
                    this.setState({editingNewStep:true},()=>{
                        if(this.stepInputRef.current)this.stepInputRef.current.focus();
                      })
                }}} 
                style={{display:!this.state.editingNewStep?'':'none'}}>
                <span style={{color:'rgb(53,128,199)'}}><IconPlus style={{marginRight:28}}/>下一步</span>
              </div>
              <div style={{display:this.state.editingNewStep?'':'none'}}>
                <StepItem
                  forwardedRef={this.stepInputRef}
                  finished={false}
                  content={this.state.newStepContent || ""}
                  onChange={(val)=>{
                    this.setState({newStepContent:val});
                  }}
                  onPressEnter={(e)=>{
                    this.addNewStep();
                    this.setState({newStepContent:""});
                  }}
                  onBlur={(e)=>{
                    this.addNewStep();
                    this.setState({
                      newStepContent:"",
                      editingNewStep:false,
                    })
                  }}/>
              </div>
            </div>
          </div>
          <Space/>
          <div>
            <div style={{padding:'20px 20px' , border:'1px solid rgb(221 210 210)' , color:'rgb(53,128,199)'}} className="flex-row">
              <IconSun/>
              <Text style={{fontSize:18 , color:'inherit'}}>添加到我的一天</Text>
              <IconClose style={{ height:20 , width:20 , marginLeft:20}} onClick={(e)=>{this.deleteFromList()}}></IconClose>
            </div>
          </div>
          <Space/>
          <div style={{padding:'20px 20px 20px 0px' , border:'1px solid rgb(221 210 210)'}}>
            <Form initialValues={selectedListItem} onValuesChange={(values)=>{
              console.log(values);
              // const newList = this.state.list;
              // newList[this.state.selectedListItemIndex] = values;
              // this.setState({list:newList});
            }}>
                <FormItem label={<IconClockCircle />} value={selectedListItem.remindDate} onChange={(val)=>{selectedListItem.remindDate = val;}}>
                  <DatePicker value={selectedListItem.remindDate}
                    triggerElement={<Input placeholder="提醒我"/>}/>
                </FormItem>

                <FormItem label={<IconCalendar/>} value={selectedListItem.deadline} onChange={(val)=>{selectedListItem.deadline = val;}}>
                  <DatePicker value={selectedListItem.deadline}
                    triggerElement={<Input placeholder="截至日期"/>}/>
                </FormItem>
                <FormItem label={' '} value={selectedListItem.backMem} onChange={(val)=>{selectedListItem.backMem = val;}}>
                    <TextArea placeholder="添加备注" style={{height:50 , width:"100%"}} value={selectedListItem.memory}/>
                </FormItem>
            </Form>
          </div>
          </div>
        </Layout.Sider>
        <ScrollBar />
        </Layout>
        <Modal style={{position:'fixed' , left:this.state.contextMenuXY.clientX,top:this.state.contextMenuXY.clientY ,width:180 ,padding:'8px 14px' }} simple={true} footer={null} mask={false} visible={this.state.showContextMenu}>
            <ContextMenu/>
        </Modal>
      </div>)
  };
}
export default App;