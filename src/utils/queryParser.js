/**
 * QueryParser - 将自然语言问题解析为结构化查询条件
 *
 * @typedef {Object} QueryCondition
 * @property {string} field
 * @property {'eq'|'gt'|'lt'|'gte'|'lte'|'contains'|'in'} operator
 * @property {string|number|string[]} value
 * @property {'order'|'document'} table
 *
 * @typedef {Object} ParseResult
 * @property {QueryCondition[]} conditions
 * @property {'list'|'aggregation'} queryType
 * @property {Object|null} aggregation
 * @property {string} description
 */

// 已知的文件标签类型（涵盖销售单、采购单、单据本身三个维度的所有类型）
const KNOWN_DOC_TAGS = [
  // --- 销售单维度类型 ---
  '合同', '发票', '通电验收单', '运行证明', '中标通知书',
  '技术协议', '应收催收单', '竣工验收单', '拣配单', '代付协议',
  '产品退货单', '装箱清单', '出口报关单', '其他',
  '银行回单', '承兑汇票收付回单', '报销发票',
  // --- 采购单维度类型 ---
  '采购发票', '采购合同', '供应商出厂检验报告', '原材料外购直发签收单',
  '到货验收单', '预验收单', '最终验收单', '入库单', '资产验收报告',
  '应付账款函证相关单据-对账单', '应付账款函证相关单据-应收询证函',
  // --- 单据本身维度类型 ---
  '诉讼文件', '综合财务分析指标', '财务报表主表（盖章）', '年度审计报告',
  'IT审计报告', '验资报告', '政府补助文件/政府项目专项审计报告',
  '信用评级', '资产评估报告', '纳税申报表', '完税凭证', '纳税信用等级证明',
  '无欠税证明', '研发加计扣除报告', '同期资料鉴定报告', '高新审计报告',
  '担保协议', '授信协议', '借款协议', '凭证入账支持文件',
  '采购框架协议、质量协议',
];

// 字段中文名到英文字段名的映射
const FIELD_MAP = {
  '订单号': 'orderNo',
  '销售凭证': 'orderNo',
  '凭证号': 'orderNo',
  '客户': 'customer',
  '客户名称': 'customer',
  '项目': 'title',
  '项目名称': 'title',
  '货币': 'currency',
  '销售地区': 'salesRegionDesc',
  '销售代表': 'salesRepDesc',
  '销售代表处': 'salesOfficeDesc',
  '分销渠道': 'channelDesc',
  '控股方': 'holdingCompany',
  '行业': 'industryDesc',
  '用户行业': 'industryDesc',
  '供应商': 'supplier',
  '供应商名称': 'supplier',
  '采购日期': 'purchaseDate',
  '采购金额': 'purchaseAmount',
  '采购类型': 'purchaseType',
  '采购订单号': 'purchaseOrderNo',
};

/**
 * 解析自然语言问题为结构化查询条件
 * @param {string} question
 * @returns {ParseResult}
 */
