<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
            <el-button type="primary" @click="backToOverview">
                <el-icon><Back /></el-icon>
                返回问卷列表
            </el-button>
              <span class="title">《{{ questionnaireName }}》</span>
              <div class="extra">
                  <el-button type="primary" @click="submitQuestionnaire" :disabled="percentage !== 100">提交问卷</el-button>
              </div>
          </div>
          <!-- 进度 -->
          <div class="progress">
            <el-progress :percentage="percentage"></el-progress>
          </div>
      </template>

      <!-- 题干 -->
      <div class="body">
        <span class="question">{{ questionModel.question }}</span>
        <el-radio-group v-model="tempAnswer">
          <el-radio :label="1" border @change="changeAnswer(1)" class="mb">{{ questionModel.option1 }}</el-radio>
          <el-radio :label="2" border @change="changeAnswer(2)" class="mb">{{ questionModel.option2 }}</el-radio>
          <el-radio :label="3" border @change="changeAnswer(3)" class="mb">{{ questionModel.option3 }}</el-radio>
          <el-radio :label="4" border @change="changeAnswer(4)" class="mb">{{ questionModel.option4 }}</el-radio>
          </el-radio-group>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :default-page-size="1" :total="questionData.length" :current-page="index + 1" @current-change="changePage"/>
      </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getQuestions } from '@/api/questionnaire.js'
import { addRecord } from '@/api/record.js'
import { ElRadio, ElProgress, ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter();
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

// 问卷id和问卷名称
const questionnaireId = ref(0)
const questionnaireName = ref('')
questionnaireId.value = router?.currentRoute?._rawValue?.query?.questionnaireId
questionnaireName.value = router?.currentRoute?._rawValue?.query?.questionnaireName


// 所有题目数据
const questionData = ref([])

// 所有选择数据
const answers = new Map()
const tempAnswer = ref(0)
// 题目的index
const index = ref(0)
// 单题数据模型
const questionModel = ref({
    id: 0,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: ''
})
// 问卷进度
const percentage = ref(0)


// 选择选项
const changeAnswer = (answer) => {
  // 记录选择
  answers.set(questionModel.value.id, answer)
  // 修改进度
  percentage.value = answers.size / questionData.value.length * 100
  // 自动跳入下一题
  if(percentage.value !== 100) {
    index.value ++
    changeQuestion(index.value)
  }
}

// 声明获取题目的函数并调用
const toGetQuestions = async (questionnaireId) => {
    const result = await getQuestions(questionnaireId)
    questionData.value = result?.data
    // console.log('questionData',questionData.value);
    changeQuestion(0)
}
toGetQuestions(questionnaireId.value)

// 切换题目
const changeQuestion = (index) => {
// 修改显示题目的数据模型
  questionModel.value.id = questionData.value[index].id
  questionModel.value.question = questionData.value[index].question
  questionModel.value.option1 = questionData.value[index].option1
  questionModel.value.option2 = questionData.value[index].option2
  questionModel.value.option3 = questionData.value[index].option3
  questionModel.value.option4 = questionData.value[index].option4
  // 显示之前选择的选项
  tempAnswer.value = answers.get(questionModel.value.id) || 0
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

// 提交问卷
const submitQuestionnaire = () => {
  let score = 0
  let answer = 0
  let s = ''
  let s1 = ''
  let s2 = ''
  let s3 = ''
  for(let i = 0; i < questionData.value.length; i++) {
    answer = answers.get(questionData.value[i].id)
    s = 'score' + answer
    score += questionData.value[i][s]
  }
  for(let i = 1; i < 6; i++) {
    s1 = 'lowerlimit' + i
    s2 = 'upperlimit' + i
    s3 = 'result' + i
    if(score > router?.currentRoute?._rawValue?.query[s1] && score < router?.currentRoute?._rawValue?.query[s2]) {
      let res = router?.currentRoute?._rawValue?.query[s3]
      // 添加记录
      toAddRecord(score,res)
      // 切换到结论界面
      router.push({
        path: '/record/detail',
        query: {
          score: score,
          result: res
        }
      })
      return
    }
  }
}

// 添加记录
const toAddRecord = (score,res) => {
  let now = new Date();
  let year = now.getFullYear();
  let month = ('0' + (now.getMonth() + 1)).slice(-2);
  let day = ('0' + now.getDate()).slice(-2);
  let hours = ('0' + now.getHours()).slice(-2);
  let minutes = ('0' + now.getMinutes()).slice(-2);
  let record = {
    userId: userInfoStore?.info?.id,
    questionnaireName: questionnaireName.value,
    time: year + '/' + month + '/' + day + '/ ' + hours + ':' + minutes,
    score: score,
    report: res
  }
  // console.log('record',record);
  addRecord(record)
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
    }
  }

  .progress {
      margin-top: 20px;
  }

  .body {
    height: 350px;
    .question {
      display: flex;
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: 600;
      color: #409EFF;
    }
    .mb {
      margin-bottom: 10px;
    }
  }

  

  .pagination{
    display: flex;
    justify-content: center;
  }

}
</style>