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
                            <el-option label="被建议人" value="被建议人" />
                            <el-option label="建议时间" value="建议时间" />
                            <el-option label="建议状态" value="建议状态" />
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
                    <el-button type="primary" @click="openDialog">新建建议</el-button>
                </div>
          </div>
      </template>
      <el-table :data="guidanceShowing" style="width: 100%">
            <el-table-column label="被建议人" prop="receiver" width="200">
                <template #default="scope">
                    <div class="clickable" @click="openGuidance(scope?.row?.content)">{{ scope?.row?.receiver }}</div>
                </template>
            </el-table-column>
            <el-table-column label="建议内容" prop="content">
              <template #default="scope">
                <el-text truncated>{{ scope?.row?.content }}</el-text>
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

        <!-- 添加问卷弹窗 -->
        <el-dialog v-model="dialogVisible" title="新建健康指导建议" width="80%">
            <el-form :model="guidanceModel" label-width="120px" style="padding-right: 30px">
                <el-form-item label="被建议人" prop="receiver">
                    <el-select v-model="guidanceModel.receiver" filterable placeholder="选择建议接受人">
                      <el-option v-for="item in users" :key="item.username" :value="item.username"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建议内容" prop="content"> 
                    <el-input v-model="guidanceModel.content" maxlength="1000" type="textarea" :rows="10" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="toAddGuidance"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :default-page-size="6" :total="guidance.length" :current-page="page" @current-change="changePage"/>
        </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getGuidanceByGiver, addGuidance } from '@/api/guidance.js'
import { findByOrganization } from '@/api/user.js'
import { ElMessage, ElPagination, ElInput, ElText, ElMessageBox } from 'element-plus'
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
  let res = await getGuidanceByGiver(username)
  guidance.value = [...res?.data]
  guidanceStore = [...res?.data]
  guidanceShowing.value = guidance.value.slice((page.value - 1) * 6,page.value * 6)
}
getGuidanceData(userInfoStore?.info?.username)

//控制添加问卷弹窗
const dialogVisible = ref(false)

//用户数据
const users = ref([])

// 建议数据模型
const guidanceModel = ref({
  giver: userInfoStore?.info?.username,
  receiver: "",
  content: "",
  time: "",
  state: 0
})

// 打开新建建议框
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
    guidance.value = guidanceStore
    changePage(1)
    return
  }
  if(searchType.value === '被建议人') {
    guidance.value = guidanceStore.filter(item => item.receiver.includes(searchParameter.value))
  } else if(searchType.value === '建议时间') {
    guidance.value = guidanceStore.filter(item => item.time.includes(searchParameter.value))
  } else if(searchType.value === '建议状态' && searchParameter.value === '已读') {
    guidance.value = guidanceStore.filter(item => item.state === 1)
  } else if(searchType.value === '建议状态' && searchParameter.value === '未读') {
    guidance.value = guidanceStore.filter(item => item.state === 0)
  } else guidance.value = []
  changePage(1)
}

// 添加健康指导建议
const toAddGuidance = async () => {
  if(!guidanceModel.value.receiver) {
    ElMessage.error("请选择建议接受人")
    return
  }
  if(guidanceModel.value.content.trim() === '') {
    ElMessage.error("请输入有效建议内容")
    return
  }
  let now = new Date();
  let year = now.getFullYear();
  let month = ('0' + (now.getMonth() + 1)).slice(-2);
  let day = ('0' + now.getDate()).slice(-2);
  let hours = ('0' + now.getHours()).slice(-2);
  let minutes = ('0' + now.getMinutes()).slice(-2);
  guidanceModel.value.time = year + '/' + month + '/' + day + '/ ' + hours + ':' + minutes
  ElMessageBox.confirm(
        '建议给出后无法修改，请再次确认内容无误',
        '温馨提示',
        {
            confirmButtonText: '已确认',
            cancelButtonText: '再看看',
            type: 'warning',
        }
    )
        .then(async () => {
          await addGuidance(guidanceModel.value)
          await getGuidanceData(userInfoStore?.info?.username)
          dialogVisible.value = false
        })
}

// 打开建议详情页
const openGuidance = (content) => {
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