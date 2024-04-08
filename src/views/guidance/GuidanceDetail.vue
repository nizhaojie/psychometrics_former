<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
            <el-button type="primary" @click="backToGuidanceOverview">
                <el-icon><Back /></el-icon>
                返回健康指导建议列表
            </el-button>
              <!-- <span class="questionnaireName">《{{ questionnaireName }}》</span> -->
              <!-- <span class="title">分数为: {{ score }}</span> -->
          </div>
      </template>

      <!-- 报告 -->
      <div class="body">
        <el-text>{{ content }}</el-text>
      </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElText } from 'element-plus'
import { useRouter } from 'vue-router'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const router = useRouter();
const content = ref('')
content.value = router?.currentRoute?._rawValue?.query?.content

// 返回健康指导建议列表
const backToGuidanceOverview = () => {
  if(userInfoStore?.info?.administrator === 1) {
    router.push('/guidance/giver')
  } else if(userInfoStore?.info?.administrator === 0) {
    router.push('/guidance/receiver')
  }
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

    .questionnaireName {
      font-size: large;
      font-weight: 600;
    }

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