<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="map-c">
      <div class="map-title">echarts深圳市地图</div>
      <el-select v-model="areaCode" size="mini" class="map-selector" placeholder="深圳市" @change="changeAreaCode">
        <el-option v-for="item in areaCodList" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <div id="szMap" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import szMapData from './szMapData/440300.js'
import dapengMapData from './szMapData/440301.json'
import luohuMapData from './szMapData/440303.json'
import futianMapData from './szMapData/440304.json'
import nanshanMapData from './szMapData/440305.json'
import baoanMapData from './szMapData/440306.json'
import longgangMapData from './szMapData/440307.json'
import yantianMapData from './szMapData/440308.json'
import longhuaMapData from './szMapData/440309.json'
import pingshanMapData from './szMapData/440310.json'
import guangmingMapData from './szMapData/440311.json'
import shenshanMapData from './szMapData/440312.json'
import lightLoop from '@/assets/images/lightLoop.png'

export default {
  name: 'Dashboard',
  data: function() {
    const getData = function(id) {
      const data = {
        1: { count: 100 },
        2: { count: 200 },
        3: { count: 300 }
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(data[id] || [])
        }, 300)
      })
    }

    return {
      areaCode: 440300,
      areaCodList: [ // 深圳各区code
        { code: 440300, name: '深圳市' },
        { code: 440301, name: '大鹏新区' },
        { code: 440303, name: '罗湖区' },
        { code: 440304, name: '福田区' },
        { code: 440305, name: '南山区' },
        { code: 440306, name: '宝安区' },
        { code: 440307, name: '龙岗区' },
        { code: 440308, name: '盐田区' },
        { code: 440309, name: '龙华区' },
        { code: 440310, name: '坪山区' },
        { code: 440311, name: '光明区' },
        { code: 440312, name: '深汕合作区' }
      ],
      szMapEChart: null, // 深圳地图
      szMapOption: { // 地图配置
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'click',
          formatter: function(params, ticket, callback) {
            getData(params.data.id).then(cData => {
              callback(ticket, `
                <div class="map-item-detail">
                  <div class="title">${params.data.name || ''}</div>
                  <div class="text">人数：<span class="val">${cData.count || ''}</span></div>
                </div>
              `)
            })
            return 'loading...'
          }
        },
        series: [],
        geo: {
          map: 'city',
          layoutCenter: ['50%', '50%'], // 设置后left/right/top/bottom等属性无效
          layoutSize: '90%',
          roam: true, // 开启鼠标缩放和漫
          aspectScale: 1, // 长宽比
          zoom: 2,
          label: {
            normal: { // 静态的时候展示样式
              show: true, // 是否显示地图省份得名称
              textStyle: {
                color: '#fff',
                fontFamily: 'Arial'
              }
            },
            emphasis: { // 动态展示的样式
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              areaColor: '#2D85E1',
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              areaColor: '#1c2f59',
              color: '#fff'
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.renderSzMap()
  },
  created() {
    echarts.registerMap('city', szMapData)
  },
  methods: {
    // 渲染深圳地图
    renderSzMap() {
      this.szMapOption.series = this.getSzMapSeries()
      this.szMapEChart = echarts.init(document.getElementById('szMap'))
      this.szMapEChart.setOption(this.szMapOption)
      window.onresize = function() {
        this.szMapEChart && this.szMapEChart.resize()
      }
    },
    // 地图落点
    getSzMapSeries() {
      const seriesList = [
        {
          name: 's1',
          data: [
            { id: 1, name: 'test1', areaCode: 440304, value: [114.05096, 22.541009] },
            { id: 2, name: 'test2', areaCode: 440303, value: [114.13166, 22.54836] },
            { id: 3, name: 'test3', areaCode: 440307, value: [114.24779, 22.71991] }
          ]
        }
      ]

      return seriesList.map(sData => {
        return {
          type: 'scatter',
          roam: false,
          zoom: 1,
          name: sData.name,
          coordinateSystem: 'geo',
          data: this.areaCode === 440300 ? sData.data : sData.data.filter(item => this.areaCode === item.areaCode),
          symbol: (params) => ('image://' + lightLoop), // 图标
          z: 2,
          symbolSize: [20, 20] // symbols图标大小
        }
      })
    },
    // 切换区域
    changeAreaCode() {
      const areaCodeMapDataKeyBy = {
        440300: szMapData,
        440301: dapengMapData,
        440303: luohuMapData,
        440304: futianMapData,
        440305: nanshanMapData,
        440306: baoanMapData,
        440307: longgangMapData,
        440308: yantianMapData,
        440309: longhuaMapData,
        440310: pingshanMapData,
        440311: guangmingMapData,
        440312: shenshanMapData
      }

      echarts.registerMap('city', areaCodeMapDataKeyBy[this.areaCode] || szMapData)
      this.szMapOption.geo.zoom = areaCodeMapDataKeyBy[this.areaCode] && this.areaCode === 440300 ? 1.8 : 1.2
      this.szMapOption.series = this.getSzMapSeries()
      this.szMapEChart.setOption(this.szMapOption, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style lang="scss">
.map-c {
  position: relative;
  background-color: #EFF9F8;

  .map-title {
    text-align: center;
    padding: 20px;
    font-size: 22px;
    font-weight: 500;
  }

  .map-selector {
    position: absolute;
    z-index: 99;
    top: 30px;
    right: 20px;
    width: 120px;

    .el-input {
      width: 120px !important;

      input {
        height: 22px;
        line-height: 22px;
      }
    }
  }

  #szMap {
    width: 100%;
    height: 750px;

    .map-item-detail {
      .title {
        font-size: 16px;
        color: #333333;
        font-weight: 500;
        margin-bottom: 10px;
      }

      .text {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
      }

      .val {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>
