
import {useTest} from '/store/test'
let testStore =  null


Page<{
  useComponent? :boolean,
  useComponent2? :boolean,
  textStore:Record<string,any>
},{
  handerClick:()=>void
}>({
  data: {
    textStore:{}
  },
  onLoad(query) {
    testStore = useTest.call(this)
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {

  },
  onUnload() {
    // 页面被关闭
  },
  handerClick(){
    // testStore.firstName = 'ggbone'
    testStore.setFirstName('newFirst')
    // console.log(testStore.name)
  }
});