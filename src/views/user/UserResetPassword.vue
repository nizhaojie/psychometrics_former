<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重置密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="passwordInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="passwordInfo.old_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="passwordInfo.new_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="re_pwd">
                        <el-input v-model="passwordInfo.re_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :disabled="!canUpdate" @click="updatePasswordInfo">修改密码</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import { ref,computed } from 'vue'
import { userPasswordUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'

const passwordInfo = ref({
    old_pwd:'',
    new_pwd:'',
    re_pwd:''
})
const rightOldPassword = ref(false)
const rightNewPassword = ref(false)
const rightRePassword = ref(false)
const canUpdate = computed(()=>{
    return rightOldPassword.value && rightNewPassword.value && rightRePassword.value
})
const checkOldPWd = (rule, value, callback) => {
    if (value === '') {
        rightOldPassword.value = false
        callback(new Error('请输入原密码'))
    } else if(value.length < 3 || value.length > 20){
        rightOldPassword.value = false
        callback(new Error('原密码格式不正确，长度应为8~20位非空字符'))
    } else {
        rightOldPassword.value = true
        callback()
    }
}
const checkPassword = (rule, value, callback) => {
    if(value.length >=8 && value.length <=20) {
        rightNewPassword.value = true
        callback()
    } else {
        rightNewPassword.value = false
        callback(new Error('长度为8~20位非空字符'))
    }
}
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        rightRePassword.value = false
        callback(new Error('请再次输入密码'))
    } else if (value !== passwordInfo.value.new_pwd) {
        rightRePassword.value = false
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        rightRePassword.value = true
        callback()
    }
}
const rules = {
    old_pwd: [{ required: true, trigger: ['change','blur'], validator: checkOldPWd }],
    new_pwd: [{ required: true, trigger: ['change','blur'], validator: checkPassword}],
    re_pwd: [{ required: true, trigger: ['change','blur'], validator: checkRePassword}]
}

const updatePasswordInfo = async ()=>{
    //调用接口
    await userPasswordUpdateService(passwordInfo.value);
    ElMessage.success('修改成功');
}
</script>