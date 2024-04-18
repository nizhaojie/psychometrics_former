<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">健康指导建议</span>
              <el-input
                    v-model="searchParameter"
                    style="max-width: 1000px"
                    placeholder="请输入查询关键词"
                    class="input-with-select"
                    @keydown.enter="search"
                >
                    <template #prepend>
                        <el-select v-model="searchType" style="width: 115px">
                            <el-option label="建议人" value="建议人" />
                            <el-option label="建议时间" value="建议时间" />
                            <el-option label="未读" value="未读" />
                            <el-option label="已读" value="已读" />
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
      <el-table :data="guidanceShowing" style="width: 100%">
            <el-table-column label="建议人" prop="giver" width="200">
                <template #default="scope">
                    <div>{{ scope?.row?.giver }}</div>
                </template>
            </el-table-column>
            <el-table-column label="建议内容" prop="content">
              <template #default="scope">
                <el-text truncated class="clickable" @click="openGuidance(scope?.row?.id,scope?.row?.content,scope?.row?.state)">{{ scope?.row?.content }}</el-text>
              </template>
            </el-table-column>
            <el-table-column label="建议时间" prop="time" width="200"></el-table-column>
            <el-table-column label="建议状态" prop="state" width="100">
                <template #default="scope">
                    <el-tag size="large" :type="scope?.row?.state == 1 ? 'success' : 'danger'">
                      {{ scope?.row?.state === 1 ? '已读' : '未读' }}
                    </el-tag>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :default-page-size="6" :total="guidance.length" :current-page="page" @current-change="changePage"/>
        </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getGuidanceByReceiver, updateGuidance } from '@/api/guidance.js'
import { ElMessage, ElPagination, ElInput, ElText } from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
import { useRouter } from 'vue-router'
const router = useRouter();
// 总数据
const guidance = ref([])
// 原数据备份
let guidanceStore = []
// 展示的单页数据
const guidanceShowing = ref([])
// 页数
const page = ref(1)
// 切换页码
const changePage = (index) => {
  page.value = index
  guidanceShowing.value = guidance.value.slice((index - 1) * 6,index * 6)
}
// 获取建议数据
const getGuidanceData = async (username) => {
  let res = await getGuidanceByReceiver(username)
  guidance.value = [...res?.data]
  guidanceStore = [...res?.data]
  guidanceShowing.value = guidance.value.slice((page.value - 1) * 6,page.value * 6)
  let i = 0
  guidanceStore.forEach(val => {
    if(val.state === 0) i++
  })
  if(i > 0) ElMessage.warning("您有" + i + "条未读建议")
}
getGuidanceData(userInfoStore?.info?.username)

// 关键词类型
const searchType = ref('关键词类型')
// 搜索的关键词
const searchParameter = ref('')
const arr = ["未读","已读"]
// 搜索函数
const search = () => {
  if(searchType.value === '关键词类型') {
    ElMessage.error('请选择查询关键词的类型')
    return
  }
  if(searchParameter.value.trim() === '' && !arr.includes(searchType.value)) {
    // 重置
    guidance.value = guidanceStore
    changePage(1)
    return
  }
  if(searchType.value === '建议人') {
    guidance.value = guidanceStore.filter(item => item.giver.includes(searchParameter.value))
  } else if(searchType.value === '建议时间') {
    guidance.value = guidanceStore.filter(item => item.time.includes(searchParameter.value))
  } else if(searchType.value === '已读') {
    guidance.value = guidanceStore.filter(item => item.state === 1)
  } else if(searchType.value === '未读') {
    guidance.value = guidanceStore.filter(item => item.state === 0)
  } else guidance.value = []
  changePage(1)
}

// 打开建议详情页
const openGuidance = async (id,content,state) => {
  if(state === 0) await updateGuidance(id)
  router.push({
    path: '/guidance/detail',
    query: {
      content: content
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