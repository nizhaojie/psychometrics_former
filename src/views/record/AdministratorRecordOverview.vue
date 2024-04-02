<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">普通用户测评记录</span>
              <el-input
                    v-model="searchParameter"
                    style="max-width: 1050px"
                    placeholder="选择关键词类型并输入关键词进行查询"
                    class="input-with-select"
                    @keydown.enter="search"
                >
                    <template #prepend>
                        <el-select v-model="searchType" style="width: 115px">
                            <el-option label="用户名称" value="用户名称" />
                            <el-option label="问卷名称" value="问卷名称" />
                            <el-option label="测评时间" value="测评时间" />
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
                    <div class="clickable" @click="openRecord(scope?.row?.score,scope?.row?.report,scope?.row?.questionnaireName)">{{ scope?.row?.questionnaireName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="测评用户" prop="username"></el-table-column>
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
                <el-empty description="选择关键词类型并输入关键词进行查询" />
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
import { getRecordByUserName, getRecordByQuestionnaireName, getRecordByTime } from '@/api/record';
import { ElMessage, ElPagination, ElInput } from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
import { useRouter } from 'vue-router'
const router = useRouter();
// 测评记录数据
const records = ref([])
// 展示的测评记录数据
const recordsShowing = ref([])
// 页数
const page = ref(1)
// 切换页码
const changePage = (index) => {
  page.value = index
  recordsShowing.value = records.value.slice((index - 1) * 6,index * 6)
}

// 关键词类型
const searchType = ref('关键词类型')
// 搜索的关键词
const searchParameter = ref('')
// 搜索函数
const search = async () => {
  if(searchType.value === '关键词类型') {
    ElMessage.error('请选择查询关键词的类型')
    return
  }
  if(searchParameter.value.trim() === '') {
    ElMessage.error('请输入查询关键词')
    return
  }
  if(searchType.value === '用户名称') {
    let res = await getRecordByUserName(searchParameter.value,userInfoStore?.info?.organization)
    records.value = [...res?.data]
  } else if(searchType.value === '问卷名称') {
    let res = await getRecordByQuestionnaireName(searchParameter.value,userInfoStore?.info?.organization)
    records.value = [...res?.data]
  } else if(searchType.value === '测评时间') {
    let res = await getRecordByTime(searchParameter.value,userInfoStore?.info?.organization)
    records.value = [...res?.data]
  }
  changePage(1)
}

const openRecord = (score,report,questionnaireName) => {
  router.push({
    path: '/record/detail',
    query: {
      score: score,
      result: report,
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