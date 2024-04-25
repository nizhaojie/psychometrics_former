import request from '@/utils/request.js'

// 新增记录
export const addRecord = (record) => {
  return request.post('/record',record)
}

// 根据用户id查询记录
export const getRecord = (userId) => {
  return request.get('/record/userId',{
    params: {
      userId: userId
    }
  })
}

// 根据组织查询记录
export const getRecordByOrganization = (organization) => {
  return request.get('/record/organization',{
    params: {
      organization: organization
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

export const getRecordPass = (organization) => {
  return request.get('/record/pass',{
    params: {
      organization: organization
    }
  })
}

export const getRecordFail = (organization) => {
  return request.get('/record/fail',{
    params: {
      organization: organization
    }
  })
}

export const getRecordSeen = (organization) => {
  return request.get('/record/seen',{
    params: {
      organization: organization
    }
  })
}

export const getRecordNotSeen = (organization) => {
  return request.get('/record/notSeen',{
    params: {
      organization: organization
    }
  })
}

// 更新已读状态
export const updateRecord = (id) => {
  return request.get('/record/update',{
    params: {
      id: id
    }
  })
}