export function parseQuery(question) {
  if (!question || typeof question !== 'string') {
    return { conditions: [], queryType: 'list', aggregation: null, description: '' };
  }

  const q = question.trim();
  const conditions = [];
  const descParts = [];

  // 1. 检测聚合查询
  const aggResult = parseAggregation(q);
  if (aggResult) {
    // 聚合查询也检测文件类型焦点
    const docFocus = KNOWN_DOC_TAGS.filter(tag => q.includes(tag));
    return {
      conditions: [],
      queryType: 'aggregation',
      aggregation: aggResult.aggregation,
      description: aggResult.description,
      queryFocus: docFocus.length > 0 ? docFocus : null,
    };
  }

  // 2. 解析订单号
  parseOrderNo(q, conditions, descParts);

  // 3. 解析客户名称（在文件类型之前，避免公司名被文件类型截断）
  parseCustomer(q, conditions, descParts);

  // 4. 解析文件类型
  parseDocumentType(q, conditions, descParts);

  // 5. 解析时间条件
  parseTimeCondition(q, conditions, descParts);

  // 6. 解析金额条件
  parseAmountCondition(q, conditions, descParts);

  // 7. 解析其他字段关键词
  parseFieldKeywords(q, conditions, descParts);

  // 8. 兜底：如果没有解析出任何条件，提取有意义的关键词
  if (conditions.length === 0 && q.length > 0) {
    // 去掉常见的无意义词，提取核心关键词
    const stopWords = ['的', '相关', '有关', '所有', '全部', '哪些', '什么', '查询', '查找', '搜索', '检索', '请', '帮我', '找', '看看', '列出', '显示', '单据', '文件', '文档', '资料', '信息', '数据', '记录', '列表', '明细'];
    let keyword = q;
    stopWords.forEach(w => { keyword = keyword.replace(new RegExp(w, 'g'), ''); });
    keyword = keyword.trim();
    if (keyword.length > 0) {
      conditions.push({ field: 'keyword', operator: 'contains', value: keyword, table: 'fulltext' });
      descParts.push(`关键词「${keyword}」`);
    }
  }

  // 检测查询焦点：用户关注的是什么类型的信息
  const docFocus = KNOWN_DOC_TAGS.filter(tag => q.includes(tag));

  return {
    conditions,
    queryType: 'list',
    aggregation: null,
    description: descParts.join('，'),
    queryFocus: docFocus.length > 0 ? docFocus : null, // 用户关注的文件类型
  };
}

