<template>
  <div class="report-body">
    <div id="day-report">
      <div class="day-report">
        <div class="dr-header">
          <img class="drh-img" :src="headerImg" alt="标题图片">
          <div class="drh-title">
            <p class="drh-small-title">嘉为蓝鲸WeOps</p>
            <p class="drh-large-title">应用状态管理日报</p>
            <span class="drh-date-title">12月27日</span>
          </div>
        </div>
        <div class="dr-header-blue" />
        <div class="dr-content">
          <div class="drc-ex drc-ex-situation">
            <p class="drc-ex-title">
              异常概况
            </p>
            <div class="dr-exs-list">
              <div class="mb-23">
                <div class="dr-exs-item mr-20">
                  <img :src="exceptionImg" alt="">
                  <p class="img-title">异常</p>
                  <p class="dr-exs-item-text">
                    昨日遗留4个异常，今日新增14个异常，13个异常已关闭，5个未关闭
                  </p>
                </div>
                <div class="dr-exs-item">
                  <img :src="bizImg" alt="">
                  <p class="img-title">业务</p>
                  <p class="dr-exs-item-text">
                    当前1个业务存在危险异常，2个业务存在警告异常，7个业务未发现异常
                  </p>
                </div>
              </div>
              <div>
                <div class="dr-exs-item mr-20">
                  <img :src="hostImg" alt="">
                  <p class="img-title">主机实例</p>
                  <p class="dr-exs-item-text">
                    当前1台主机存在危险异常，3台主机存在警告异常，103台主机未发现异常
                  </p>
                </div>
                <div class="dr-exs-item">
                  <img :src="otherImg" alt="">
                  <p class="img-title">其他类型实例</p>
                  <p class="dr-exs-item-text">
                    当前1个实例存在危险异常，57个实例未发现异常
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="drc-ex drc-ex-type">
            <p class="drc-ex-title">
              异常类型分布
            </p>
            <div id="drc-ext-pie" class="drc-ext-pie" />
          </div>
          <div class="drc-ex drc-ex-time">
            <p class="drc-ex-title">
              异常时间分布
            </p>
            <div id="drc-ext-week-bar" class="drc-ext-bar mb-50" />
            <div id="drc-ext-bar" class="drc-ext-bar" />
          </div>
          <div class="drc-ex drc-ex-detail">
            <p class="drc-ex-title">
              异常清单
            </p>
            <table class="drc-table">
              <tr>
                <th v-for="th in detailThList" :key="'detail'+th.value" :class="th.width">{{ th.name }}</th>
              </tr>
              <tr v-for="(td,tdKey) in detailData" :key="'detail'+tdKey">
                <td v-for="th in detailThList" :key="'detail'+tdKey+th.value" :class="th.width">
                  <span v-if="td[th['value']]==='未关闭'" class="text-danger">
                    {{ td[th['value']] }}
                  </span>
                  <span v-else>
                    {{ td[th['value']] }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div class="drc-ex drc-ex-biz">
            <p class="drc-ex-title">
              业务异常数top
            </p>
            <table class="drc-table">
              <tr>
                <th v-for="th in bizThList" :key="'biz'+th.value" :class="th.width">{{ th.name }}</th>
              </tr>
              <tr v-for="(td,tdKey) in bizData" :key="'biz'+tdKey">
                <td v-for="th in bizThList" :key="'biz'+tdKey+th.value" :class="th.width">
                  <span v-if="td[th['value']]==='未关闭'" class="text-danger">
                    {{ td[th['value']] }}
                  </span>
                  <span v-else>
                    {{ td[th['value']] }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div class="drc-ex drc-ex-inst">
            <p class="drc-ex-title">
              实例异常数top
            </p>
            <table class="drc-table">
              <tr>
                <th v-for="th in instThList" :key="'inst'+th.value" :class="th.width">{{ th.name }}</th>
              </tr>
              <tr v-for="(td,tdKey) in instData" :key="'inst'+tdKey">
                <td v-for="th in instThList" :key="'inst'+tdKey+th.value" :class="th.width">
                  <span v-if="td[th['value']]==='未关闭'" class="text-danger">
                    {{ td[th['value']] }}
                  </span>
                  <span v-else>
                    {{ td[th['value']] }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="dr-footer">
          <img :src="logo" alt="">
          <p>研运至简 无限可为</p>
        </div>
      </div>
    </div>
    <div class="test-footer">
      <Button type="info" @click="reportToImage">后端导出</Button>
      <Button type="primary" @click="exportImg">导出图片</Button>
      <Button type="info" @click="htmlToImg">html2canvas</Button>
      <img id="day-image" src="" alt="截图">
    </div>
  </div>
</template>

<script>
// import * as defaultSettings from '@/settings'
import * as echarts from 'echarts'
// import * as defaultSettings from '@/settings'

export default {
  name: 'DayReport',
  data() {
    // const url = process.env.NODE_ENV === 'development' ? defaultSettings.devProxyTarget : window.siteUrl
    return {
      // headerImg: url + 'static/report/report-header.jpg',
      // exceptionImg: url + 'static/report/situation-exception.png',
      // bizImg: url + 'static/report/situation-biz.png',
      // hostImg: url + 'static/report/situation-host.png',
      // otherImg: url + 'static/report/situation-other.png',
      // logo: url + 'static/report/logo.png',
      headerImg: require(`../../assets/report/report-header.jpg`),
      exceptionImg: require(`../../assets/report/situation-exception.png`),
      bizImg: require(`../../assets/report/situation-biz.png`),
      hostImg: require(`../../assets/report/situation-host.png`),
      otherImg: require(`../../assets/report/situation-other.png`),
      logo: require(`../../assets/report/logo.png`),
      detailThList: [],
      detailData: [],
      bizThList: [],
      bizData: [],
      instThList: [],
      instData: []
    }
  },
  created() {

  },
  mounted() {
    this.initExType()
    this.initExTime()
    this.initExWeekTime()
    this.initExData()
  },
  methods: {
    initExType() {
      const pieChart = echarts.init(document.getElementById('drc-ext-pie'), null, { renderer: 'svg' })
      const pieData = [
        {
          name: '告警异常',
          value: 10
        },
        {
          name: '巡检异常',
          value: 4
        },
        {
          name: '基线异常',
          value: 3
        },
        {
          name: '备份异常',
          value: 2
        },
        {
          name: '其他异常',
          value: 6
        }
      ]
      const legendData = []
      pieData.forEach(pie => {
        legendData.push({
          name: pie.name,
          icon: 'circle',
          textStyle: {
            color: '#ffffff',
            fontSize: 13,
            padding: [5, 0]
          }
        })
      })
      const pieOption = {
        color: ['#ff761b', '#2873c4', '#ffbd00', '#7f7f7f', '#ffffff'],
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          bottom: 50,
          borderWidth: 1,
          borderColor: '#43a4ff',
          data: legendData
        },
        series: {
          type: 'pie',
          radius: ['40%', '80%'],
          label: {
            color: '#ffffff',
            fontSize: 13,
            formatter: ({ data }) => {
              return data.name + '：' + data.value
            }
          },
          data: pieData
        }
      }
      pieChart.setOption(pieOption)
    },
    initExWeekTime() {
      const barChart = echarts.init(document.getElementById('drc-ext-week-bar'), null, { renderer: 'svg' })
      const barOption = {
        color: ['#0068f8'],
        grid: {
          left: '3%',
          right: '4%',
          top: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['上周遗留', '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: 13
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          },
          axisLabel: {
            show: true,
            color: '#ffffff',
            fontSize: 13
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 30,
            data: [4, 1, 1, 3, 4, 3, 3, 2]
          }
        ]
      }
      barChart.setOption(barOption)
    },
    initExTime() {
      const barChart = echarts.init(document.getElementById('drc-ext-bar'), null, { renderer: 'svg' })
      const barOption = {
        color: ['#0068f8'],
        grid: {
          left: '3%',
          right: '4%',
          top: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['昨日遗留', '0:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00', '5:00-6:00',
            '6:00-7:00', '7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
            '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
            '19:00-20:00', '20:00-21:00', '21:00-22:00', '23:00-24:00'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: 13
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          },
          axisLabel: {
            show: true,
            color: '#ffffff',
            fontSize: 13
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 15,
            data: [4, 1, 1, 3, 4, 3, 3, 2, 1, 4, 1, 1, 3, 4, 3, 0, 2, 1, 3, 4, 3, 0, 2, 1]
          }
        ]
      }
      barChart.setOption(barOption)
    },
    initExData() {
      this.detailThList = [
        {
          name: '业务',
          value: 'biz',
          width: 'width-100'
        }, {
          name: '实例',
          value: 'inst',
          width: 'width-160'
        }, {
          name: '实例类型',
          value: 'instType',
          width: 'width-100'
        }, {
          name: '异常类型',
          value: 'exType',
          width: 'width-100'
        }, {
          name: '产生时间',
          value: 'whenCreated',
          width: 'width-100'
        }, {
          name: '异常状态',
          value: 'exStatus',
          width: 'width-100'
        }
      ]
      this.detailData = [{
        biz: '蓝鲸',
        inst: 'APPO（192.169.1.1）123123213213213梦小明小梦小梦',
        instType: '主机',
        exType: '告警',
        whenCreated: '2020-12-29 03:45',
        exStatus: '未关闭'
      }, {
        biz: '蓝鲸',
        inst: 'APPO（192.169.1.1）小明小梦小梦小明小梦小梦',
        instType: '主机',
        exType: '基线',
        whenCreated: '2020-12-29 03:45',
        exStatus: '未关闭'
      }, {
        biz: '蓝鲸',
        inst: 'BKDATA（192.169.1.3）',
        instType: '主机',
        exType: '告警',
        whenCreated: '2020-12-29 03:45',
        exStatus: '未关闭'
      }, {
        biz: '工单系统',
        inst: 'tomcat01（192.169.1.2)',
        instType: 'Tomcat',
        exType: '告警',
        whenCreated: '2020-12-29 03:45',
        exStatus: '已关闭'
      }, {
        biz: '流程系统',
        inst: 'mongodb02(192.169.2.3)',
        instType: 'MongoDB',
        exType: '告警',
        whenCreated: '2020-12-29 03:45',
        exStatus: '已关闭'
      }]

      this.bizThList = [{
        name: '业务',
        value: 'biz',
        width: 'width-150'
      }, {
        name: '运维人员',
        value: 'operator',
        width: 'width-210'
      }, {
        name: '异常数',
        value: 'exCount',
        width: 'width-150'
      }, {
        name: '未关闭异常数',
        value: 'notCloseEx',
        width: 'width-150'
      }]

      this.bizData = [{
        biz: '蓝鲸',
        operator: 'admin()',
        exCount: 10,
        notCloseEx: 3
      }, {
        biz: '工单系统',
        operator: 'admin(admin)',
        exCount: 7,
        notCloseEx: 1
      }, {
        biz: '流程系统',
        operator: 'runsen(润森)',
        exCount: 1,
        notCloseEx: 1
      }]

      this.instThList = [{
        name: '业务',
        value: 'biz',
        width: 'width-150'
      }, {
        name: '实例',
        value: 'inst',
        width: 'width-210'
      }, {
        name: '实例类型',
        value: 'instType',
        width: 'width-150'
      }, {
        name: '异常数',
        value: 'exCount',
        width: 'width-150'
      }]
      this.instData = [{
        biz: '蓝鲸',
        inst: 'APPT（192.169.1.2）',
        instType: '主机',
        exCount: 3
      }, {
        biz: '工单系统',
        inst: 'mongodb02（192.169.2.3）',
        instType: 'MongoDB',
        exCount: 0
      }, {
        biz: '流程系统',
        inst: 'host04（192.169.3.1）',
        instType: 'Tomcat',
        exCount: 3
      }, {
        biz: '蓝鲸',
        inst: 'APPT（192.169.1.2）',
        instType: '主机',
        exCount: 3
      }, {
        biz: '蓝鲸',
        inst: 'APPT（192.169.1.2）',
        instType: '主机',
        exCount: 3
      }, {
        biz: '蓝鲸',
        inst: 'APPT（192.169.1.2）',
        instType: '主机',
        exCount: 3
      }, {
        biz: '蓝鲸',
        inst: 'APPT（192.169.1.2）',
        instType: '主机',
        exCount: 3
      }, {
        biz: '蓝鲸',
        inst: 'APPT（192.169.1.2）',
        instType: '主机',
        exCount: 3
      }]
    },
    htmlToImg() {
      this.$toImage('day-report', '截图')
    },
    exportImg() {
      const VueEnv = process.env.NODE_ENV
      const ApiUrl = VueEnv === 'production' ? window.siteUrl : 'http://127.0.0.1:8070/'
      const eleForm = document.createElement('form')
      eleForm.id = 'eleForm'
      eleForm.method = 'post'
      eleForm.action = ApiUrl + 'report/export_img'
      eleForm.target = '导出'
      const eleInput = document.createElement('input')
      eleInput.type = 'hidden'
      eleInput.name = 'content'
      eleInput.value = document.getElementById('day-report').innerHTML
      eleForm.appendChild(eleInput)
      eleForm.addEventListener('onsubmit', function() {
        this.$CwMessage('success', '导出图片')
      })
      document.body.appendChild(eleForm)
      eleForm.submit()
      document.body.removeChild(eleForm)
    },
    reportToImage() {
      const VueEnv = process.env.NODE_ENV
      const ApiUrl = VueEnv === 'production' ? window.siteUrl : 'http://127.0.0.1:8070/'
      const eleForm = document.createElement('form')
      eleForm.id = 'eleForm'
      eleForm.method = 'post'
      eleForm.action = ApiUrl + 'report/report_to_image'
      eleForm.target = '导出'
      eleForm.addEventListener('onsubmit', function() {
        this.$CwMessage('success', '导出图片')
      })
      document.body.appendChild(eleForm)
      eleForm.submit()
      document.body.removeChild(eleForm)
    }
  }
}
</script>
<style>
  .mb-23 {
    margin-bottom: 23px;
  }

  .mb-50 {
    margin-bottom: 50px;
  }

  .mr-20 {
    margin-right: 20px;
  }

  .text-danger {
    color: #ff0000;
  }

  .width-100 {
    width: 100px;
  }

  .width-150 {
    width: 150px;
  }

  .width-160 {
    width: 160px;
  }

  .width-210 {
    width: 210px;
  }

  .report-body {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
  }

  #day-report {
    width: 700px;
    margin: 0 auto;
  }

  .day-report {
    position: relative;
    width: 700px;
    margin: 0 auto;
    background-color: #43a4ff;
    font-family: '微软雅黑', sans-serif;
  }

  .dr-header {
    width: 700px;
    height: 244px;
  }

  .drh-img {
    width: 100%;
    height: 100%;
  }

  .drh-title {
    position: absolute;
    left: 40px;
    top: 73px;
    color: #FFFFFF;
    text-align: left;
  }

  .drh-small-title {
    font-size: 20px;
  }

  .drh-large-title {
    font-size: 36px;
    line-height: 40px;
  }

  .drh-date-title {
    display: inline-block;
    height: 25px;
    text-align: center;
    line-height: 25px;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    background-color: #ffffff;
    color: #081C5B;
    border-radius: 15px;
    margin-top: 15px;
    padding: 0 10px
  }

  .dr-header-blue {
    width: 100%;
    height: 20px;
    background-color: rgba(29, 123, 247, 1);
  }

  .dr-content {
    width: 100%;
    padding: 20px;
  }

  .drc-ex {
    font-weight: 400;
    font-style: normal;
    color: #FFFFFF;
  }

  .drc-ex-title {
    text-align: center;
    font-size: 36px;
    line-height: 36px;
    margin-bottom: 25px;
  }

  .drc-ex-situation {
    margin-bottom: 40px;
  }

  .dr-exs-list {
  }

  .dr-exs-item {
    display: inline-block;
    width: 320px;
    height: 170px;
    border: 1px solid rgba(242, 242, 242, 1);
    padding: 20px;
    text-align: center;
  }

  .dr-exs-item img {
    width: 50px;
    height: 50px;
  }

  .dr-exs-item .img-title {
    font-size: 20px;
  }

  .dr-exs-item .dr-exs-item-text {
    font-size: 16px;
    text-align: left;
  }

  .drc-ex-type {
    text-align: center;
    margin-bottom: 40px;
  }

  .drc-ex-type .drc-ext-pie {
    width: 660px;
    height: 420px;
    position: relative;
  }

  .drc-ex-time {
    text-align: center;
    margin-bottom: 40px;
  }

  .drc-ex-time .drc-ext-bar {
    width: 660px;
    height: 240px;
    position: relative;
  }

  .drc-ex-detail {
    text-align: center;
    margin-bottom: 40px;
  }

  .drc-ex-biz {
    text-align: center;
    margin-bottom: 40px;
  }

  .drc-ex-inst {
    text-align: center;
    margin-bottom: 20px;
  }

  .drc-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ffffff;
  }

  .drc-table, .drc-table td, .drc-table th {
    border: 1px solid #ffffff;
    font-weight: 400;
    font-size: 13px;
    color: #FFFFFF;
  }

  .drc-table th {
    text-align: center;
    background-color: #007df7;
    padding: 2px;
  }

  .drc-table td {
    text-align: center;
    padding: 10px 0;
  }

  .dr-footer {
    width: 100%;
    height: 100px;
    padding: 15px;
    background-color: #007df7;
    text-align: center;
  }

  .dr-footer img {
    width: 244px;
    height: 50px;
  }

  .dr-footer p {
    text-align: center;
    font-size: 14px;
    color: #FFFFFF;
  }

  .test-footer {
    width: 700px;
    padding: 20px;
    margin: 0 auto;
  }

  #day-image {
    display: block;
    width: 100%;
  }
</style>
