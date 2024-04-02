import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

// 新增记录
export const addRecord = (record) => {
  return request.post('/record',record)
}

// 根据用户id查询记录
export const getRecord = (userId) => {
  return request.get('/record',{
    params: {
      userId: userId
    }
  })
}

// 根据用户名称查询记录
export const getRecordByUserName = (userName,organization) => {
  return request.get('/record/username',{
    params: {
      username: userName,
      organization: organization
    }
  })
}

// 根据问卷名称查询记录
export const getRecordByQuestionnaireName = (questionnaireName,organization) => {
  return request.get('/record/questionnaireName',{
    params: {
      questionnaireName: questionnaireName,
      organization: organization
    }
  })
}

// 根据时间查询记录
export const getRecordByTime = (time,organization) => {
  return request.get('/record/time',{
    params: {
      time: time,
      organization: organization
    }
  })
}