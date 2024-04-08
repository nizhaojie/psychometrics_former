import request from '@/utils/request.js'

// 根据管理员查询指导建议
export const getGuidanceByGiver = (giver) => {
  return request.get('/guidance/giver',{
    params: {
      giver: giver
    }
  })
}

// 根据用户查询指导建议
export const getGuidanceByReceiver = (receiver) => {
  return request.get('/guidance/receiver',{
    params: {
      receiver: receiver
    }
  })
}

// 添加指导建议
export const addGuidance = (guidance) => {
  return request.post('/guidance/add',guidance)
}

// 更新状态
export const updateGuidance = (id) => {
  return request.get('/guidance/update',{
    params: {
      id: id
    }
  })
}

// 删除指导建议
export const deleteGuidance = (id) => {
  return request.delete('/guidance?id=' + id)
}