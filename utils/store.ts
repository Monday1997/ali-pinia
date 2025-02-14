import {debounce} from '../utils/index';
const allStoreName = {};
export function defineStore(storeName, config) {
  if (!config || typeof storeName !== 'string') {
    throw new Error('defineStore操作中name不可为空');
  }
  if (allStoreName[storeName]) {
    throw new Error('已存在重复storeName，请重起');
  }
  const pageMap = new Map();
  const { state: stateFn, action: actionData, getter: getterData } = config;
  const state = typeof stateFn === 'function' ? stateFn() : stateFn;
  const bucketWatcher = new WeakMap()
  let setGetter = false
  function reactive(data) {
    for (let key in data) {
      if (Object.prototype.toString.call(data[key]) === '[object Object]') {
        data[key] = reactive(data[key]);
      }
    }
    return new Proxy(data, {
      set(target, key, value, receiver) {
        const oldValue = Reflect.get(target,key,receiver)
        if(oldValue ===value){
          return true
        }
        Reflect.set(target, key, value, receiver);
        const depsMap = bucketWatcher.get(target) || new Map()
        const deps = depsMap.get(key)
        if(deps){
          deps.forEach(fn=>{
            fn.dirty = true
            fn()
          })
        }
        debounceResetStore()
        return true;
      },
    });
  }
  function readOnly(data) {
    for (let key in data) {
      if (Object.prototype.toString.call(data[key]) === '[object Object]') {
        data[key] = readOnly(data[key]);
      }
    }
    return new Proxy(data, {
      get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
         // 收集当前getter中使用了的依赖
        if(setGetter){
          let depsMap = bucketWatcher.get(target)
          if(!depsMap){
            bucketWatcher.set(target,(depsMap = new Map()))
          }
          let deps = depsMap.get(key)
          if(!deps){
             depsMap.set(key,(deps = new Set()))
          }
          deps.add(setGetter)
        }
       
        if (typeof result === 'function' && target.hasOwnProperty(key)) {
          setGetter = result
          const resultData = result()
          setGetter = false
          return resultData;
        }
        return result;
      },
      set() {
        throw new Error(
          storeName
            ? `store:${storeName}不能通过外部修改`
            : `strore不可通过外部修改`,
        );
      },
    });
  }

  const getter = getterData || {};

  function StoreExportFn() {
    for (let key in state) {
      this[key] = state[key];
    }
    for (let key in getter) {
      const fn = function(){
        if(fn.dirty){
          fn.dirty = false
          fn.value =  getter[key].call(stateReadOnly)
        }
        return fn.value
      }
      fn.dirty = true
      fn.value = null
      this[key] = fn
    }
  }
  const action = actionData ? createAction(actionData) : {};
  StoreExportFn.prototype = Object.create(action);
  const storeExport = new StoreExportFn();
  const stateProxy = reactive(storeExport);
  const stateReadOnly = readOnly(storeExport);
  function useStore() {
    // 页面上取值的名字 多个页面都要搞
    if (this && this.setData && !pageMap.has(this.$id)) {
      pageMap.set(this.$id, this);
    }
    this && this.setData && resetStore(this);
    return stateReadOnly;
  }
  function createAction(config) {
    const data = {};
    for (let key in config) {
      if (key === 'state') {
        console.error('state为保留字段，请重新命名');
        continue;
      }
      const actionItem = config[key];
      data[key] = async function (data) {
        return await actionItem.call(stateProxy, data);
      };
    }
    return data;
  }
  const resetStore = (instance?) => {
    // 挂载数据到页面
    if (instance) {
      instance.setData({
        [storeName]: stateReadOnly,
      });
    } else {
      for (let [key, pageInstance] of pageMap) {
        pageInstance.setData &&
          pageInstance.setData({
            [storeName]: stateReadOnly,
          });
      }
    }
  };
  const debounceResetStore = debounce(resetStore);
  return useStore;
}
