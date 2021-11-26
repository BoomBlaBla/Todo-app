import React, { Component } from 'react';
import { Layout, List ,Button ,Divider, Input , Form , Typography, Modal, Space ,DatePicker} from '@arco-design/web-react';
import {Navigation} from './components/Navigation';
import { FloatInput } from './components/FloatInput';
import {ToDoItem} from './components/ToDoItem';
import {StepItem} from './components/StepItem';
import {AdviceItem} from './components/AdviceItem';
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
      newStep:{content:"",finished:false},
      showContextMenu:false,
      currentValidItem:{},
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
    this.collectUnfinishedTasks = this.collectUnfinishedTasks.bind(this);
    this.findUnfinishedAndExcludedTasks = this.findUnfinishedAndExcludedTasks.bind(this);
    this.getCurrentItem = this.getCurrentItem.bind(this);
    this.getCurrentMenuItem = this.getCurrentMenuItem.bind(this);
    this.getTodayList = this.getTodayList.bind(this);
    this.getValidItem = this.getValidItem.bind(this);
    this.addNewItemToList = this.addNewItemToList.bind(this);
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
      let index ,isAdvice = false;
      let taskClicked = false;
      let stepClicked = false;
      for(let domNode of e.path){
        if(domNode.classList && domNode.classList.contains){
          if(domNode.classList.contains('task-item')) taskClicked=true;
          if(domNode.classList.contains('step-item')) stepClicked=true;
          // domNode.classList.forEach((clz)=>{
          //   if(clz == 'task-item') {
          //     taskClicked = true;
          //   }
          //   if(clz == 'step-item'){
          //     stepClicked = true;
          //   }
          // })
          if(stepClicked || taskClicked){
            index = parseInt(domNode.getAttribute("index"));
            isAdvice = domNode.classList.contains("advice-item");
            break;
          }
        }
      }
      const ccontextMenu = ()=>{
        let targetItem;
        const menuItems = this.state.menuItems;
        const advicedList = this.findUnfinishedAndExcludedTasks();
        const todayList = this.getTodayList();
        const list = this.state.list;
        if(isAdvice){
          targetItem = advicedList[index];
        }
        else targetItem = list[index];
        targetItem = targetItem || {};
        const steps = targetItem.steps ;
        const markImportant = ()=>{
          targetItem.important = !targetItem.important;
          this.setState({menuItem:menuItems});
        }
        const markFinished = ()=>{
          targetItem.finished = !targetItem.finished;
          this.setState({menuItems:menuItems});
        }
        const deleteStep = ()=>{
          const newSteps = steps.splice(index,1);
          targetItem.steps = newSteps;
          this.setState({menuItems:menuItems});
        }
        const markStepFinished = ()=>{
          steps[index].finished = !steps[index].finished;
          this.setState({menuItems:menuItems});
        }
        // const item =
        if(taskClicked){//是列表项，还是建议列表项
          return (<div class="menu-container">
            <div class="menu-item" style={{display:todayList.includes(targetItem)?'none':''}} onClick={()=>this.addToList(targetItem , '我的一天')}>添加到我的一天</div>
            <div class="menu-item" onClick={markImportant}>标记为重要</div>
            <div class="menu-item" onClick={markFinished}>标记为已完成</div>
            <div class="menu-item" style={{display:todayList.includes(targetItem)?'':'none'}} onClick={()=>this.deleteFromList(index , '我的一天')}>从我的一天中删除</div>
            <Divider/>
            <div class="menu-item" onClick={()=>{
              const newMenuItems = this.state.menuItems;
              for(let menu of newMenuItems){
                let lp = menu.list.indexOf(targetItem);
                if(lp>=0) menu.list.splice(lp,1);
              }
              this.setState({menuItems:newMenuItems});
            }}>删除任务</div>
          </div>
        )}
        else if(stepClicked){
          return (<div class="menu-container">
            <div class="menu-item" onClick={markStepFinished}>标记为完成</div>
            <div class="menu-item" onClick={deleteStep}>删除步骤</div>
          </div>)
        }
        else return (<></>)
      }
      this.setState({showContextMenu:taskClicked||stepClicked,
        contextMenu:ccontextMenu , 
        contextMenuXY:{
          clientX:e.clientX,
          clientY:e.clientY
      }});
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

  getTodayList(){
    return this.state.menuItems.find((item)=>{return item.key==='我的一天'}).list;
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

  collectUnfinishedTasks(){
    const unTaskList = [].concat(...this.state.menuItems.map((menuItem)=>{
      if(menuItem.key!=='我的一天')
        return menuItem.list
      else return [];
    }));
    return unTaskList.filter((task)=>{return !task.finished});
  }

  findUnfinishedAndExcludedTasks(){
    const today = this.getTodayList();
    return this.collectUnfinishedTasks().filter((task)=>{
      return !today.includes(task);
    })
  }

  addNewStep(){
    const currentValidItem = this.state.currentValidItem;
    currentValidItem.steps = currentValidItem.steps || [];
    currentValidItem.steps.push(this.state.newStep);
    this.setState({
      currentValidItem:currentValidItem,
      newStep:{
        content:"",
        finished:false,
      }
    });
  }

  getValidItem(aIndex){
    const curSelectedItem = this.state.list[aIndex||this.state.selectedListItemIndex] || {};
    const selectedListItem = this.state.showCurrentItemDetails?this.state.currentItemDetailedInfo:curSelectedItem;
    return selectedListItem;
  }

  handleListItemClick(e,item,test){
    const newSelectedItemEditingTempField = JSON.parse(JSON.stringify(item));//需要深拷贝
    if(this.state.currentValidItem===item || (test&&test()))
      this.setState({
                  trigger:'list',
                  showDetails:!this.state.showDetails,
                  currentValidItem:item,
                  selectedItemEditingTempField:newSelectedItemEditingTempField});
    else this.setState({
                  trigger:'list',
                  selectedItemEditingTempField:newSelectedItemEditingTempField, 
                  currentValidItem:item,
                  showDetails:true});
    e.preventDefault();
  }

  handleStarRadioClick(item){
    item.important = !item.important;
    this.setState({currentValidItem:this.state.currentValidItem});
  }

  handleFinishedRadioClick(item){
    item.finished = !item.finished;
    this.setState({currentValidItem:this.state.currentValidItem});
  }

  //修改主题
  switchTheme(index,theme){
    this.state.menuItems[index].theme = theme;
    this.setState({menuItems:this.state.menuItems});
  }

  switchState(){

  }
  
  deleteFromList(idx,mKey){
    const newMenuItems = this.state.menuItems;
    const menu = this.state.menuItems.find((item)=>{if(item.key == mKey) return item;})
    menu.list.splice(idx,1);
    this.setState({menuItems:newMenuItems});
  }

  addToList(item , mKey){
    const newMenuItems = this.state.menuItems;
    const menu = this.state.menuItems.find((item)=>{if(item.key == mKey) return item;})
    menu.list.splice(0,0,item);
    this.setState({menuItems:newMenuItems});
  }

  moveToList(item , mKey){
    this.deleteFromList(item , mKey);
    this.addToList(item , mKey);
  }

  addNewItemToList(){
    if(this.state.editingItem===null || this.state.editingItem.length==0) return ;
    const newItem = {id:this.idGenerator++,content:this.state.editingItem, steps:[] , important:false, finished:false};
    const newList = this.state.list;
    newList.splice(0,0,newItem);
    if(this.state.selectedKey!=='任务')
      this.state.menuItems.find((mItem)=>{return mItem.key==='任务'}).list.splice(0,0,newItem);
    this.setState({list:newList , editingItem:"" , selectedListItemIndex:this.state.selectedListItemIndex+1 } , this.updateScrollBar);
  }

  render(){
    const theme = ThemeContext[this.getCurrentMenuItem().theme];
    const TextArea = Input.TextArea;
    const FormItem = Form.Item;
    const ContextMenu = this.state.contextMenu;
    const Text = Typography.Text;
    const curSelectedItem = this.state.list[this.state.selectedListItemIndex] || {};
    const selectedListItem = this.state.showCurrentItemDetails?this.state.currentItemDetailedInfo:curSelectedItem;
    const currentMenuItem = this.getCurrentMenuItem();
    const currentValidItem = this.state.currentValidItem;
    const BannerIcon = currentMenuItem.icon;
    const BannerText = currentMenuItem.description;
    const isTodayMenu = currentMenuItem.key ==='我的一天';
    const todayList = this.getTodayList();
    const showAdvices = isTodayMenu&&!this.state.showCurrentItemDetails&&this.state.trigger==='button';
    const mergedList = this.findUnfinishedAndExcludedTasks();
    const alreadyAdded =  isTodayMenu && this.state.list[this.state.selectedListItemIndex]?true:false;
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
    });
    const SiderHeader =()=>{
      if(isTodayMenu && !this.state.showCurrentItemDetails && this.state.trigger!='list')
        return(<>
          <Text>建议</Text>
          <IconClose style={{height:24,width:24,color:'rgb(110,110,110)'}} onClick={()=>{
            this.setState({showDetails:false});
          }}/>
        </>)
      else
          return (<>
            <span></span>
            <IconClose style={{height:24,width:24,color:'rgb(110,110,110)'}} onClick={()=>{
              if(isTodayMenu && this.state.showCurrentItemDetails) this.setState({
                showCurrentItemDetails:false,
                trigger:'button',
              });
              else this.setState({showDetails:false});
            }}/>
          </>)
    }
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
              <span style={{marginLeft:'40px'}}><BannerIcon style={{height:'40px', width:'40px',color:'white'}}/><span style={{color:'white' , fontSize:'39px', fontWeight:'bold' , marginLeft:'23px'}}>{BannerText}</span></span>
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
                    index={index}
                    {...item} fillColor={theme.panelBackgroundColor}
                    onClick={(e)=>{
                      this.handleListItemClick(e,item);
                    }} 
                    onFinishedRadioClick={()=>this.handleFinishedRadioClick(item)}
                    onStarRadioClick={()=>this.handleStarRadioClick(item)}/>
                )} 
            />
            <Button icon={<IconBulb style={{color:'white'}}/>}
              style={{borderRadius:7,position:'absolute' , right:'63px', top:'28px' ,zIndex:'10000' ,width:30,height:30,backgroundColor:'rgba(25,25,25,0.56)'}}
              onClick={(e)=>{
                if(!isTodayMenu) this.setState({currentValidItem:this.state.list[0]||{}})
                  
                this.setState({
                  trigger:'button',
                  showDetails:!this.state.showDetails
                })
                
              }}
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
              style={{position:'absolute' , top:'64px' , right:'8px' , width:'300px'}}>
              <Space wrap size={[12, 18]}>
                {themeBlocks}
              </Space>
            </Modal>
            <div style={{display:'flex' , justifyContent:'center', alignItems:'center', height:74 , position:'absolute' , bottom:0 , right:0 , left:0 , opacity:1}}>
              <FloatInput value={this.state.editingItem}
                onChange={(val)=>{this.setState({editingItem:val})}} 
                onPressEnter={(e)=>{
                  this.addNewItemToList();
              }}/>
            </div>
            <ScrollBar offsetY={this.state.scrollBarConfig.offsetY} visibleHeight={this.state.scrollBarConfig.visibleHeight} contentHeight={this.state.scrollBarConfig.contentHeight} target={'dsa'}/>
          </div>
        </Layout.Content>
        <Layout.Sider className="right-sider" style={{display:(this.state.showDetails?'':'none'), minWidth:300 , height:this.state.appSize.height-1 , overflow:'hidden hidden'}} >
          <div className="flex-row sider-header" style={{justifyContent:'space-between',zIndex:11111,backgroundColor:'white',borderBottom:'1px solid rgb(229,230,235)'}}>
            <SiderHeader/>
          </div>
          <div style={{marginTop:48}}>
          <div className="right-sider-content" style={{display:showAdvices?'':'none'}}>
                <List dataSource={mergedList}
                  render={(item,index)=>{
                    return (<AdviceItem index={index} className="task-item advice-item"
                      {...item}
                      onFinishedRadioClick={()=>{
                        item.finished=true;
                        this.setState({menuItems:this.state.menuItems})
                      }}
                      onAddRadioClick={()=>{
                        todayList.push(item);
                        this.setState({menuItems:this.state.menuItems});
                      }}
                      onItemClick={(e)=>{
                        this.handleListItemClick(e,item,()=>{return true;});
                        this.setState({
                          showDetails:true,
                          currentItemDetailedInfo:item,
                          showCurrentItemDetails:true,
                        })
                      }}
                      />);
                  }}
                />
          </div>
          </div>
          <div className="right-sider-content" style={{display:!showAdvices||this.state.showCurrentItemDetails?'':'none'}}>
          <ToDoItem finished={currentValidItem.finished} important={currentValidItem.important} steps={currentValidItem.steps} 
            fillColor={theme.panelBackgroundColor}
            editable={this.state.showDetails}
            index={currentValidItem.id}
            showStepInfo={false}
            onFinishedRadioClick={()=>this.handleFinishedRadioClick(currentValidItem)}
            onStarRadioClick={()=>this.handleStarRadioClick(currentValidItem)}
            onContentChange={(val,updateToApp)=>{
              let newSelectedItemEditingTempField = this.state.selectedItemEditingTempField;
              newSelectedItemEditingTempField.content = val ;
              if(updateToApp===true){
                currentValidItem.content = val ;
                this.setState({list:this.state.list , selectedItemEditingTempField:newSelectedItemEditingTempField});
              }
              else {
                this.setState({selectedItemEditingTempField:newSelectedItemEditingTempField});
              }
            }}
            content={this.state.selectedItemEditingTempField.content}
            />
          <Space/>
          <div className="steps-container">
            <List
              split={false}
              dataSource={currentValidItem.steps}
              hoverable={true}
              noDataElement={<></>}
              render={(step,index)=>{
                return (<StepItem
                  className="step-item"
                  fillColor={theme.panelBackgroundColor}
                  data={step}
                  index={index}
                  onClick={()=>{
                    step.finished = !step.finished;
                    this.setState({currentValidItem:currentValidItem});
                  }}
                  onChange={(val)=>{
                    step.content = val;
                    this.setState({currentValidItem:currentValidItem});
                  }}
                />)
              }}
            />
            <div className="step-item">
              <div onClick={(e)=>{
                  if(!this.state.editingNewStep){
                    this.setState({editingNewStep:true },()=>{
                        if(this.stepInputRef.current)this.stepInputRef.current.focus();
                      })
                }}} 
                style={{display:!this.state.editingNewStep?'':'none'}}>
                <span style={{color:'rgb(53,128,199)'}}><IconPlus style={{marginRight:28}}/>下一步</span>
              </div>
              <div style={{display:this.state.editingNewStep?'':'none'}}>
                <StepItem
                  forwardedRef={this.stepInputRef}
                  data={this.state.newStep}
                  onChange={(val)=>{
                    this.setState({newStep:{content:val,finished:false}});
                  }}
                  onPressEnter={(e)=>{
                    this.addNewStep();
                  }}
                  onBlur={(e)=>{
                    const cont = this.state.newStep.content;
                    if(cont && cont.length>0)
                      this.addNewStep();
                    this.setState({
                      editingNewStep:false,
                    })
                  }}/>
              </div>
            </div>
          </div>
          <Space/>
          <div>
            <div style={{padding:'20px 20px' , border:'1px solid rgb(221 210 210)' , color:alreadyAdded?'rgb(53,128,199)':'rgb(118,118,118)'}} className="flex-row">
              <IconSun style={{marginRight:20}}/>
              <Text style={{fontSize:17 , color:'inherit'}}>{alreadyAdded?'已添加到我的一天':"添加到我的一天"}</Text>
              <IconClose className="clickable-icon" style={{ height:20 , width:20 , marginLeft:20 , display:alreadyAdded?'':'none'}} onClick={(e)=>{this.deleteFromList(currentValidItem)}}></IconClose>
            </div>
          </div>
          <Space/>
          <div className="border-form-container">
            <Form initialValues={this.state.currentValidItem}>
                <FormItem label={<IconClockCircle />}>
                  <DatePicker value={currentValidItem.remindDate}
                    onChange={(val)=>{currentValidItem.remindDate = val;this.setState({currentValidItem:currentValidItem})}}
                    editable={false}
                    triggerElement={<Input placeholder="提醒我" value={currentValidItem.remindDate}/>}/>
                </FormItem>

                <FormItem label={<IconCalendar/>}>
                  <DatePicker value={currentValidItem.deadline}
                    onChange={(val)=>{currentValidItem.deadline = val;this.setState({currentValidItem:currentValidItem})}}
                    editable={false}
                    triggerElement={<Input placeholder="截至日期" value={currentValidItem.deadline}/>}/>
                </FormItem>
                <FormItem label={' '} value={currentValidItem.backMem}>
                    <TextArea placeholder="添加备注" style={{height:130 , width:"100%" , fontSize:0.8}} 
                    value={currentValidItem.backMem}  
                    onChange={(val)=>{currentValidItem.backMem = val;this.setState({})}}/>
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