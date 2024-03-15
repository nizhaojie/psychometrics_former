<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">测评记录</span>
              <!-- <div class="extra">
                  <el-button type="primary" @click="submitQuestionnaire" :disabled="percentage !== 100">提交问卷</el-button>
              </div> -->
          </div>
      </template>
      <el-table :data="records" style="width: 100%">
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
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getRecord } from '@/api/record';
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
// 测评记录数据
const records = ref([])
const getRecordData = async (userId) => {
  let res = await getRecord(userId)
  records.value = [...res?.data]
}
getRecordData(userInfoStore?.info?.id)

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
  }

  .progress {
      margin-top: 20px;
  }

  .body {
    height: 350px;

  }

}
</style>