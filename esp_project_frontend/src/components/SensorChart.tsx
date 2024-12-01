import ReactECharts from 'echarts-for-react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface ChartData {
  co2: string;
  temperature: string;
  humidity: string;
  created_at: string;
}

interface SensorChartProps {
  type: 'CO2' | '溫度' | '濕度';
}

const SensorChart: React.FC<SensorChartProps> = ({ type }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://192.168.1.101:8080/historical');
        setData(result.data.reverse());
      } catch (error) {
        console.error('獲取數據失敗:', error);
      }
    };

    const updateData = async () => {
      try {
        const result = await axios.get('http://localhost:8080/latest');
        const newDataPoint = result.data;
        
        setData(prevData => {
          const newData = [...prevData, {
            ...newDataPoint,
            created_at: new Date().toISOString()
          }];
          
          if (newData.length > 100) {
            return newData.slice(-100); // 只保留最後100筆數據
          }
          return newData;
        });
      } catch (error) {
        console.error('更新數據失敗:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(updateData, 5000);

    return () => clearInterval(intervalId);
  }, [type]);

  const getOption = () => {
    const dates = data.map(item => new Date(item.created_at).toLocaleTimeString());
    let values: string[] = [];
    let yAxisLabel = '';
    let color = '';

    switch (type) {
      case 'CO2':
        values = data.map(item => item.co2);
        yAxisLabel = 'PPM';
        color = '#10B981';
        break;
      case '溫度':
        values = data.map(item => item.temperature);
        yAxisLabel = '°C';
        color = '#EF4444';
        break;
      case '濕度':
        values = data.map(item => item.humidity);
        yAxisLabel = '%';
        color = '#3B82F6';
        break;
    }

    const numericValues = values.map(v => parseFloat(v));
    const maxValue = Math.max(...numericValues);
    const minValue = Math.min(...numericValues);
    const avgValue = (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(1);

    return {
      backgroundColor: {
        type: 'pattern',
        image: new Image(),
        repeat: 'no-repeat',
        imageWidth: '100%',
        imageHeight: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      },
      title: {
        text: `${type}歷史趨勢圖`,
        subtext: `最大值: ${maxValue} ${yAxisLabel} | 最小值: ${minValue} ${yAxisLabel} | 平均值: ${avgValue} ${yAxisLabel}`,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
        },
        subtextStyle: {
          fontSize: 16,
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff'
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#fff',
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLabel: {
          rotate: 45,
          formatter: (value: string) => {
            return value.split(':').slice(0, 2).join(':');
          },
          margin: 15,
          color: '#fff',
          fontSize: 12,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        },
        axisLine: {
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameLocation: 'end',
        nameGap: 15,
        nameTextStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        },
        axisLine: {
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
            type: 'dashed'
          }
        }
      },
      series: [{
        name: type,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#fff',
          borderWidth: 2,
          borderColor: color
        },
        lineStyle: {
          width: 3,
          color: color,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 5
        },
        areaStyle: {
          opacity: 0.3,
          color: color
        },
        data: values,
        markPoint: {
          silent: true,
          animation: false,
          symbol: 'pin',
          symbolSize: 40,
          itemStyle: {
            color: color
          },
          label: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            formatter: function(params: { data: { value: number } }) {
              return params.data.value.toFixed(1);
            }
          },
          data: [
            {
              type: 'max',
              name: '最大值',
              label: {
                position: 'top'
              }
            },
            {
              type: 'min',
              name: '最小值',
              label: {
                position: 'bottom'
              }
            }
          ]
        }
      }]
    };
  };

  return (
    <div className="relative">
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url('https://upload-os-bbs.hoyolab.com/upload/2024/11/30/14272058/ff9d765d1c740e6db857bee8271c1511_6850027948406254813.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
          filter: 'blur(6px)'
        }}
      />
      <div className="relative z-10 p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <ReactECharts 
          ref={chartRef}
          option={getOption()} 
          style={{ height: '400px', width: '100%' }}
          opts={{ 
            renderer: 'svg',
            width: 'auto',
            height: 'auto'
          }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
};

export default SensorChart; 