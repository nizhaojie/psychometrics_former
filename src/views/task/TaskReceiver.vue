<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">测评任务</span>
              <el-input
                    v-model="searchParameter"
                    style="max-width: 1000px"
                    placeholder="请输入查询关键词"
                    class="input-with-select"
                    @keydown.enter="search"
                >
                    <template #prepend>
                        <el-select v-model="searchType" style="width: 115px">
                            <el-option label="发布者" value="发布者" />
                            <el-option label="创建时间" value="创建时间" />
                            <el-option label="任务状态" value="任务状态" />
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
          </div>
      </template>
      <el-table :data="taskShowing" style="width: 100%">
            <el-table-column label="发布者" prop="receiver" width="200">
                <template #default="scope">
                    <div>{{ scope?.row?.giver }}</div>
                </template>
            </el-table-column>
            <el-table-column label="任务问卷" prop="questionnaireName">
              <template #default="scope">
                <el-text truncated class="clickable" @click="openQuestionnaire(scope?.row?.questionnaireId,scope?.row?.state,scope?.row?.id)">{{ scope?.row?.questionnaireName }}</el-text>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="time" width="200"></el-table-column>
            <el-table-column label="任务状态" prop="state" width="100">
                <template #default="scope">
                    <el-tag size="large" :type="scope?.row?.state == 1 ? 'success' : 'danger'">
                      {{ scope?.row?.state === 1 ? '已做' : '未做' }}
                    </el-tag>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :default-page-size="6" :total="task.length" :current-page="page" @current-change="changePage"/>
        </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getTaskByReceiver, updateTask } from '@/api/task.js'
import { getQuestionnaireById } from '@/api/questionnaire.js'
import { ElMessage, ElPagination, ElInput, ElText, ElMessageBox } from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
import { useRouter } from 'vue-router'
const router = useRouter();
// 总数据
const task = ref([])
// 原数据备份
let taskStore = []
// 展示的单页数据
const taskShowing = ref([])
// 问卷数据
const questionnaire = ref([])
// 页数
const page = ref(1)
// 切换页码
const changePage = (index) => {
  page.value = index
  taskShowing.value = task.value.slice((index - 1) * 6,index * 6)
}
// 获取任务数据
const getTaskData = async (username) => {
  let res = await getTaskByReceiver(username)
  task.value = [...res?.data]
  taskStore = [...res?.data]
  taskShowing.value = task.value.slice((page.value - 1) * 6,page.value * 6)
  let i = 0
  taskStore.forEach(val => {
    if(val.state === 0) i++
  })
  if(i > 0) ElMessage.warning("您有" + i + "个未完成的测评任务")
}

getTaskData(userInfoStore?.info?.username)

// 关键词类型
const searchType = ref('关键词类型')
// 搜索的关键词
const searchParameter = ref('')
// 搜索函数
const search = () => {
  if(searchType.value === '关键词类型') {
    ElMessage.error('请选择查询关键词的类型')
    return
  }
  if(searchParameter.value.trim() === '') {
    // 重置
    task.value = taskStore
    changePage(1)
    return
  }
  if(searchType.value === '发布者') {
    task.value = taskStore.filter(item => item.giver.includes(searchParameter.value))
  } else if(searchType.value === '创建时间') {
    task.value = taskStore.filter(item => item.time.includes(searchParameter.value))
  } else if(searchType.value === '任务状态' && searchParameter.value === '已做') {
    task.value = taskStore.filter(item => item.state === 1)
  } else if(searchType.value === '任务状态' && searchParameter.value === '未做') {
    task.value = taskStore.filter(item => item.state === 0)
  } else task.value = []
  changePage(1)
}

const openQuestionnaire = async (questionnaireId,state,taskId) => {
  if(state === 1) {
    ElMessage.success("已完成任务无法重复完成")
    return
  }
  let res = await getQuestionnaireById(questionnaireId)
  let questionnaireModel = res.data[0]
  await updateTask(taskId)
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

    .input-with-select .el-input-group__prepend {
      background-color: var(--el-fill-color-blank);
    }
  }

  .progress {
      margin-top: 20px;
  }

  .body {
    height: 350px;

  }

  .pagination{
    position: fixed;
    bottom: 120px;
    left: 50%;
  }

  .clickable {
    cursor: pointer;
  }

  .clickable:hover{
    color: blue;
  }

}
</style>