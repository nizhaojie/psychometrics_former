<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>测评问卷</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true; title = '添加问卷';">添加问卷</el-button>
                </div>
            </div>
        </template>
        <el-table :data="questionnaire" style="width: 100%">
            <!-- <el-table-column label="序号" width="70" prop="id"> </el-table-column> -->
            <el-table-column label="问卷名称" prop="name" width="250">
                <template #default="scope">
                    <div class="clickable" @click="openQuestionnaire(scope?.row?.id,scope?.row?.name)">{{ scope?.row?.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="问卷介绍" prop="description"></el-table-column>
            <el-table-column label="标签" prop="tag" width="100">
                <template #default="scope">
                    <el-tag size="large" :type="scope?.row?.tag==='智力'?'success':(scope?.row?.tag==='情商'?'primary':(scope?.row?.tag==='职业'?'warning':'danger'))">{{ scope?.row?.tag }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="toDeleteQuestionnaire(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加问卷弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="80%">
            <el-form :model="questionnaireModel" :rules="rules" label-width="120px" style="padding-right: 30px" :inline="true">
                <el-form-item label="问卷名称" prop="name">
                    <el-input v-model="questionnaireModel.name" minlength="1" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="问卷介绍" prop="description">
                    <el-input v-model="questionnaireModel.description" minlength="1" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-select v-model="questionnaireModel.tag" placeholder="选择标签">
                        <el-option value="智力">智力</el-option>
                        <el-option value="情商">情商</el-option>
                        <el-option value="职业">职业</el-option>
                        <el-option value="个性">个性</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区间1下限" prop="lowerlimit1">
                    <el-input v-model="questionnaireModel.lowerlimit1"></el-input>
                </el-form-item>
                <el-form-item label="区间1上限" prop="upperlimit1">
                    <el-input v-model="questionnaireModel.upperlimit1"></el-input>
                </el-form-item>
                <el-form-item label="区间1结论" prop="result1">
                    <el-input v-model="questionnaireModel.result1" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间2下限" prop="lowerlimit2">
                    <el-input v-model="questionnaireModel.lowerlimit2"></el-input>
                </el-form-item>
                <el-form-item label="区间2上限" prop="upperlimit2">
                    <el-input v-model="questionnaireModel.upperlimit2"></el-input>
                </el-form-item>
                <el-form-item label="区间2结论" prop="result2">
                    <el-input v-model="questionnaireModel.result2" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间3下限" prop="lowerlimit3">
                    <el-input v-model="questionnaireModel.lowerlimit3"></el-input>
                </el-form-item>
                <el-form-item label="区间3上限" prop="upperlimit3">
                    <el-input v-model="questionnaireModel.upperlimit3"></el-input>
                </el-form-item>
                <el-form-item label="区间3结论" prop="result3">
                    <el-input v-model="questionnaireModel.result3" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间4下限" prop="lowerlimit4">
                    <el-input v-model="questionnaireModel.lowerlimit4"></el-input>
                </el-form-item>
                <el-form-item label="区间4上限" prop="upperlimit4">
                    <el-input v-model="questionnaireModel.upperlimit4"></el-input>
                </el-form-item>
                <el-form-item label="区间4结论" prop="result4">
                    <el-input v-model="questionnaireModel.result4" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间5下限" prop="lowerlimit5">
                    <el-input v-model="questionnaireModel.lowerlimit5"></el-input>
                </el-form-item>
                <el-form-item label="区间5上限" prop="upperlimit5">
                    <el-input v-model="questionnaireModel.upperlimit5"></el-input>
                </el-form-item>
                <el-form-item label="区间5结论" prop="result5">
                    <el-input v-model="questionnaireModel.result5" maxlength="120" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加问卷' ? toAddQuestionnaire() : toUpdateQuestionnaire()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getQuestionnaire, addQuestionnaire, updateQuestionnaire, deleteQuestionnaire } from '@/api/questionnaire.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter();
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const questionnaire = ref([])

// 根据组织获取对应的问卷数据
const getQuestionnaireData = async () => {
    const questionnaireData = await getQuestionnaire(userInfoStore?.info?.organization)
    questionnaire.value = [...questionnaireData?.data]
    // console.log(questionnaire.value);
}

getQuestionnaireData()

//定义变量,控制标题的展示
const title = ref('')

//控制添加问卷弹窗
const dialogVisible = ref(false)

//添加问卷数据模型
const questionnaireModel = ref({
    name: '',
    description: '',
    organization: userInfoStore?.info?.organization,
    tag: '',
    lowerlimit1: '0',
    upperlimit1: '50',
    result1: '',
    lowerlimit2: '51',
    upperlimit2: '100',
    result2: '',
    lowerlimit3: '',
    upperlimit3: '',
    result3: '',
    lowerlimit4: '',
    upperlimit4: '',
    result4: '',
    lowerlimit5: '',
    upperlimit5: '',
    result5: '',
})

const checkQuestionnaireName = (rule, value, callback) => {
    if(value === '') {
        callback(new Error('请输入问卷名称'))
    } else {
        callback()
    }
}

const checkQuestionnaireDescription = (rule, value, callback) => {
    if(value === '') {
        callback(new Error('请输入问卷介绍'))
    } else {
        callback()
    }
}

const checkLimit = (rule,value,callback) => {
    let str = /^\+?[1-9][0-9]*$/
    if(!str.test(value) || value > 100) {
        callback(new Error('边界必须为0~100的整数'))
    } else callback()
}

const checkLimitNull = (rule,value,callback) => {
    if(value === null || value === '') callback()
    let str = /^\+?[1-9][0-9]*$/
    if(!str.test(value) || value > 100) {
        callback(new Error('边界必须为0~100的整数'))
    } else callback()
}

const checkResult = (rule,value,callback) => {
    if(value === '') {
        callback(new Error('请输入结论'))
    } else {
        callback()
    }
}

//添加问卷表单校验
const rules = {
    name: [
        { required: true, trigger: ['change','blur'], validator: checkQuestionnaireName },
    ],
    description: [
        { required: true, trigger: ['change','blur'], validator: checkQuestionnaireDescription },
    ],
    tag: [
    { required: true, trigger: ['change','blur'], message: '请选择标签' }
    ],
    lowerlimit1: [
        { required: true, trigger: ['change','blur'], validator: checkLimit }
    ],
    upperlimit1: [
        { required: true, trigger: ['change','blur'], validator: checkLimit }
    ],
    lowerlimit2: [
        { required: true, trigger: ['change','blur'], validator: checkLimit }
    ],
    upperlimit2: [
        { required: true, trigger: ['change','blur'], validator: checkLimit }
    ],
    result1: [
        { required: true, trigger: ['change','blur'], validator: checkResult }
    ],
    result2: [
        { required: true, trigger: ['change','blur'], validator: checkResult }
    ],
    lowerlimit3: [
        { trigger: ['change','blur'], validator: checkLimitNull }
    ],
    upperlimit3: [
        { trigger: ['change','blur'], validator: checkLimitNull }
    ],
    lowerlimit4: [
        { trigger: ['change','blur'], validator: checkLimitNull }
    ],
    upperlimit4: [
        { trigger: ['change','blur'], validator: checkLimitNull }
    ],
    lowerlimit5: [
        { trigger: ['change','blur'], validator: checkLimitNull }
    ],
    upperlimit5: [
        { trigger: ['change','blur'], validator: checkLimitNull }
    ],
}

//调用接口,添加表单
const toAddQuestionnaire = async () => {
    if(questionnaireModel.value.name.trim() === '') {
        ElMessage.error('请填写问卷名称')
        return
    }
    if(questionnaireModel.value.description.trim() === '') {
        ElMessage.error('请填写问卷介绍')
        return
    }
    if(questionnaireModel.value.tag === '') {
        ElMessage.error('请选择问卷标签')
        return
    }
    if(questionnaireModel.value.lowerlimit3 !== '' && questionnaireModel.value.lowerlimit3 !== null && questionnaireModel.value.result3 === '') {
        ElMessage.error('请填写结论3')
        return
    }
    if(questionnaireModel.value.lowerlimit4 !== '' && questionnaireModel.value.lowerlimit4 !== null && questionnaireModel.value.result4 === '') {
        ElMessage.error('请填写结论4')
        return
    }
    if(questionnaireModel.value.lowerlimit5 !== '' && questionnaireModel.value.lowerlimit5 !== null && questionnaireModel.value.result5 === '') {
        ElMessage.error('请填写结论5')
        return
    }
    if(questionnaireModel.value.upperlimit1 < questionnaireModel.value.lowerlimit1 
        || questionnaireModel.value.upperlimit2 < questionnaireModel.value.lowerlimit2
        || questionnaireModel.value.upperlimit3 < questionnaireModel.value.lowerlimit3
        || questionnaireModel.value.upperlimit4 < questionnaireModel.value.lowerlimit4
        || questionnaireModel.value.upperlimit5 < questionnaireModel.value.lowerlimit5) {
        ElMessage.error('区间上限不能小于下限')
        return
    }
    if(true) {
        ElMessage.error('总分区间阶梯有重叠部分')
        return
    }
    return
    //调用接口
    await addQuestionnaire(questionnaireModel.value);
    ElMessage.success('添加成功')

    //调用获取所有文章问卷的函数
    getQuestionnaireData();
    dialogVisible.value = false;
    clearData()
}

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible.value = true; title.value = '编辑问卷'
    //数据拷贝
    questionnaireModel.value.name = row.name;
    questionnaireModel.value.description = row.description;
    questionnaireModel.value.tag = row.tag
    questionnaireModel.value.lowerlimit1 = row.lowerlimit1
    questionnaireModel.value.upperlimit1 = row.upperlimit1
    questionnaireModel.value.result1 = row.result1
    questionnaireModel.value.lowerlimit2 = row.lowerlimit2
    questionnaireModel.value.upperlimit2 = row.upperlimit2
    questionnaireModel.value.result2 = row.result2
    questionnaireModel.value.lowerlimit3 = row.lowerlimit3 || null
    questionnaireModel.value.upperlimit3 = row.upperlimit3 || null
    questionnaireModel.value.result3 = row.result3
    questionnaireModel.value.lowerlimit4 = row.lowerlimit4 || null
    questionnaireModel.value.upperlimit4 = row.upperlimit4 || null
    questionnaireModel.value.result4 = row.result4
    questionnaireModel.value.lowerlimit5 = row.lowerlimit5 || null
    questionnaireModel.value.upperlimit5 = row.upperlimit5 || null
    questionnaireModel.value.result5 = row.result5
    //扩展id属性,将来需要传递给后台,完成问卷的修改
    questionnaireModel.value.id = row.id
}

//编辑问卷
const toUpdateQuestionnaire = async () => {
    //调用接口
    await updateQuestionnaire(questionnaireModel.value);
    ElMessage.success('修改成功')
    //调用获取所有问卷的函数
    getQuestionnaireData();
    //隐藏弹窗
    dialogVisible.value = false;
    clearData()
}

//清空模型的数据
const clearData = () => {
    questionnaireModel.value = {
        name: '',
        description: '',
        organization: userInfoStore?.info?.organization,
        tag: '',
        lowerlimit1: 0,
        upperlimit1: 50,
        result1: '',
        lowerlimit2: 51,
        upperlimit2: 100,
        result2: '',
        lowerlimit3: null,
        upperlimit3: null,
        result3: '',
        lowerlimit4: null,
        upperlimit4: null,
        result4: '',
        lowerlimit5: null,
        upperlimit5: null,
        result5: '',
    }
}

//删除问卷
const toDeleteQuestionnaire = (row) => {
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该问卷信息吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            await deleteQuestionnaire(row.id);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            getQuestionnaireData();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}

const openQuestionnaire = (questionnaireId,questionnaireName) => {
    router.push({
        path: '/questionnaire/info',
        query: {
            questionnaireId: questionnaireId,
            questionnaireName: questionnaireName
        }
    })
}

</script>


<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }


    .clickable{
        cursor: pointer;
    }

    .clickable:hover{
        color: blue;
    }
}
</style>