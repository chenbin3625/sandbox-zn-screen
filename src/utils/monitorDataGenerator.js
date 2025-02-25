// 监控数据生成工具函数

// 仪表盘数据生成函数
export const generateDashboardData = () => {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const dayOfWeek = now.getDay();
  const month = now.getMonth() + 1;
  
  // 创建随机数生成器，基于日期的种子
  const seed = month * 100 + dayOfMonth;
  const randomBySeed = (min, max, seed) => {
    const x = Math.sin(seed) * 10000;
    const r = x - Math.floor(x);
    return min + r * (max - min);
  };
  
  // 格式化数字为保留两位小数并添加千分位
  const formatNumber = (number) => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // 1. 仪表盘数据 - 保留两位小数
  const gaugeValues = [
    parseFloat(randomBySeed(55, 75, seed).toFixed(2)),
    parseFloat(randomBySeed(65, 85, seed + 10).toFixed(2))
  ];
  
  // 2. 电力产业数据
  const yearTotalPower = randomBySeed(1100, 1400, seed + 20);
  const yearPlanPower = randomBySeed(1800, 2100, seed + 30);
  const yearTotalHeat = randomBySeed(2200, 2600, seed + 40);
  const yearPlanHeat = randomBySeed(3000, 3400, seed + 50);
  
  // 3. 表格数据
  const totalCapacity = 45000; // 总装机容量
  const totalGeneration = randomBySeed(1200, 1350, seed + 60); // 总发电量
  
  // 发电类型占比与季节相关
  let typePercentages = [];
  // 冬季(12-2月)：煤机占比高，光伏低
  if (month >= 12 || month <= 2) {
    typePercentages = [
      { type: "煤机", cap: 0.74, gen: 0.90 },
      { type: "燃机", cap: 0.12, gen: 0.04 },
      { type: "光伏", cap: 0.05, gen: 0.01 },
      { type: "风电", cap: 0.05, gen: 0.02 },
      { type: "水电", cap: 0.02, gen: 0.01 },
      { type: "垃圾", cap: 0.015, gen: 0.015 },
      { type: "污泥", cap: 0.001, gen: 0.001 },
      { type: "生物质", cap: 0.004, gen: 0.004 }
    ];
  }
  // 春秋季(3-5月,9-11月)：各类型均衡一些
  else if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) {
    typePercentages = [
      { type: "煤机", cap: 0.70, gen: 0.87 },
      { type: "燃机", cap: 0.10, gen: 0.03 },
      { type: "光伏", cap: 0.08, gen: 0.03 },
      { type: "风电", cap: 0.07, gen: 0.04 },
      { type: "水电", cap: 0.03, gen: 0.01 },
      { type: "垃圾", cap: 0.015, gen: 0.01 },
      { type: "污泥", cap: 0.001, gen: 0.001 },
      { type: "生物质", cap: 0.004, gen: 0.009 }
    ];
  }
  // 夏季(6-8月)：光伏占比高，水电高
  else {
    typePercentages = [
      { type: "煤机", cap: 0.68, gen: 0.84 },
      { type: "燃机", cap: 0.11, gen: 0.05 },
      { type: "光伏", cap: 0.09, gen: 0.04 },
      { type: "风电", cap: 0.06, gen: 0.03 },
      { type: "水电", cap: 0.04, gen: 0.02 },
      { type: "垃圾", cap: 0.015, gen: 0.01 },
      { type: "污泥", cap: 0.001, gen: 0.001 },
      { type: "生物质", cap: 0.004, gen: 0.009 }
    ];
  }
  
  // 为每种类型添加随机波动
  const tableDataArr = typePercentages.map(item => {
    const capRandom = randomBySeed(0.95, 1.05, seed + item.type.charCodeAt(0));
    const genRandom = randomBySeed(0.92, 1.08, seed + item.type.charCodeAt(0) + 100);
    
    const capValue = (totalCapacity * item.cap * capRandom);
    const genValue = (totalGeneration * item.gen * genRandom);
    const percentage = (genValue / totalGeneration * 100).toFixed(2) + "%";
    
    return {
      type: item.type,
      capacity: capValue.toFixed(2),
      generation: genValue.toFixed(2),
      percentage
    };
  });
  
  // 4. 数据一览
  const dataBoxesArr = [
    { 
      title: "装机容量", 
      value: `${Math.round(totalCapacity)} 兆瓦` 
    },
    { 
      title: "权益容量", 
      value: `${Math.round(totalCapacity * randomBySeed(0.65, 0.72, seed + 70))} 兆瓦` 
    },
    { 
      title: "船舶总运力", 
      value: `${Math.round(randomBySeed(140, 170, seed + 80))} 万吨` 
    },
    { 
      title: "港口吞吐能力", 
      value: `${Math.round(randomBySeed(2800, 3200, seed + 90))} 万吨` 
    },
    { 
      title: "城市燃气管网长度", 
      value: `${Math.round(randomBySeed(9800, 10500, seed + 100))} 公里` 
    },
    { 
      title: "煤化工产能", 
      value: `${Math.round(randomBySeed(18, 22, seed + 110))} 亿标方` 
    },
  ];
  
  // 5. 煤炭产业数据
  const yearPlanCoal = randomBySeed(6400, 6800, seed + 120);
  let yearTotalCoal = 0;
  
  // 基于当前月份计算完成量
  const monthProgress = month / 12;
  const seasonalFactor = month <= 2 ? 1.2 : // 冬季用煤多
                         month <= 5 ? 0.9 : // 春季用煤少
                         month <= 8 ? 0.85 : // 夏季用煤少
                         1.05; // 秋季用煤适中
                         
  // 计算年累计供煤量
  yearTotalCoal = yearPlanCoal * (monthProgress * 0.9 + randomBySeed(0.01, 0.06, seed + 130)) * seasonalFactor;
  
  // 当前库存基于工作日有波动
  const storageBase = randomBySeed(580, 640, seed + 140);
  let storage = storageBase;
  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 工作日
    storage += randomBySeed(-30, 30, seed + dayOfMonth);
  } else { // 周末
    storage += randomBySeed(-10, 10, seed + dayOfMonth);
  }
  
  // 计算完成率和同比增长
  const completionRate = (yearTotalCoal / yearPlanCoal * 100).toFixed(2) + "%";
  
  // 同比增长，基于日期产生-7%到5%之间的波动
  let yoyGrowth = randomBySeed(-7, 5, seed + 150).toFixed(2) + "%";
  const isNegative = yoyGrowth.includes('-');
  
  // 6. 煤化工产业数据
  const yearPlanGas = randomBySeed(18.5, 20.5, seed + 160);
  let yearTotalGas = 0;
  
  // 基于当前月份计算完成量，考虑季节因素
  yearTotalGas = yearPlanGas * (monthProgress * 0.95 + randomBySeed(0.01, 0.04, seed + 170)) * seasonalFactor;
  
  // 计算完成率和同比增长
  const gasCompletionRate = (yearTotalGas / yearPlanGas * 100).toFixed(2) + "%";
  
  // 同比增长，基于日期产生-8%到3%之间的波动
  let gasYoyGrowth = randomBySeed(-8, 3, seed + 180).toFixed(2) + "%";
  const isGasNegative = gasYoyGrowth.includes('-');
  
  return {
    gauges: [
      { title: "发电量", value: gaugeValues[0], unit: "单位：亿千瓦时" },
      { title: "供热量", value: gaugeValues[1], unit: "单位：万吨" },
    ],
    powerIndustryData: [
      { title: "年累计发电量", value: formatNumber(yearTotalPower) },
      { title: "年计划发电量", value: formatNumber(yearPlanPower) },
      { title: "年累计供热量", value: formatNumber(yearTotalHeat) },
      { title: "年计划供热量", value: formatNumber(yearPlanHeat) },
    ],
    tableHeaders: ["类型", "装机容量(兆瓦)", "年发电量(亿千瓦时)", "占比"],
    tableData: tableDataArr,
    dataBoxes: dataBoxesArr,
    coalIndustryData: [
      { value: `${storage.toFixed(2)} 万吨`, label: "当前库存", valueClass: "primary" },
      { value: completionRate, label: "完成率" },
      { value: yoyGrowth, label: "同比增长", valueClass: isNegative ? "negative" : "" },
    ],
    chemicalIndustryData: [
      { value: gasCompletionRate, label: "完成率" },
      { value: gasYoyGrowth, label: "同比增长", valueClass: isGasNegative ? "negative" : "" },
    ],
    barChartData: {
      coal: [
        { name: '年计划供煤量', value: yearPlanCoal.toFixed(2) },
        { name: '年累计供煤量', value: yearTotalCoal.toFixed(2) }
      ],
      gas: [
        { name: '年计划产气量', value: yearPlanGas.toFixed(2) },
        { name: '年累计产气量', value: yearTotalGas.toFixed(2) }
      ]
    }
  };
};

