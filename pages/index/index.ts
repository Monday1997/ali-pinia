
import {useTest} from '/store/module/test'
let testStore =  null
import {reactive} from '@vue/reactivity'
Page<{
  SDKVersion?: string,
  useComponent? :boolean,
  useComponent2? :boolean,
  textStore:Record<string,any>,
},{
  handerClick:()=>void
}>({
  data: {
    SDKVersion: '',
    textStore:{},

  },
  onLoad(query) {
    testStore = useTest.call(this)
    // 页面加载
   /*  console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    let testA = {
      a:555
    }
    const ddd = reactive(testA) */
    /* watch(()=>ddd.a,(val)=>{
      console.log(val)
    })  */
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.setData({
      SDKVersion: my.SDKVersion,
    })
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