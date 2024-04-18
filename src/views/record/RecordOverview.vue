<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">测评记录</span>
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
                            <el-option label="及格" value="及格" />
                            <el-option label="不及格" value="不及格" />
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
            <el-table-column label="测评时间" prop="time"></el-table-column>
            <el-table-column label="测评分数" prop="score">
              <template #default="scope">
                {{ scope?.row?.score !== -1 ? scope?.row?.score : '暂无'  }}
              </template>
            </el-table-column>
            <el-table-column label="记录状态" prop="score" width="100">
                <template #default="scope">
                    <el-tag size="large" :type="scope?.row?.state === 1 ?'success':'danger'">
                      {{ scope?.row?.state === 1 ? '及格' : '不及格' }}
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
import { ElMessage, ElPagination, ElInput } from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
import { useRouter } from 'vue-router'
const router = useRouter();
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

const arr = ["及格","不及格"]

// 搜索函数
const search = () => {
  if(searchType.value === '关键词类型') {
    ElMessage.error('请选择查询关键词的类型')
    return
  }
  if(searchParameter.value.trim() === '' && !arr.includes(searchType.value)) {
    // 重置
    records.value = recordsStore
    changePage(1)
    return
  }
  if(searchType.value === '问卷名称') {
    records.value = recordsStore.filter(item => item.questionnaireName.includes(searchParameter.value))
  } else if(searchType.value === '测评时间') {
    records.value = recordsStore.filter(item => item.time.includes(searchParameter.value))
  } else if(searchType.value === '及格') {
    records.value = recordsStore.filter(item => item.state === 1)
  } else if(searchType.value === '不及格') {
    records.value = recordsStore.filter(item => item.state === 0)
  } else records.value = []
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