<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <el-form-item prop="organization">
                    <el-select v-model="registerData.organization" filterable placeholder="选择团队">
                        <el-option v-for="item in organizationData" :key="item.id" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button :disabled="!canRegister" class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <!-- <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item> -->
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
import { useRouter } from 'vue-router'
import { userRegisterService, userLoginService, getOrganizations } from '@/api/user.js'

// 是否是注册界面
const isRegister = ref(false)
const router = useRouter()
const tokenStore = useTokenStore();
// 注册的表单数据
const registerData = ref({
    username: '',
    password: '',
    rePassword: '',
    organization: ''
})
// 提前获取到的团队数据
const organizationData = ref([])
// 注册表单的数据是否合规
const rightUsername = ref(false)
const rightPassword = ref(false)
const rightRePassword = ref(false)
const organizationChecked = ref(false)
const canRegister = computed(()=>{
    return rightUsername.value && rightPassword.value && rightRePassword.value && organizationChecked.value
})

// 校验用户名、密码、重复密码、团队的函数
const checkUsername = (rule, value, callback) => {
    if(value.length >=3 && value.length <=20) {
        rightUsername.value = true
        callback()
    } else {
        rightUsername.value = false
        callback(new Error('长度为3~20位非空字符'))
    }
}
const checkPassword = (rule, value, callback) => {
    if(value.length >=8 && value.length <=20) {
        rightPassword.value = true
        callback()
    } else {
        rightPassword.value = false
        callback(new Error('长度为8~20位非空字符'))
    }
}
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        rightRePassword.value = false
        callback(new Error('请再次输入密码'))
    } else if (value !== registerData.value.password) {
        rightRePassword.value = false
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        rightRePassword.value = true
        callback()
    }
}
const checkOrganization = (rule, value, callback) => {
    if (value === '') {
        organizationChecked.value = false
        callback(new Error('请选择团队'))
    } else {
        organizationChecked.value = true
        callback()
    }
}
// 定义表单校验规则
const rules = {
    username: [
        { required: true, trigger: ['change','blur'], validator: checkUsername }
    ],
    password: [
        { required: true, trigger: ['change','blur'], validator: checkPassword }
    ],
    rePassword: [
        { required: true, trigger: ['change','blur'], validator: checkRePassword }
    ],
    organization: [
        { required: true, trigger: ['change','blur'], validator: checkOrganization }
    ]
}

// 获取团队信息的函数
const getOrganizationData = async () => {
    let result = await getOrganizations();
    organizationData.value = result?.data;
}

// 注册函数
const register = async () => {
    if(registerData.value.username.length < 3 || registerData.value.username.length > 20) {
        ElMessage.error("请输入正确格式的用户名")
        return
    }
    if(registerData.value.password.length < 8 || registerData.value.username.length > 20) {
        ElMessage.error("请输入正确格式的密码")
        return
    }
    let result = await userRegisterService(registerData.value);
    ElMessage.success('注册成功')
    isRegister.value = false
    clearRegisterData()
}

// 登录函数
const login = async () => {
    if(registerData.value.username.length < 3 || registerData.value.username.length > 20) {
        ElMessage.error("请输入正确格式的用户名")
        return
    }
    if(registerData.value.password.length < 8 || registerData.value.username.length > 20) {
        ElMessage.error("请输入正确格式的密码")
        return
    }
    //调用接口,完成登录
   let result = await userLoginService(registerData.value);
   ElMessage.success('登录成功')
   //把得到的token存储到pinia中
   tokenStore.setToken(result.data)
   //跳转到首页 路由完成跳转
   router.push('/')
}

// 定义函数,清空数据模型的数据
const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: '',
        organization: ''
    }
    if(organizationData.value.length === 0) getOrganizationData()
}
</script>



<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 50% center / 480px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .el-select {
            width: 100%;
        }
    }
}
</style>