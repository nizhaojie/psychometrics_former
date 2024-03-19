<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
            <el-button type="primary" @click="backToOverview">
                <el-icon><Back /></el-icon>
                返回问卷列表
            </el-button>
              <span class="title">《{{ questionnaireName }}》</span>
              <div class="extra"></div>
          </div>
      </template>

      <!-- 题干 -->
      <div>
        <el-form :model="questionModel" :rules="rules" label-width="auto" label-position="left" :inline="true">
          <el-form-item label="题干" prop="question" class="mb">
            <el-input v-model="questionModel.question" placeholder="请输入题干" class="notInline" :disabled="!edit" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="选项1" prop="option1" class="mb">
            <el-input v-model="questionModel.option1" placeholder="请输入选项1" class="notInline" :disabled="!edit" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="选项2" prop="option2" class="mb">
            <el-input v-model="questionModel.option2" placeholder="请输入选项2" class="notInline" :disabled="!edit" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="选项3" prop="option3" class="mb">
            <el-input v-model="questionModel.option3" placeholder="请输入选项3" class="notInline" :disabled="!edit" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="选项4" prop="option4" class="mb">
            <el-input v-model="questionModel.option4" placeholder="请输入选项4" class="notInline" :disabled="!edit" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="选项1分值" prop="score1">
            <el-input-number v-model="questionModel.score1" placeholder="输入分值1" :min="0" :max="100" :precision="0" :disabled="!edit"></el-input-number>
          </el-form-item>
          <el-form-item label="选项2分值" prop="score2">
            <el-input-number v-model="questionModel.score2" placeholder="输入分值2" :min="0" :max="100" :precision="0" :disabled="!edit"></el-input-number>
          </el-form-item>
          <el-form-item label="选项3分值" prop="score3">
            <el-input-number v-model="questionModel.score3" placeholder="输入分值3" :min="0" :max="100" :precision="0" :disabled="!edit"></el-input-number>
          </el-form-item>
          <el-form-item label="选项4分值" prop="score4">
            <el-input-number v-model="questionModel.score4" placeholder="输入分值4" :min="0" :max="100" :precision="0" :disabled="!edit"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="mt">
        <el-button type="primary" v-if="!edit" @click="editQuestion">修改题目</el-button>
        <el-button type="danger" v-if="!edit" @click="toDeleteQuestion">删除题目</el-button>
        <el-button type="success" v-if="!edit" @click="toAddQuestion">新建题目</el-button>
        <el-button type="success" v-if="edit === 1" @click="confirmEdit">确认修改</el-button>
        <el-button type="info" v-if="edit === 1" @click="cancelEdit">取消修改</el-button>
        <el-button type="success" v-if="edit === 2" @click="confirmAdd">确认新建</el-button>
        <el-button type="info" v-if="edit === 2" @click="cancelAdd">取消新建</el-button>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :disabled="edit" :default-page-size="1" :total="questionData.length" :current-page="index + 1" @current-change="changePage"/>
      </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '@/api/questionnaire.js'
import { ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter();

// 问卷id和问卷名称
const questionnaireId = ref(0)
const questionnaireName = ref('')
questionnaireId.value = router?.currentRoute?._rawValue?.query?.questionnaireId
questionnaireName.value = router?.currentRoute?._rawValue?.query?.questionnaireName

// 所有题目数据
const questionData = ref([])

// 题目的index
const index = ref(0)
// 单题数据模型
const questionModel = ref({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    score1: 0,
    score2: 0,
    score3: 0,
    score4: 0,
})
// 暂存题目信息的变量
const questionStore = {}

// 声明获取题目的函数并调用
const toGetQuestions = async (questionnaireId) => {
    const result = await getQuestions(questionnaireId)
    // 没有题目的情况
    if(result?.data.length === 0) {
      toAddQuestion()
      return
    }
    questionData.value = result?.data
    // console.log('questionData',questionData.value);
    changeQuestion(index.value)
}
toGetQuestions(questionnaireId.value)

// 编辑态标志,0表示非编辑态,1表示编辑态,2表示新建态
const edit = ref(0)

// 进入编辑题目状态
const editQuestion = () => {
  edit.value = 1
  // 保存原题目信息
  Object.assign(questionStore,questionModel.value)
}

// 取消编辑状态
const cancelEdit = () => {
  edit.value = 0
  // 复原原题目信息
  questionModel.value = questionStore
  questionStore.value = {}
}

// 确认修改题目
const confirmEdit = async () => {
  await updateQuestion(questionModel.value)
  ElMessage.success('修改成功')
  edit.value = 0
  toGetQuestions(questionnaireId.value)
}

// 新建题目
const toAddQuestion = () => {
  questionData.value.push({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    score1: 0,
    score2: 0,
    score3: 0,
    score4: 0,
  })
  index.value = questionData.value.length - 1
  changeQuestion(index.value)
  edit.value = 2
}

// 确认新建
const confirmAdd = async () => {
  if(questionModel.value.question.trim() === '') {
    ElMessage.error('请填写题干')
    return
  }
  let s = ''
  let allScore = 0
  for(let i = 1; i <= 4; i++) {
    s = 'option' + i
    if(questionModel.value[s].trim() === '') {
      ElMessage.error('请填写选项' + i)
      return
    }
    s = 'score' + i
    allScore += questionModel.value[s]
  }
  if(allScore === 0) {
    ElMessage.error('至少有一个选项能得分')
    return
  }
  let params = Object.assign(
      {
        questionnaireId: questionnaireId.value
      },
      questionModel.value
    )
  await addQuestion(params)
  ElMessage.success('添加成功')
  edit.value = 0
  toGetQuestions(questionnaireId.value)
}

// 取消新建
const cancelAdd = () => {
  if(questionData.value.length === 1) {
    ElMessage.error('问卷至少要有一个题目')
    return
  }
  edit.value = 0
  questionData.value.pop()
  index.value = 0
  changeQuestion(index.value)
}

// 删除题目
const toDeleteQuestion = () => {
      //提示用户  确认框
      ElMessageBox.confirm(
        '确定要删除该题目吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            if(questionData.value.length === 1) {
              ElMessage.error('问卷至少要有一个题目')
              return
            }
            //调用接口
            await deleteQuestion(questionModel.value.id);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            index.value--
            toGetQuestions(questionnaireId.value)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}

const checkQuestion = (rule,value,callback) => {
  if(value.trim() === '') callback(new Error('请输入题干'))
  else if(value.length > 50) callback(new Error('题干不能多于50个字符'))
  else callback()
}

const checkOption = (rule,value,callback) => {
  if(value.trim() === '') callback(new Error('请输入选项'))
  else if(value.length > 20) callback(new Error('选项不能多于20个字符'))
  else callback()
}

const rules = {
  question: [
    { required: true, trigger: ['change','blur'], validator: checkQuestion }
  ],
  option1: [
    { required: true, trigger: ['change','blur'], validator: checkOption }
  ],
  option2: [
    { required: true, trigger: ['change','blur'], validator: checkOption }
  ],
  option3: [
    { required: true, trigger: ['change','blur'], validator: checkOption }
  ],
  option4: [
    { required: true, trigger: ['change','blur'], validator: checkOption }
  ],
  score1: [{ required: true, message: '请输入选项1分值' }],
  score2: [{ required: true, message: '请输入选项2分值' }],
  score3: [{ required: true, message: '请输入选项3分值' }],
  score4: [{ required: true, message: '请输入选项4分值' }],
}

// 切换题目
const changeQuestion = (index) => {
// 修改显示题目的数据模型
  questionModel.value.id = questionData.value[index].id
  questionModel.value.question = questionData.value[index].question
  questionModel.value.option1 = questionData.value[index].option1
  questionModel.value.option2 = questionData.value[index].option2
  questionModel.value.option3 = questionData.value[index].option3
  questionModel.value.option4 = questionData.value[index].option4
  questionModel.value.score1 = questionData.value[index].score1
  questionModel.value.score2 = questionData.value[index].score2
  questionModel.value.score3 = questionData.value[index].score3
  questionModel.value.score4 = questionData.value[index].score4
}

// 点击页数切换题目
const changePage = (page) => {
  index.value = page - 1
  changeQuestion(page - 1)
}

// 返回问卷列表
const backToOverview = () => {
  router.push('/questionnaire/overview')
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
        font-size: 20px;
    }

    .extra {
      width: 150px;
    }
  }

  .mb {
    margin-bottom: 25px;
  }

  .notInline {
    --el-input-width: 1100px
  }

  .mt {
    margin-top: 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

}
</style>