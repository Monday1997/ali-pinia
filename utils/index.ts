 // 函数防抖
 export function debounce(fn:(parmas:any)=>any, interval?:number, immediate?:boolean) {
  let timer = null;
  let gapTime = interval || 500; // 设置间隔时间
  return function () {
    if (timer) clearTimeout(timer);
    const context = this;
    const args = arguments;
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, gapTime);
      if (callNow) {
        fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context,args);
      }, gapTime);
    }
  };
}