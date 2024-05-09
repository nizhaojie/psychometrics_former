<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const userInfo = ref({...userInfoStore.info})
const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'change' },
        {
            pattern: /^\S{3,10}$/,
            message: '昵称必须是3-10位的非空字符串',
            trigger: 'change'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'change' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'change' }
    ]
}

const isEmail = (email) => {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

//修改个人信息
import { userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updateUserInfo = async ()=>{
    if(userInfo.value.nickname.length < 3 ||  userInfo.value.nickname.length > 10) {
        ElMessage.error("昵称必须是3-10位的非空字符串")
        return
    }
    if(!isEmail(userInfo.value.email)) {
        ElMessage.error("邮箱格式不正确")
        return
    }
    //调用接口
    await userInfoUpdateService(userInfo.value);
    ElMessage.success('修改成功');
    //修改pinia中的个人信息
    userInfoStore.setInfo(userInfo.value)
}
</script>