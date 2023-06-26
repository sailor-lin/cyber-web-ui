import * as echarts from 'echarts';
import theme from '@/assets/style/theme.js';

const colors = [theme['primary-color'], '#FAC858', '#93BEFF', '#507AFC', '#283E81'];
export const lineChart = {
  color: colors,
  title: {
    show: true,
    text: '图表标题',
    top: 0,
    left: 10,
    textStyle: {
      fontSize: 12,
      fontFamily: "PingFang SC",
      fontWeight: 400,
      color: '#2D3D48',
    }
  },
  xAxis: {
    show: true,
    type: "category",
    boundaryGap: '0%',
    gridIndex: 0,
    // 轴文本样式
    axisLabel: { 
      show: true,
      fontSize: 12,
      fontFamily: "PingFang SC",
      fontWeight: "normal",
      color: "#666666",
    },
    // 轴线样式
    axisLine: {
      lineStyle: {
        color: "#838fa71a"
      },
    },
    // 轴刻度样式
    axisTick: {
      show: false,
    },
    data: []
  },
  yAxis: {
    name: '',
    nameLocation: 'end', // y轴名称位置
    nameTextStyle: {
      fontSize: 14,
      fontFamily: 'PingFang SC',
      fontWeight: 400,
      color: '#212121',
      align: 'right',
    },
    type: 'value',
    axisLine: { show: false, }, // 显示坐标轴轴线
    splitLine: {  // 横线
      show: true,
      lineStyle: {
        color: '#838fa71a',
        // type: 'dashed',
      },
    },
    axisLabel: { 
      show: true,
      fontSize: 12,
      fontFamily: "PingFang SC",
      fontWeight: "normal",
      color: "#666666",
    },
    gridIndex: 0,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    show: true,
    showContent: true,
    textStyle: {
      color: '#FFFFFF',
      decoration: 'none',
      fontFamily: 'Verdana, sans-serif',
      fontSize: 15,
      fontStyle: 'nomarl',
      fontWeight: 'bold',
    },
    extraCssText: 'background: #5c6476cc; border-radius: 4px; color: #ffffff;',
  },
  grid: {
    left: 60,
    top: 60,
    bottom: 40,
    right: 45,
  },
  legend: {
    show: true,
    data: [],
    textStyle: {
      fontSize: 12,
      color: "#333333",
    },
  },
  lineSeries: {
    data: [],
    type: 'line',
    symbolSize: 10, // 拐点大小
    symbol: 'circle', // 拐点类型
    xAxisIndex: 0,
    yAxisIndex: 0,
    coordinateSystem: 'cartesian2d',
    itemStyle: {
      color: '#FFFFFF',
      borderColor: theme['primary-color'],
      borderWidth: 2,
    },
    lineStyle: {
      color: theme['primary-color'],
    },
    emphasis: {
      itemStyle: {
        borderWidth: 4,
      }
    },
  },
  backgroundSeries: {
    data: [],
    type: 'bar',
    barMaxWidth: 60,
    xAxisIndex: 0,
    yAxisIndex: 0,
    coordinateSystem: 'cartesian2d',
    itemStyle: {
      color: 'transparent',
    },
    emphasis: {
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1.5, [{
          offset: 0,
          color: '#FFFFFF'
        }, {
            offset: 1,
            color: '#05c0591a'
        }]),
      }
    }
  }
}

export const pieChart = {
  title: {
    show: false,
  },
  legend: {
    show: false,
  },
  // graphic: {
  //   type: 'text',
  //   left: 'center',
  //   bottom: 'middle',
  //   style: {
  //     fontSize: 12,
  //     textAlign: 'center',
  //     textVerticalAlign: 'middle',
  //     rich: {
  //       total:{
  //         fontSize: 30,
  //         fontFamily : "Oswald-Regular, Oswald",
  //         color: '#FFFFFF',
  //         textVerticalAlign: 'bottom',
  //       },
  //     },
  //     text: computed(() => `{total|${props.total}}`),
  //   }
  // },
  series: {
    type: 'pie',
    radius: ['70%', '100%'],
    center: ['center', 'center'],
    left: 0,
    avoidLabelOverlap: true,
    silent: false, // 不响应鼠标事件
    emphasis: { // 高亮状态
      disabled: true,
      label: {
        show: false,
        fontSize: 14,
        fontWeight: 'bold'
      },
    },
    labelLine: {
      show: false,
      length: 5
    },
    startAngle: 180,
  }
};
