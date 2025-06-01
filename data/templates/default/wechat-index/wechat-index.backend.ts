import { Process, Store } from '@yaoapps/client';
import { Request } from '@yao/sui';

// 获取指数数据
function GetIndexData(r: Request) {
  return {
    date: '12月30日指数',
    index: '1,804,475',
    trend: 3.57,
    period: '30d',
    chart_data: getMockChartData('30d')
  };
}

// 获取图表数据
function ApiGetChartData(period: string) {
  return {
    chart_data: getMockChartData(period)
  };
}

// 模拟不同时间周期的数据
function getMockChartData(period: string) {
  switch (period) {
    case '7d':
      return [
        { date: '12/24', value: 1600000 },
        { date: '12/25', value: 1650000 },
        { date: '12/26', value: 1700000 },
        { date: '12/27', value: 1750000 },
        { date: '12/28', value: 1780000 },
        { date: '12/29', value: 1790000 },
        { date: '12/30', value: 1804475 }
      ];
    case '30d':
      return [
        { date: '12/1', value: 1500000 },
        { date: '12/5', value: 1550000 },
        { date: '12/10', value: 1600000 },
        { date: '12/15', value: 1650000 },
        { date: '12/20', value: 1700000 },
        { date: '12/25', value: 1750000 },
        { date: '12/30', value: 1804475 }
      ];
    case 'all':
      return [
        { date: '1/1', value: 800000 },
        { date: '2/21', value: 1600000 },
        { date: '4/12', value: 700000 },
        { date: '6/2', value: 600000 },
        { date: '7/23', value: 500000 },
        { date: '9/12', value: 2400000 },
        { date: '11/2', value: 1600000 },
        { date: '12/30', value: 1804475 }
      ];
    default:
      return [];
  }
}