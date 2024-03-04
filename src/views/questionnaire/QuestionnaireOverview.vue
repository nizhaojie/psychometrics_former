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
            <el-table-column label="问卷名称" prop="name" width="300">
                <template #default="scope">
                    <div class="clickable" @click="openQuestionnaire(scope?.row?.id,scope?.row?.name)">{{ scope?.row?.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="问卷介绍" prop="description"></el-table-column>
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
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="questionnaireModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="问卷名称" prop="name">
                    <el-input v-model="questionnaireModel.name" minlength="1" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="问卷介绍" prop="description">
                    <el-input v-model="questionnaireModel.description" minlength="1" maxlength="50"></el-input>
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
    organization: userInfoStore?.info?.organization
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

//添加问卷表单校验
const rules = {
    name: [
        { required: true, trigger: ['change','blur'], validator: checkQuestionnaireName },
    ],
    description: [
        { required: true, trigger: ['change','blur'], validator: checkQuestionnaireDescription },
    ]
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
        organization: userInfoStore?.info?.organization
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