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
                            <el-option label="用户名称" value="用户名称" />
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
                <div>
                    <el-button type="primary" @click="openDialog">新建任务</el-button>
                </div>
          </div>
      </template>
      <el-table :data="taskShowing" style="width: 100%">
            <el-table-column label="用户名称" prop="receiver" width="200">
                <template #default="scope">
                    <div>{{ scope?.row?.receiver }}</div>
                </template>
            </el-table-column>
            <el-table-column label="任务问卷" prop="questionnaireName">
              <template #default="scope">
                <el-text truncated>{{ scope?.row?.questionnaireName }}</el-text>
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

        <!-- 添加问卷弹窗 -->
        <el-dialog v-model="dialogVisible" title="新建测评任务" width="40%">
            <el-form :model="taskModel" label-width="120px" style="padding-right: 30px">
                <el-form-item label="用户名称" prop="receiver">
                    <el-select v-model="taskModel.receiver" filterable multiple collapse-tags collapse-tags-tooltip placeholder="选择用户">
                      <el-option v-for="item in users" :key="item.username" :value="item.username"></el-option>
                    </el-select>    
                </el-form-item>
                <el-form-item label="任务问卷" prop="questionniare"> 
                  <el-select v-model="taskModel.questionnaire" value-key="id" filterable placeholder="选择任务问卷">
                    <el-option v-for="item in questionnaire" :key="item.id" :value="item" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="toAddTask"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :default-page-size="6" :total="task.length" :current-page="page" @current-change="changePage"/>
        </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getTaskByGiver, addTask } from '@/api/task.js'
import { getQuestionnaire } from '@/api/questionnaire.js'
import { findByOrganization } from '@/api/user.js'
import { ElMessage, ElPagination, ElInput, ElText, ElMessageBox } from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
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
  let res = await getTaskByGiver(username)
  task.value = [...res?.data]
  taskStore = [...res?.data]
  taskShowing.value = task.value.slice((page.value - 1) * 6,page.value * 6)
}
const getQuestionnaireData = async (organization) => {
  let res = await getQuestionnaire(organization)
  questionnaire.value = [...res?.data]
}
getTaskData(userInfoStore?.info?.username)
getQuestionnaireData(userInfoStore?.info?.organization)

//控制添加问卷弹窗
const dialogVisible = ref(false)

//用户数据
const users = ref([])

// 任务数据模型
const taskModel = ref({
  giver: userInfoStore?.info?.username,
  receiver: [],
  questionnaire: null,
  time: "",
  state: 0
})

// 打开新建任务框
const openDialog = async () => {
  dialogVisible.value = true
  let res = await findByOrganization(userInfoStore?.info?.organization)
  users.value = res?.data
}

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
  if(searchType.value === '用户名称') {
    task.value = taskStore.filter(item => item.receiver.includes(searchParameter.value))
  } else if(searchType.value === '创建时间') {
    task.value = taskStore.filter(item => item.time.includes(searchParameter.value))
  } else if(searchType.value === '任务状态' && searchParameter.value === '已做') {
    task.value = taskStore.filter(item => item.state === 1)
  } else if(searchType.value === '任务状态' && searchParameter.value === '未做') {
    task.value = taskStore.filter(item => item.state === 0)
  } else task.value = []
  changePage(1)
}

// 添加任务
const toAddTask = async () => {
  if(taskModel.value.receiver.length === 0) {
    ElMessage.error("请选择用户")
    return
  }
  if(taskModel.value.questionnaire === null) {
    ElMessage.error("请输入测评问卷")
    return
  }
  let now = new Date();
  let year = now.getFullYear();
  let month = ('0' + (now.getMonth() + 1)).slice(-2);
  let day = ('0' + now.getDate()).slice(-2);
  let hours = ('0' + now.getHours()).slice(-2);
  let minutes = ('0' + now.getMinutes()).slice(-2);
  taskModel.value.time = year + '/' + month + '/' + day + '/ ' + hours + ':' + minutes
  ElMessageBox.confirm(
        '创建任务后无法修改，请再次确认内容无误',
        '温馨提示',
        {
            confirmButtonText: '已确认',
            cancelButtonText: '再看看',
            type: 'warning',
        }
    )
        .then(async () => {
          let task = {
            giver: taskModel.value.giver,
            receiver: "",
            questionnaireId: taskModel.value.questionnaire.id,
            questionnaireName: taskModel.value.questionnaire.name,
            time: taskModel.value.time,
            state: 0
          }
          let taskList = []
          for(let i = 0; i < taskModel.value.receiver.length; i++) {
            task.receiver = taskModel.value.receiver[i]
            // 要JSON.parse(JSON.stringify())转换一下不然push进去的是地址，最终的receiver值都是最后一个值
            taskList.push(JSON.parse(JSON.stringify(task)))
          }
          await addTask(taskList)
          await getTaskData(userInfoStore?.info?.username)
          dialogVisible.value = false
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

}
</style>