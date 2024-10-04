import {defineStore} from '/utils/store'
export const useTest = defineStore('textStore',{
  state(){
    return {
      firstName:'first',
      lastName:'last'
    }
  },
  getter:{
    name(){
      console.log('进行展示')
      return this.firstName + this.lastName
    }
  },
  action:{
    setFirstName(data){
      this.firstName = data
    }
  },
})