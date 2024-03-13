import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

// 新增记录
export const addRecord = (record) => {
  return request.post('/record',record)
}

// 查询记录
export const getRecord = (userId) => {
  return request.get('/record',{
    params: {
      userId: userId
    }
  })
}