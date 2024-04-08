<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span class="title">测评问卷</span>
                <el-input
                    v-model="searchParameter"
                    placeholder="请输入查询关键词"
                    :class="['input-with-select', administrator ? 'maxWidth1' : 'maxWidth2']"
                    @keydown.enter="search"
                    maxlength="40"
                >
                    <template #prepend>
                        <el-select v-model="searchType" style="width: 115px">
                            <el-option label="问卷名称" value="问卷名称" />
                            <el-option label="问卷介绍" value="问卷介绍" />
                            <el-option label="问卷标签" value="问卷标签" />
                        </el-select>
                    </template>
                    <template #append>
                        <el-button @click="search">
                            <el-icon style="vertical-align: middle">
                                <Search />
                            </el-icon>          
                        </el-button>
                    </template>
                </el-input>
                <div class="extra" v-if="administrator">
                    <el-button type="primary" @click="dialogVisible = true; title = '添加问卷';">添加问卷</el-button>
                </div>
            </div>
        </template>
        <el-table :data="questionnaireShowing" style="width: 100%">
            <!-- <el-table-column label="序号" width="70" prop="id"> </el-table-column> -->
            <el-table-column label="问卷名称" prop="name" width="250">
                <template #default="scope">
                    <div class="clickable" @click="openQuestionnaire(scope?.row)">{{ scope?.row?.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="问卷介绍" prop="description"></el-table-column>
            <el-table-column label="标签" prop="tag" width="100">
                <template #default="scope">
                    <el-tag size="large" :type="scope?.row?.tag==='智力'?'success':(scope?.row?.tag==='情商'?'primary':(scope?.row?.tag==='职业'?'warning':'danger'))">{{ scope?.row?.tag }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" v-if="administrator">
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
                    <el-input v-model="questionnaireModel.name" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="问卷介绍" prop="description">
                    <el-input v-model="questionnaireModel.description" maxlength="50"></el-input>
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
                    <el-input-number v-model="questionnaireModel.lowerlimit1" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间1上限" prop="upperlimit1">
                    <el-input-number v-model="questionnaireModel.upperlimit1" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间1结论" prop="result1">
                    <el-input v-model="questionnaireModel.result1" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间2下限" prop="lowerlimit2">
                    <el-input-number v-model="questionnaireModel.lowerlimit2" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间2上限" prop="upperlimit2">
                    <el-input-number v-model="questionnaireModel.upperlimit2" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间2结论" prop="result2">
                    <el-input v-model="questionnaireModel.result2" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间3下限" prop="lowerlimit3">
                    <el-input-number v-model="questionnaireModel.lowerlimit3" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间3上限" prop="upperlimit3">
                    <el-input-number v-model="questionnaireModel.upperlimit3" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间3结论" prop="result3">
                    <el-input v-model="questionnaireModel.result3" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间4下限" prop="lowerlimit4">
                    <el-input-number v-model="questionnaireModel.lowerlimit4" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间4上限" prop="upperlimit4">
                    <el-input-number v-model="questionnaireModel.upperlimit4" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间4结论" prop="result4">
                    <el-input v-model="questionnaireModel.result4" maxlength="120" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="区间5下限" prop="lowerlimit5">
                    <el-input-number v-model="questionnaireModel.lowerlimit5" :min="0" :max="100" :precision="0"></el-input-number>
                </el-form-item>
                <el-form-item label="区间5上限" prop="upperlimit5">
                    <el-input-number v-model="questionnaireModel.upperlimit5" :min="0" :max="100" :precision="0"></el-input-number>
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

        <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :default-page-size="6" :total="questionnaire.length" :current-page="page" @current-change="changePage"/>
      </div>
    </el-card>
</template>

<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { getQuestionnaire, addQuestionnaire, updateQuestionnaire, deleteQuestionnaire } from '@/api/questionnaire.js'
import { ElMessage, ElMessageBox, ElPagination, ElInput } from 'element-plus'
import { useRouter } from 'vue-router'
import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const router = useRouter();
// 问卷数据
const questionnaire = ref([])
// 问卷数据备份
let questionnaireStore = []
// 是否为管理员的标志
const administrator = ref(false)
// 展示的问卷数据
const questionnaireShowing = ref([])
// 页数
const page = ref(1)
// 切页
const changePage = (index) => {
    page.value = index
    questionnaireShowing.value = questionnaire.value.slice((index - 1) * 6, index * 6)
}

//调用函数,获取用户详细信息
const getUserInfo = async () => {
    //调用接口
    let result = await userInfoService();
    //数据存储到pinia中
    userInfoStore.setInfo(result.data);
    // 获取问卷信息
    getQuestionnaireData()
}

// 初始化,获取问卷数据和是否为管理员
const getQuestionnaireData = async () => {
    const questionnaireData = await getQuestionnaire(userInfoStore?.info?.organization)
    administrator.value = userInfoStore?.info?.administrator === 1 ? true : false
    questionnaire.value = [...questionnaireData?.data]
    questionnaireStore = [...questionnaireData?.data]
    // 如果是查询状态就再查询一次
    if(searchParameter.value.trim() !== '') {
        search()
    } else changePage(page.value)
    // questionnaireShowing.value = questionnaire.value.slice((page.value - 1) * 6, page.value * 6)
}

// 如果已经有了用户数据就只要获取问卷数据就可以了
if(!userInfoStore?.info?.organization) {
    getUserInfo()
} else getQuestionnaireData()

//定义变量,控制标题的展示
const title = ref('')
//控制添加问卷弹窗
const dialogVisible = ref(false)

// 关键词类型
const searchType = ref('关键词类型')
// 搜索的关键词
const searchParameter = ref('')

//添加问卷数据模型
const questionnaireModel = ref({
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

// const checkLimit = (rule,value,callback) => {
//     let str = /^([0-9]{1,2}|100)$/
//     if(!str.test(value) || value > 100) {
//         callback(new Error('边界必须为0~100的整数'))
//     } else callback()
// }

// const checkLimitNull = (rule,value,callback) => {
//     if(value === null || value === '') callback()
//     let str = /^([0-9]{1,2}|100)$/
//     if(!str.test(value) || value > 100) {
//         callback(new Error('边界必须为0~100的整数'))
//     } else callback()
// }

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
        { required: true, message: '请输入区间1下限' }
    ],
    upperlimit1: [
        { required: true, message: '请输入区间1上限' }
    ],
    lowerlimit2: [
        { required: true, message: '请输入区间2下限' }
    ],
    upperlimit2: [
        { required: true, message: '请输入区间2上限' }
    ],
    result1: [
        { required: true, trigger: ['change','blur'], validator: checkResult }
    ],
    result2: [
        { required: true, trigger: ['change','blur'], validator: checkResult }
    ],
}

const checkquestionnaireModel = (questionnaireModel) => {
    if(questionnaireModel.name.trim() === '') {
        ElMessage.error('请填写问卷名称')
        return false
    }
    if(questionnaireModel.description.trim() === '') {
        ElMessage.error('请填写问卷介绍')
        return false
    }
    if(questionnaireModel.tag === '') {
        ElMessage.error('请选择问卷标签')
        return false
    }
    if(questionnaireModel.result1.trim() === '') {
        ElMessage.error('请填写结论1')
        return false
    }
    if(questionnaireModel.result2.trim() === '') {
        ElMessage.error('请填写结论2')
        return false
    }
    // 确保前两个区间的边界都不为null
    if(questionnaireModel.lowerlimit1 === null || questionnaireModel.upperlimit1 === null || questionnaireModel.lowerlimit2 === null || questionnaireModel.upperlimit2 === null) {
        ElMessage.error('边界必须是0~100的整数')
        return false
    }
    let limits = [questionnaireModel.lowerlimit1,
                questionnaireModel.upperlimit1,
                questionnaireModel.lowerlimit2,
                questionnaireModel.upperlimit2,
    ]
    let s1 = ''
    let s2 = ''
    let s3 = ''
    // 检查后三个区间的三个属性是否有缺漏
    for(let i = 3; i < 6; i++) {
        s1 = 'lowerlimit' + i
        s2 = 'upperlimit' + i
        s3 = 'result' + i
        if(questionnaireModel[s1] || questionnaireModel[s2] || questionnaireModel[s3].trim()) {
            if(questionnaireModel[s1] && questionnaireModel[s2] && questionnaireModel[s3].trim()) {
                limits.push(questionnaireModel[s1])
                limits.push(questionnaireModel[s2])
            } else {
                ElMessage.error('区间' + i + '的上下限或结论有缺少')
                return false
            }
        }
    }
    // 检查上下边界是否为0和100
    if(limits[0] !== 0 || limits[limits.length-1] !== 100) {
        ElMessage.error('上下边界必须为100和0')
        return false
    }
    for(let i = 1; i < limits.length; i++) {
        if(i%2 === 1 && limits[i] < limits[i-1]) {
            ElMessage.error('区间上限必须大于下限')
            return false
        } else if(i%2 === 0 && limits[i] !== limits[i-1]+1) {
            ElMessage.error('不同区间之间不能有空隙')
            return false
        }
    }
    return true
}

//调用接口,添加表单
const toAddQuestionnaire = async () => {
    let res = checkquestionnaireModel(questionnaireModel.value)
    if(res) {
        //调用接口
        await addQuestionnaire(questionnaireModel.value);
        ElMessage.success('添加成功')
        // 页数跳到最后一页
        page.value = Math.ceil((questionnaire.value.length + 1) / 6)
        //调用获取所有文章问卷的函数
        getQuestionnaireData();
        dialogVisible.value = false;
        clearData()
    }
}

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible.value = true; title.value = '编辑问卷'
    //数据拷贝
    questionnaireModel.value.name = row.name;
    questionnaireModel.value.description = row.description;
    questionnaireModel.value.tag = row.tag
    let s1 = ''
    let s2 = ''
    let s3 = ''
    for(let i = 1; i < 6; i++) {
        s1 = 'lowerlimit' + i
        s2 = 'upperlimit' + i
        s3 = 'result' + i
        questionnaireModel.value[s1] = i < 3 ? row[s1] : row[s1] || null
        questionnaireModel.value[s2] = i < 3 ? row[s2] : row[s2] || null
        questionnaireModel.value[s3] = row[s3] || ''
    }
    //扩展id属性,将来需要传递给后台,完成问卷的修改
    questionnaireModel.value.id = row.id
}

//编辑问卷
const toUpdateQuestionnaire = async () => {
    let res = checkquestionnaireModel(questionnaireModel.value)
    if(res) {
        //调用接口
        await updateQuestionnaire(questionnaireModel.value);
        ElMessage.success('修改成功')
        //调用获取所有问卷的函数
        getQuestionnaireData();
        //隐藏弹窗
        dialogVisible.value = false;
        clearData()
    }
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
        '确定要删除该问卷信息吗?',
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
            // 如果是删除最后一页的最后一个问卷,则页数要减1
            if(questionnaire.value.length % 6 === 1 && page.value == Math.ceil(questionnaire.value.length/6)) {
                page.value--
            }
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

const openQuestionnaire = (questionnaireModel) => {
    if(administrator.value) {
        openQuestionnaireByAdministrator(questionnaireModel)
    } else openQuestionnaireByUser(questionnaireModel)
}

const openQuestionnaireByUser = (questionnaireModel) => {
    router.push({
        path: '/questionnaire/info',
        query: {
            questionnaireId: questionnaireModel.id,
            questionnaireName: questionnaireModel.name,
            lowerlimit1: questionnaireModel.lowerlimit1,
            upperlimit1: questionnaireModel.upperlimit1,
            lowerlimit2: questionnaireModel.lowerlimit2,
            upperlimit2: questionnaireModel.upperlimit2,
            lowerlimit3: questionnaireModel.lowerlimit3 || 100,
            upperlimit3: questionnaireModel.upperlimit3,
            lowerlimit4: questionnaireModel.lowerlimit4 || 100,
            upperlimit4: questionnaireModel.upperlimit4,
            lowerlimit5: questionnaireModel.lowerlimit5 || 100,
            upperlimit5: questionnaireModel.upperlimit5,
            result1: questionnaireModel.result1,
            result2: questionnaireModel.result2,
            result3: questionnaireModel.result3,
            result4: questionnaireModel.result4,
            result5: questionnaireModel.result5
        }
    })
}

const openQuestionnaireByAdministrator = (questionnaireModel) => {
    router.push({
        path: '/questionnaire/update',
        query: {
            questionnaireId: questionnaireModel.id,
            questionnaireName: questionnaireModel.name
        }
    })
}

// 查询函数
const search = () => {
    if(searchType.value === '关键词类型') {
        ElMessage.error('请选择查询关键词的类型')
        return
    }
    if(searchParameter.value.trim() === '') {
        // 重置
        questionnaire.value = questionnaireStore
        changePage(1)
        return
    }
    if(searchType.value === '问卷名称') {
        questionnaire.value = questionnaireStore.filter(item => item.name.includes(searchParameter.value))
    } else if(searchType.value === '问卷介绍') {
        questionnaire.value = questionnaireStore.filter(item => item.description.includes(searchParameter.value))
    } else if(searchType.value === '问卷标签') {
        questionnaire.value = questionnaireStore.filter(item => item.tag.includes(searchParameter.value))
    }
    changePage(page.value)
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
        
        .title {
            font-size: large;
            font-weight: 600;
        }   

        .maxWidth1 {
            max-width: 800px
        }

        .maxWidth2 {
            max-width: 1000px
        }

        .input-with-select .el-input-group__prepend {
            background-color: var(--el-fill-color-blank);
        }
    }


    .clickable{
        cursor: pointer;
    }

    .clickable:hover{
        color: blue;
    }

    .pagination{
        position: fixed;
        bottom: 120px;
        left: 50%;
    }
}

</style>