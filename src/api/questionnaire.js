import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
//文章分类列表查询
// export const articleCategoryListService = ()=>{
//     //const tokenStore = useTokenStore();
//     //在pinia中定义的响应式数据,都不需要.value
//     //return request.get('/category',{headers:{'Authorization':tokenStore.token}})
//     return request.get('/category')
// }

// //文章分类添加
// export const articleCategoryAddService = (categoryData)=>{
//     return request.post('/category',categoryData)
// }

// //文章分类修改
// export const articleCategoryUpdateService = (categoryData)=>{
//    return  request.put('/category',categoryData)
// }

// //文章分类删除
// export const articleCategoryDeleteService = (id)=>{
//     return request.delete('/category?id=' + id)
// }

// //文章列表查询
// export const articleListService = (params)=>{
//    return  request.get('/article',{params:params})
// }

// //文章添加
// export const articleAddService = (articleData)=>{
//     return request.post('/article',articleData);

// }

//获取问卷概览数据
export const getQuestionnaire = (organization) => {
    return request.get('/questionnaire',{
        params: {
            organization: organization
        }
    })
}

// 新建问卷
export const addQuestionnaire = (questionnaireData) => {
    return request.post('/questionnaire',questionnaireData)
}

// 修改问卷
export const updateQuestionnaire = (questionnaireData) => {
    return request.put('/questionnaire',questionnaireData)
}

// 删除问卷
export const deleteQuestionnaire = (id) => {
    return request.delete('/questionnaire?id=' + id)
}

// 获取问卷对应的题目
export const getQuestions = (questionnaireId) => {
    return request.get('/question',{
        params: {
            questionnaireId: questionnaireId
        }
    })
}

// 新建问题
export const addQuestion = (questionData) => {
    return request.post('/question',questionData)
}

// 修改问题
export const updateQuestion = (questionData) => {
    return request.put('/question',questionData)
}

// 删除问题
export const deleteQuestion = (id) => {
    return request.delete('/question?id=' + id)
}