import { Component, EventData, EventDetail, $Backend } from '@yao/sui';
import * as echarts from 'echarts';

const self = this as Component;
let chartInstance: echarts.ECharts | null = null;

// 初始化组件
self.once = async function () {
  await renderChart();
};

// 切换时间周期
self.setPeriod = async (event: Event, data: EventData) => {
  const period = data['period'];
  const response = await $Backend('/wechat-index').Call('GetChartData', period);
  self.store.Set('period', period);
  self.store.SetJSON('chart_data', response.chart_data);
  await renderChart();
};

// 渲染趋势图表
async function renderChart() {
  const chartData = self.store.GetJSON('chart_data');
  if (!chartData || chartData.length === 0) return;

  const chartContainer = self.$root.find('[s\\:render="trend-chart"]').elm() as HTMLElement;
  
  // 如果图表实例已存在，销毁它
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 初始化 ECharts 实例
  chartInstance = echarts.init(chartContainer);

  // 准备数据
  const xData = chartData.map((d: any) => d.date);
  const yData = chartData.map((d: any) => d.value);

  // 配置图表选项
  const option = {
    grid: {
      top: 20,
      right: 30,
      bottom: 30,
      left: 50,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const data = params[0];
        return `${data.name}<br/>${data.value.toLocaleString()}`;
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        formatter: (value: number) => value.toLocaleString()
      }
    },
    series: [{
      data: yData,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#2563EB'
      },
      lineStyle: {
        color: '#2563EB',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(37, 99, 235, 0.3)'
        }, {
          offset: 1,
          color: 'rgba(37, 99, 235, 0)'
        }])
      }
    }]
  };

  // 设置图表选项并渲染
  chartInstance.setOption(option);

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    chartInstance?.resize();
  });
}