// 导出仪表盘数据存储键
export const DASHBOARD_DATA_KEY = 'dashboard_data';

// 1天的毫秒数
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

// 根据日期生成有规律的监控数据
export const generateRandomData = (count) => {
  const sampleData = [
    {
      name: '嘉华发电八号机CEMS脱硫出口SO2浓度',
      code: '2331.C80HTA50CQ003',
      company: '嘉华发电',
      equipment: '嘉华#8',
    },
    {
      name: '滨海热电三号机CEMS脱硫出口NOx浓度',
      code: '2181.C30HTA50CQ001',
      company: '滨海热电',
      equipment: '滨海#3',
    },
    {
      name: '镇海燃热十一号机CEMS出口NOx浓度',
      code: '2361.AB0HTA50CQ001',
      company: '镇海燃热',
      equipment: '镇燃热#21',
    },
    {
      name: '阿克苏热电二号机CEMS脱硫出口SO2浓度(折算值)',
      code: '2271.C20HTA50CQ003A',
      company: '阿克苏热电',
      equipment: '阿克苏#2',
    },
    {
      name: '乐清发电一号机发电机有功功率选择后',
      code: '2251.C10MKA01FE100',
      company: '乐清发电',
      equipment: '乐清#3',
    },
    {
      name: '凤台发电一号机CEMS脱硫出口粉尘浓度',
      code: '2121.C10HTA50CQ005',
      company: '凤台发电',
      equipment: '凤台#1',
    },
    {
      name: '萧山发电五号机CEMS出口SO2浓度',
      code: '2031.A50HTA50CQ003',
      company: '萧山发电',
      equipment: '萧燃#5',
    },
    {
      name: '萧山发电五号机CEMS出口NOx浓度(折算值)',
      code: '2031.A50HTA50CQ001A',
      company: '萧山发电',
      equipment: '萧燃#5',
    },
    {
      name: '凤台发电三号机CEMS脱硫出口NOx浓度',
      code: '2121.C30HTA50CQ001',
      company: '凤台发电',
      equipment: '凤台#3',
    },
  ];

  const exceptionTypes = ['中断', '超限', '故障'];
  
  // 获取当前日期
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  
  // 根据星期几调整异常分布
  const weekDay = currentDate.getDay(); // 0是周日，1-6是周一到周六
  
  // 根据不同星期几设置不同的异常类型权重
  const getExceptionTypeByDay = () => {
    if (weekDay === 1 || weekDay === 2) { // 周一周二多出现"中断"
      return exceptionTypes[Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 3)];
    } else if (weekDay === 3 || weekDay === 4) { // 周三周四多出现"超限" 
      return exceptionTypes[Math.random() < 0.5 ? 1 : Math.floor(Math.random() * 3)];
    } else { // 周五、周六、周日多出现"故障"
      return exceptionTypes[Math.random() < 0.5 ? 2 : Math.floor(Math.random() * 3)];
    }
  };

  return Array.from({ length: count }, (_, index) => {
    const sampleIndex = Math.floor(Math.random() * sampleData.length);
    const sample = sampleData[sampleIndex];
    
    // 根据当前日期设置合理的开始时间
    // 工作日(1-5)产生的异常较多，集中在最近7天内；周末(0,6)的异常较少，可能来自更早之前
    let daysAgo;
    if (weekDay >= 1 && weekDay <= 5) {
      // 工作日，70%的异常来自最近7天
      daysAgo = Math.random() < 0.7 ? Math.random() * 7 : Math.random() * 30;
    } else {
      // 周末，只有30%的异常来自最近7天
      daysAgo = Math.random() < 0.3 ? Math.random() * 7 : Math.random() * 30;
    }
    
    // 计算开始时间，基于当前日期往前推
    const startTime = new Date(currentDate);
    startTime.setDate(currentDay - daysAgo);
    
    // 计算合理的持续时间（根据异常类型）
    let durationHours;
    const exceptionType = getExceptionTypeByDay();
    
    // 不同类型的异常有不同的持续时间特征
    if (exceptionType === '中断') {
      // 中断通常持续时间较短，1-6小时
      durationHours = 1 + Math.random() * 5;
    } else if (exceptionType === '超限') {
      // 超限通常持续时间中等，2-12小时
      durationHours = 2 + Math.random() * 10;
    } else {
      // 故障通常持续时间较长，4-24小时
      durationHours = 4 + Math.random() * 20;
    }
    
    // 计算结束时间
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    
    // 确保结束时间不超过当前时间
    if (endTime > currentDate) {
      endTime.setTime(currentDate.getTime());
      durationHours = (endTime - startTime) / (1000 * 60 * 60);
    }

    return {
      key: (index + 1).toString(),
      name: sample.name,
      code: sample.code,
      company: sample.company,
      equipment: sample.equipment,
      exceptionType,
      startTime: startTime.toLocaleString('zh-CN', { hour12: false }),
      endTime: endTime.toLocaleString('zh-CN', { hour12: false }),
      duration: durationHours.toFixed(2),
    };
  });
};

// 添加一个根据日期获取合适数据量的函数
export const getDataCountByDate = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  // 根据星期和时间段返回不同的数据量
  // 工作日和工作时间内数据量多，周末和夜间数据量少
  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 工作日
    if (hour >= 8 && hour < 18) { // 工作时间
      return Math.floor(Math.random() * (200 - 150 + 1)) + 150; // 150-200条
    } else { // 非工作时间
      return Math.floor(Math.random() * (150 - 100 + 1)) + 100; // 100-150条
    }
  } else { // 周末
    if (hour >= 9 && hour < 17) { // 白天
      return Math.floor(Math.random() * (130 - 80 + 1)) + 80; // 80-130条
    } else { // 夜间
      return Math.floor(Math.random() * (80 - 50 + 1)) + 50; // 50-80条
    }
  }
};

// 导出常量
export const MONITOR_DATA_KEY = 'monitor_data'; 