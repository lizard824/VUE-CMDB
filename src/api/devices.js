import fetch from '@/utils/fetch'

export function queryAll(query){
   return fetch({
          url:'/device/asset',
          method: 'get',
          params:query
   })
}

export function update(oem,idc,deviceList){
  return fetch({
        url:'/device/update',
        method: 'post',
        data:{
          "oem":oem,
          "idc":idc,
          "deviceid":deviceList
        }
    }
  )
}


export function total(){
  return fetch({
          url: '/device/total',
          method:'get',

  })


}


export function search(query){
  return fetch({
       url: '/device/search',
      method:'get',
      params: query
  })
}

//app

export  function deviceApp(query){

}
