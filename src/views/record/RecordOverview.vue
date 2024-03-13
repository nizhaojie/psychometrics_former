<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span class="title">111</span>
              <!-- <div class="extra">
                  <el-button type="primary" @click="submitQuestionnaire" :disabled="percentage !== 100">提交问卷</el-button>
              </div> -->
          </div>
      </template>

      <!-- 题干 -->
      <div class="body">
        <el-text>111</el-text>
      </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getRecord } from '@/api/record';
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const records = ref([])
records.value = getRecord(userInfoStore?.info?.id)


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

  }

}
</style>