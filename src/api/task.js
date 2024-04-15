import request from '@/utils/request.js'

export const getTaskByGiver = (giver) => {
  return request.get('/task/giver',{
    params: {
      giver: giver
    }
  })
}

export const getTaskByReceiver = (receiver) => {
  return request.get('/task/receiver',{
    params: {
      receiver: receiver
    }
  })
}

export const addTask = (taskList) => {
  return request.post('/task/add',taskList)
}

export const updateTask = (id) => {
  return request.get('/task/update',{
    params: {
      id: id
    }
  })
}

export const deleteTask = (id) => {
  return request.delete('/task?id=' + id)
}