/** 中文数字转阿拉伯数字 */
function chineseToNumber(str) {
  const map = { '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
  if (!str) return null;
  // 单字：一~十
  if (map[str] !== undefined) return map[str];
  // 十几：十一~十九
  if (str.startsWith('十') && str.length === 2 && map[str[1]] !== undefined) return 10 + map[str[1]];
  // 几十：二十、三十...
  if (str.length === 2 && map[str[0]] !== undefined && str[1] === '十') return map[str[0]] * 10;
  // 几十几：二十一...
  if (str.length === 3 && map[str[0]] !== undefined && str[1] === '十' && map[str[2]] !== undefined) return map[str[0]] * 10 + map[str[2]];
  return null;
}

/** 解析聚合查询 */
function parseAggregation(q) {
  // 中文数字字符集
  const cnNum = '[一二两三四五六七八九十]+';
  // "前三大客户" / "前十客户" / "前5大客户" / "TOP 10 客户" / "5大客户" / "十大客户"
  const topNRegex = new RegExp(`(?:(?:前|top\\s*)(\\d+|${cnNum})大?|(\\d+|${cnNum})大|十大)\\s*(客户|项目|订单)`, 'i');
  const topNMatch = q.match(topNRegex);
  if (topNMatch) {
    const raw = topNMatch[1] || topNMatch[2];
    let limit;
    if (!raw) {
      limit = 10; // "十大" 固定匹配
    } else if (/^\d+$/.test(raw)) {
      limit = parseInt(raw, 10);
    } else {
      limit = chineseToNumber(raw) || 10;
    }
    const target = topNMatch[3];
    let groupBy = 'customer';
    let orderBy = 'amount';
    if (target === '项目' || target === '订单') {
      groupBy = 'orderNo';
    }
    return {
      aggregation: { groupBy, orderBy, limit, direction: 'desc' },
      description: `聚合查询：按${target}统计，取前${limit}名`,
    };
  }

  // "按XX统计" / "XX排名"
  const statMatch = q.match(/按\s*(客户|地区|行业|销售代表|渠道)\s*(统计|排名|汇总)/);
  if (statMatch) {
    const targetMap = {
      '客户': 'customer',
      '地区': 'salesRegionDesc',
      '行业': 'industryDesc',
      '销售代表': 'salesRepDesc',
      '渠道': 'channelDesc',
    };
    return {
      aggregation: { groupBy: targetMap[statMatch[1]] || 'customer', orderBy: 'amount', limit: 20, direction: 'desc' },
      description: `聚合查询：按${statMatch[1]}统计金额排名`,
    };
  }

  return null;
}

/** 解析订单号 */
function parseOrderNo(q, conditions, descParts) {
  // 匹配 "订单号 XXX" 或 "订单号：XXX" 或直接出现的纯数字订单号（10位左右）
  const orderNoMatch = q.match(/订单号?\s*[:：]?\s*(\d{7,15})/);
  if (orderNoMatch) {
    conditions.push({ field: 'orderNo', operator: 'eq', value: orderNoMatch[1], table: 'order' });
    descParts.push(`订单号 = ${orderNoMatch[1]}`);
    return;
  }
  // 匹配 "提供/查询 XXXXXXX 订单" 模式
  const orderNoMatch2 = q.match(/(?:提供|查询|查找|搜索)\s*(\d{7,15})\s*(?:订单|的)/);
  if (orderNoMatch2) {
    conditions.push({ field: 'orderNo', operator: 'eq', value: orderNoMatch2[1], table: 'order' });
    descParts.push(`订单号 = ${orderNoMatch2[1]}`);
  }
}

/** 解析文件类型 */
function parseDocumentType(q, conditions, descParts) {
  const matchedTags = KNOWN_DOC_TAGS.filter(tag => q.includes(tag));
  if (matchedTags.length > 0) {
    matchedTags.forEach(tag => {
      conditions.push({ field: 'tag', operator: 'eq', value: tag, table: 'document' });
      descParts.push(`文件类型包含「${tag}」`);
    });
  }
}

/** 解析时间条件 */
function parseTimeCondition(q, conditions, descParts) {
  // "YYYY年之后" / "YYYY年以后"
  const afterMatch = q.match(/(\d{4})\s*年\s*(?:之后|以后|以来|后)/);
  if (afterMatch) {
    conditions.push({ field: 'poDate', operator: 'gte', value: `${afterMatch[1]}-01-01`, table: 'order' });
    descParts.push(`凭证日期 >= ${afterMatch[1]}年`);
    return;
  }

  // "YYYY年之前" / "YYYY年以前"
  const beforeMatch = q.match(/(\d{4})\s*年\s*(?:之前|以前|前)/);
  if (beforeMatch) {
    conditions.push({ field: 'poDate', operator: 'lt', value: `${beforeMatch[1]}-01-01`, table: 'order' });
    descParts.push(`凭证日期 < ${beforeMatch[1]}年`);
    return;
  }

  // "YYYY年到YYYY年" / "YYYY年至YYYY年"
  const rangeMatch = q.match(/(\d{4})\s*年?\s*(?:到|至|-)\s*(\d{4})\s*年/);
  if (rangeMatch) {
    conditions.push({ field: 'poDate', operator: 'gte', value: `${rangeMatch[1]}-01-01`, table: 'order' });
    conditions.push({ field: 'poDate', operator: 'lte', value: `${rangeMatch[2]}-12-31`, table: 'order' });
    descParts.push(`凭证日期在 ${rangeMatch[1]}年 至 ${rangeMatch[2]}年`);
    return;
  }

  // "YYYY年" 单独出现
  const yearMatch = q.match(/(\d{4})\s*年(?:的)?/);
  if (yearMatch && !q.match(/(\d{4})\s*年\s*(?:之后|以后|之前|以前|到|至)/)) {
    conditions.push({ field: 'poDate', operator: 'gte', value: `${yearMatch[1]}-01-01`, table: 'order' });
    conditions.push({ field: 'poDate', operator: 'lte', value: `${yearMatch[1]}-12-31`, table: 'order' });
    descParts.push(`凭证日期在 ${yearMatch[1]}年`);
  }
}

/** 解析金额条件 */
function parseAmountCondition(q, conditions, descParts) {
  // "金额大于/超过/高于 N万/亿"
  const gtMatch = q.match(/金额\s*(?:大于|超过|高于|>=?)\s*(\d+(?:\.\d+)?)\s*(万|亿)?/);
  if (gtMatch) {
    let value = parseFloat(gtMatch[1]);
    if (gtMatch[2] === '万') value *= 10000;
    if (gtMatch[2] === '亿') value *= 100000000;
    conditions.push({ field: 'amount', operator: 'gt', value, table: 'order' });
    descParts.push(`金额 > ${gtMatch[1]}${gtMatch[2] || ''}`);
    return;
  }

  // "金额小于/低于 N万/亿"
  const ltMatch = q.match(/金额\s*(?:小于|低于|不超过|<=?)\s*(\d+(?:\.\d+)?)\s*(万|亿)?/);
  if (ltMatch) {
    let value = parseFloat(ltMatch[1]);
    if (ltMatch[2] === '万') value *= 10000;
    if (ltMatch[2] === '亿') value *= 100000000;
    conditions.push({ field: 'amount', operator: 'lt', value, table: 'order' });
    descParts.push(`金额 < ${ltMatch[1]}${ltMatch[2] || ''}`);
    return;
  }

  // "大于N万" 不带"金额"前缀但上下文暗示金额
  const implicitGtMatch = q.match(/(?:大于|超过|高于)\s*(\d+(?:\.\d+)?)\s*(万|亿)/);
  if (implicitGtMatch && !conditions.some(c => c.field === 'amount')) {
    let value = parseFloat(implicitGtMatch[1]);
    if (implicitGtMatch[2] === '万') value *= 10000;
    if (implicitGtMatch[2] === '亿') value *= 100000000;
    conditions.push({ field: 'amount', operator: 'gt', value, table: 'order' });
    descParts.push(`金额 > ${implicitGtMatch[1]}${implicitGtMatch[2]}`);
  }
}

/** 解析客户名称 */
function parseCustomer(q, conditions, descParts) {
  // 已经有 customer 条件则跳过
  if (conditions.some(c => c.field === 'customer')) return;

  // "客户是XXX" / "客户名称包含XXX"
  const customerMatch = q.match(/客户(?:名称)?\s*(?:是|为|[:：])\s*([^\s,，、]+)/);
  if (customerMatch) {
    conditions.push({ field: 'customer', operator: 'contains', value: customerMatch[1], table: 'order' });
    descParts.push(`客户名称包含「${customerMatch[1]}」`);
    return;
  }

  // "XXX公司的YYY" / "XXX集团的YYY" — 从自然语言中提取公司名
  const companyMatch = q.match(/([\u4e00-\u9fa5]{2,}(?:公司|集团|有限公司|股份|企业|单位))(?:的|有关|相关)?/);
  if (companyMatch) {
    // 排除已知的非客户名词（如"销售单据管理系统"等）
    const name = companyMatch[1];
    if (!['管理公司', '系统公司'].includes(name)) {
      conditions.push({ field: 'customer', operator: 'contains', value: name, table: 'order' });
      descParts.push(`客户名称包含「${name}」`);
    }
  }
}

/** 解析其他字段关键词 */
function parseFieldKeywords(q, conditions, descParts) {
  // "XX地区的订单"
  const regionMatch = q.match(/(华北|华东|华南|华中|东北|西北|西南)\s*(?:地区)?/);
  if (regionMatch && !conditions.some(c => c.field === 'salesRegionDesc')) {
    conditions.push({ field: 'salesRegionDesc', operator: 'contains', value: regionMatch[1], table: 'order' });
    descParts.push(`销售地区包含「${regionMatch[1]}」`);
  }

  // "XX行业"
  const industryMatch = q.match(/(轨道交通|光伏|物流|新能源|电力|石化|冶金)\s*(?:行业)?/);
  if (industryMatch && !conditions.some(c => c.field === 'industryDesc')) {
    conditions.push({ field: 'industryDesc', operator: 'contains', value: industryMatch[1], table: 'order' });
    descParts.push(`行业包含「${industryMatch[1]}」`);
  }
}

export default parseQuery;
