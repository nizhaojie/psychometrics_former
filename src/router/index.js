import { createRouter, createWebHistory } from 'vue-router'

//定义路由关系
const routes = [
    { path: '/login', component: () => import("@/views/Login.vue") },
    {
        path: '/', component: () => import("@/views/Layout.vue"), redirect:'/questionnaire/overview', children: [
            { path: '/questionnaire/overview', component: import("@/views/questionnaire/QuestionnaireOverview.vue") },
            { path: '/questionnaire/info', component: import("@/views/questionnaire/Questionnaire.vue") },
            { path: '/questionnaire/update', component: import("@/views/questionnaire/QuestionnaireUpdate.vue") },
            { path: '/record/detail', component: import("@/views/record/RecordDetail.vue") },
            { path: '/record/overview', component: () => import("@/views/record/RecordOverview.vue") },
            { path: '/user/info', component: () => import("@/views/user/UserInfo.vue") },
            { path: '/user/avatar', component: () => import("@/views/user/UserAvatar.vue") },
            { path: '/user/resetPassword', component: () => import("@/views/user/UserResetPassword.vue") },
        ]
    },
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router
