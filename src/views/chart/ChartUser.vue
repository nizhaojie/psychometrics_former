<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
            <el-button type="primary" @click="backToRecordOverview">
                <el-icon><Back /></el-icon>
                返回测评记录列表
            </el-button>

          </div>
      </template>

      <div class="chartDom">
        <div class="body" ref="chartDom1"></div>
        <div class="body" ref="chartDom2"></div>
      </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useUserInfoStore from '@/stores/userInfo.js'
import { getRecord } from '@/api/record';
import * as echarts from 'echarts';
const userInfoStore = useUserInfoStore();
const router = useRouter();
const chartDom1 = ref()
const chartDom2 = ref()


// 测评记录数据
const records = ref([])
// 饼图数据
let pieData = ref([])
// 柱状图数据
let columnData1 = ref([])
let columnData2 = ref([])

// 获取记录数据
const getRecordData = async (userId) => {
  let res = await getRecord(userId)
  records.value = [...res?.data]
  console.log('records',records.value);
  let tempmap1 = new Map()
  let tempmap2 = new Map()
  records.value.forEach(val => {
    let questionnaireName = val.questionnaireName
    if(tempmap1.has(questionnaireName)) {
      tempmap1.set(questionnaireName,tempmap1.get(questionnaireName) + 1)
      tempmap2.set(questionnaireName,tempmap2.get(questionnaireName) + val.score)
    } else {
      tempmap1.set(questionnaireName,1)
      tempmap2.set(questionnaireName,val.score)
    }
  })
  for(let [key, value] of tempmap1) {
    pieData.value.push({
      value: value,
      name: key
    })
    tempmap2.set(key,(tempmap2.get(key)/value).toFixed(2))
  }
  for(let [key, value] of tempmap2) {
    columnData1.value.push(key)
    columnData2.value.push(value)
  }
}

getRecordData(userInfoStore?.info?.id)

onMounted(() => {
  let myChart1 = echarts.init(chartDom1.value);
  let option1;
  let myChart2 = echarts.init(chartDom2.value);
  let option2;
  option1 = {
    title: {
      text: '问卷及完成次数',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: pieData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
     }
    ]
  };
  option2 = {
    title: {
      text: '各问卷平均分',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: columnData1.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: columnData2.value,
        type: 'bar'
      }
    ]
  };
  setTimeout(()=>{
    option1 && myChart1.setOption(option1);
    option2 && myChart2.setOption(option2);
  },500)
})

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
  }


  .chartDom {
    display: flex;
    .body {
      height: 350px;
      width: 600px;
    }
  }
}
</style>