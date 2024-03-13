<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
            <el-button type="primary" @click="backToOverview">
                <el-icon><Back /></el-icon>
                返回问卷列表
            </el-button>
              <span class="title">您的分数为: {{ score }}</span>
              <!-- <div class="extra">
                  <el-button type="primary" @click="submitQuestionnaire" :disabled="percentage !== 100">提交问卷</el-button>
              </div> -->
          </div>
      </template>

      <!-- 题干 -->
      <div class="body">
        <el-text>{{ result }}</el-text>
      </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

import { ElText } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter();
// 问卷id和问卷名称
const score = ref(0)
const result = ref('')
score.value = router?.currentRoute?._rawValue?.query?.score
result.value = router?.currentRoute?._rawValue?.query?.result

// 返回问卷列表
const backToOverview = () => {
  router.push('/questionnaire/overview')
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