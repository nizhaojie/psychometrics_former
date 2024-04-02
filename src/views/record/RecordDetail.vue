<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
            <!-- <el-button type="primary" @click="backToQuestionnaireOverview">
                <el-icon><Back /></el-icon>
                返回问卷列表
            </el-button> -->
            <el-button type="primary" @click="backToRecordOverview">
                <el-icon><Back /></el-icon>
                返回测评记录列表
            </el-button>
              <span class="questionnaireName">《{{ questionnaireName }}》</span>
              <span class="title">分数为: {{ score }}</span>
          </div>
      </template>

      <!-- 报告 -->
      <div class="body">
        <el-text>{{ result }}</el-text>
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
// 问卷名称，问卷分数，问卷结论
const questionnaireName = ref('')
const score = ref(0)
const result = ref('')
questionnaireName.value = router?.currentRoute?._rawValue?.query?.questionnaireName
score.value = router?.currentRoute?._rawValue?.query?.score
result.value = router?.currentRoute?._rawValue?.query?.result

// 返回问卷列表
// const backToQuestionnaireOverview = () => {
//   router.push('/questionnaire/overview')
// }

// 返回测评记录列表
const backToRecordOverview = () => {
  if(userInfoStore?.info?.administrator === 1) {
    router.push('/record/administratorOverview')
  } else if(userInfoStore?.info?.administrator === 0) {
    router.push('/record/overview')
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