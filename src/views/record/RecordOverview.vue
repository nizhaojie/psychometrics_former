<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">测评记录</span>
              <!-- <div class="extra">
                  <el-button type="primary" @click="submitQuestionnaire" :disabled="percentage !== 100">提交问卷</el-button>
              </div> -->
              <el-input
                    v-model="searchParameter"
                    style="max-width: 1000px"
                    placeholder="请输入查询关键词"
                    class="input-with-select"
                    @keydown.enter="search"
                >
                    <template #prepend>
                        <el-select v-model="searchType" style="width: 115px">
                            <el-option label="问卷名称" value="问卷名称" />
                            <el-option label="测评时间" value="测评时间" />
                            <el-option label="问卷状态" value="问卷状态" />
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
      <el-table :data="recordsShowing" style="width: 100%">
            <el-table-column label="问卷名称" prop="name" width="250">
                <template #default="scope">
                    <div class="clickable" @click="openRecord()">{{ scope?.row?.questionnaireName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="测评时间" prop="time"></el-table-column>
            <el-table-column label="测评分数" prop="score">
              <template #default="scope">
                {{ scope?.row?.score !== -1 ? scope?.row?.score : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column label="问卷状态" prop="score" width="100">
                <template #default="scope">
                    <el-tag size="large" :type="scope?.row?.score !== -1 ?'success':'danger'">
                      {{ scope?.row?.score !== -1 ? '已完成' : '未完成' }}
                    </el-tag>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :default-page-size="6" :total="records.length" :current-page="page" @current-change="changePage"/>
        </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getRecord } from '@/api/record';
import { ElMessage, ElMessageBox, ElPagination, ElInput } from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
// 测评记录数据
const records = ref([])
// 测评记录数据备份
let recordsStore = []
// 展示的测评记录数据
const recordsShowing = ref([])
// 页数
const page = ref(1)
// 切换页码
const changePage = (index) => {
  page.value = index
  recordsShowing.value = records.value.slice((index - 1) * 6,index * 6)
}
// 获取记录数据
const getRecordData = async (userId) => {
  let res = await getRecord(userId)
  records.value = [...res?.data]
  recordsStore = [...res?.data]
  recordsShowing.value = records.value.slice((page.value - 1) * 6,page.value * 6)
}
getRecordData(userInfoStore?.info?.id)

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
    records.value = recordsStore
    changePage(1)
    return
  }
  records.value = recordsStore
  if(searchType.value === '问卷名称') {
    records.value = records.value.filter(item => item.questionnaireName.includes(searchParameter.value))
  } else if(searchType.value === '测评时间') {
    records.value = records.value.filter(item => item.time.includes(searchParameter.value))
  } else if(searchType.value === '问卷状态' && searchParameter.value === '已完成') {
    records.value = records.value.filter(item => item.score >= 0)
  } else if(searchType.value === '问卷状态' && searchParameter.value === '未完成') {
    records.value = records.value.filter(item => item.score === -1)
  } else records.value = []
  changePage(1)
}

const openRecord = () => {

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