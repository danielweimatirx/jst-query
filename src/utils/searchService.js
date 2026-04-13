/**
 * SearchService - 根据解析后的查询条件执行检索
 *
 * @typedef {Object} ResultSet
 * @property {Object[]} orders - 命中订单（含 documents 数组）
 * @property {number} total
 * @property {string} summary
 * @property {string[]} usedFields
 * @property {string} conditionDesc
 * @property {Object|null} aggregation
 */

/** 字段中文标签映射 */
const FIELD_LABELS = {
  orderNo: '订单号',
  customer: '客户名称',
  title: '项目名称',
  poDate: '凭证日期',
  amount: '合同金额',
  currency: '货币',
  salesRegionDesc: '销售地区',
  salesRepDesc: '销售代表',
  salesOfficeDesc: '销售代表处',
  industryDesc: '用户行业',
  channelDesc: '分销渠道',
  holdingCompany: '控股方',
  tag: '文件类型',
};

/** 默认订单列表表格列（订单号 + 常用字段） */
const DEFAULT_ORDER_COLUMNS = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 130 },
  { title: '项目名称', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '客户名称', dataIndex: 'customer', key: 'customer', ellipsis: true },
  { title: '凭证日期', dataIndex: 'poDate', key: 'poDate', width: 110 },
  { title: '合同金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '货币', dataIndex: 'currency', key: 'currency', width: 70 },
];

/** 所有可用的订单列定义 */
const ALL_ORDER_COLUMN_DEFS = {
  orderNo: { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 130 },
  customer: { title: '客户名称', dataIndex: 'customer', key: 'customer', ellipsis: true },
  title: { title: '项目名称', dataIndex: 'title', key: 'title', ellipsis: true },
  poDate: { title: '凭证日期', dataIndex: 'poDate', key: 'poDate', width: 110 },
  amount: { title: '合同金额', dataIndex: 'amount', key: 'amount', width: 120 },
  currency: { title: '货币', dataIndex: 'currency', key: 'currency', width: 70 },
  salesRegionDesc: { title: '销售地区', dataIndex: 'salesRegionDesc', key: 'salesRegionDesc', width: 120 },
  salesRepDesc: { title: '销售代表', dataIndex: 'salesRepDesc', key: 'salesRepDesc', width: 120 },
  salesOfficeDesc: { title: '销售代表处', dataIndex: 'salesOfficeDesc', key: 'salesOfficeDesc', width: 140 },
  industryDesc: { title: '用户行业', dataIndex: 'industryDesc', key: 'industryDesc', ellipsis: true },
  channelDesc: { title: '分销渠道', dataIndex: 'channelDesc', key: 'channelDesc', width: 120 },
  holdingCompany: { title: '控股方', dataIndex: 'holdingCompany', key: 'holdingCompany', ellipsis: true },
  soldTo: { title: '售达方', dataIndex: 'soldTo', key: 'soldTo', width: 120 },
  vatInvoiceNo: { title: 'VAT发票号', dataIndex: 'vatInvoiceNo', key: 'vatInvoiceNo', width: 130 },
  vatInvoiceDate: { title: 'VAT发票时间', dataIndex: 'vatInvoiceDate', key: 'vatInvoiceDate', width: 120 },
  vatInvoiceAmount: { title: 'VAT发票金额', dataIndex: 'vatInvoiceAmount', key: 'vatInvoiceAmount', width: 120 },
  paymentDate: { title: '回款时间', dataIndex: 'paymentDate', key: 'paymentDate', width: 110 },
  paymentAmount: { title: '回款金额', dataIndex: 'paymentAmount', key: 'paymentAmount', width: 110 },
  outstandingAmount: { title: '欠款金额', dataIndex: 'outstandingAmount', key: 'outstandingAmount', width: 110 },
  taxRate: { title: '税率', dataIndex: 'taxRate', key: 'taxRate', width: 80 },
};

/**
 * 根据查询条件中使用的字段动态生成订单列表表格列定义
 * 始终包含订单号列，再追加查询涉及的字段列，最后补充常用字段
 */
function buildOrderColumns(conditions) {
  if (!conditions || conditions.length === 0) {
    return DEFAULT_ORDER_COLUMNS;
  }

  const seen = new Set();
  const columns = [];

  // 始终包含订单号
  columns.push(ALL_ORDER_COLUMN_DEFS.orderNo);
  seen.add('orderNo');

  // 追加查询涉及的 order 字段
  conditions.forEach(c => {
    if (c.table === 'order' && !seen.has(c.field) && ALL_ORDER_COLUMN_DEFS[c.field]) {
      columns.push(ALL_ORDER_COLUMN_DEFS[c.field]);
      seen.add(c.field);
    }
  });

  // 补充常用字段（项目名称、客户名称、凭证日期、合同金额、货币）
  ['title', 'customer', 'poDate', 'amount', 'currency'].forEach(f => {
    if (!seen.has(f)) {
      columns.push(ALL_ORDER_COLUMN_DEFS[f]);
      seen.add(f);
    }
  });

  return columns;
}

/**
 * 执行检索
 * @param {import('./queryParser').ParseResult} parseResult
 * @param {Object[]} orders - Order_Table
 * @param {Object[]} documents - Document_Table
 * @returns {ResultSet}
 */
export function executeSearch(parseResult, orders, documents) {
  const { conditions, queryType, aggregation: aggConfig, queryFocus } = parseResult;

  // 为每个订单关联文件
  const attachDocuments = (orderList) =>
    orderList.map(order => ({
      ...order,
      documents: documents.filter(doc => doc.orderNo === order.orderNo),
    }));

  // 聚合查询
  if (queryType === 'aggregation' && aggConfig) {
    return executeAggregation(aggConfig, orders, documents, parseResult);
  }

  // 无条件 → 返回全量
  if (!conditions || conditions.length === 0) {
    const allOrders = attachDocuments(orders);
    return {
      orders: allOrders,
      total: allOrders.length,
      summary: `当前系统共有 ${allOrders.length} 条销售订单记录。您可以通过输入客户名称、时间范围、金额条件等进行精确检索，也可以使用"按客户统计"等指令进行聚合分析。`,
      usedFields: [],
      conditionDesc: '全部订单',
      aggregation: null,
      orderColumns: DEFAULT_ORDER_COLUMNS,
      queryFocus: null,
    };
  }

  // 分离 order 条件、document 条件和全文关键词条件
  const fulltextConditions = conditions.filter(c => c.table === 'fulltext');
  const orderConditions = conditions.filter(c => c.table === 'order');
  const docConditions = conditions.filter(c => c.table === 'document');

  // 全文关键词搜索：在订单所有文本字段中匹配
  let filteredOrders = orders;
  if (fulltextConditions.length > 0) {
    const keyword = String(fulltextConditions[0].value);
    filteredOrders = orders.filter(order => {
      const texts = [order.orderNo, order.title, order.customer, order.poDate,
        order.salesRegionDesc, order.salesRepDesc, order.industryDesc, order.holdingCompany].filter(Boolean);
      const orderDocs = documents.filter(d => d.orderNo === order.orderNo);
      orderDocs.forEach(d => { texts.push(d.name, d.tag); });
      return texts.some(t => String(t).includes(keyword));
    });
  } else if (orderConditions.length > 0) {
    // 用 order 条件过滤
    filteredOrders = orders.filter(order =>
      orderConditions.every(cond => matchCondition(order, cond))
    );
  }

  // 用 document 条件过滤（取匹配的 orderNo 集合，与 order 结果取交集）
  if (docConditions.length > 0) {
    const matchingOrderNos = new Set();
    documents.forEach(doc => {
      if (docConditions.every(cond => matchCondition(doc, cond))) {
        matchingOrderNos.add(doc.orderNo);
      }
    });
    filteredOrders = filteredOrders.filter(order => matchingOrderNos.has(order.orderNo));
  }

  const resultOrders = attachDocuments(filteredOrders);
  const usedFields = [...new Set(conditions.map(c => FIELD_LABELS[c.field] || c.field))];
  const orderColumns = buildOrderColumns(conditions);

  if (resultOrders.length === 0) {
    return {
      orders: [],
      total: 0,
      summary: `根据您的查询条件（${parseResult.description || ''}），未找到匹配的订单记录。建议您检查条件是否正确，或尝试放宽查询范围。`,
      usedFields,
      conditionDesc: parseResult.description || '',
      aggregation: null,
      orderColumns,
      queryFocus: queryFocus || null,
    };
  }

  return {
    orders: resultOrders,
    total: resultOrders.length,
    summary: buildListSummary(resultOrders, conditions, parseResult.description, queryFocus),
    usedFields,
    conditionDesc: parseResult.description || '',
    aggregation: null,
    orderColumns,
    queryFocus: queryFocus || null,
  };
}

/**
 * 单条件匹配
 */
function matchCondition(record, condition) {
  const { field, operator, value } = condition;
  const recordValue = record[field];

  if (recordValue === undefined || recordValue === null) return false;

  switch (operator) {
    case 'eq':
      return String(recordValue) === String(value);
    case 'contains':
      return String(recordValue).includes(String(value));
    case 'gt':
      return toNumber(recordValue) > toNumber(value);
    case 'gte':
      return compareValues(recordValue, value) >= 0;
    case 'lt':
      return toNumber(recordValue) < toNumber(value);
    case 'lte':
      return compareValues(recordValue, value) <= 0;
    case 'in':
      if (Array.isArray(value)) {
        return value.some(v => String(recordValue).includes(String(v)));
      }
      return String(recordValue).includes(String(value));
    default:
      return false;
  }
}

/** 比较值（支持日期字符串和数字） */
function compareValues(a, b) {
  // 尝试日期比较
  if (typeof a === 'string' && typeof b === 'string' && a.match(/^\d{4}[-./]/) && b.match(/^\d{4}[-./]/)) {
    const dateA = normalizeDate(a);
    const dateB = normalizeDate(b);
    return dateA.localeCompare(dateB);
  }
  // 数字比较
  return toNumber(a) - toNumber(b);
}

/** 标准化日期格式为 YYYY-MM-DD */
function normalizeDate(dateStr) {
  return String(dateStr).replace(/[./]/g, '-');
}

/** 转数字 */
function toNumber(val) {
  if (typeof val === 'number') return val;
  const num = parseFloat(String(val).replace(/[,，]/g, ''));
  return isNaN(num) ? 0 : num;
}

/**
 * 生成条件检索的自然语言回答（根据查询焦点定制文案）
 */
function buildListSummary(resultOrders, conditions, description, queryFocus) {
  const count = resultOrders.length;
  if (count === 0) return '';

  // 提取客户条件
  const customerCond = conditions.find(c => c.field === 'customer');
  const customerName = customerCond ? customerCond.value : null;

  // 如果查询焦点是文件类型（如发票、合同等）
  if (queryFocus && queryFocus.length > 0) {
    const focusLabel = queryFocus.join('、');

    // 统计匹配的文件数量
    let totalDocs = 0;
    const docDetails = [];
    resultOrders.forEach(order => {
      if (order.documents) {
        const matchedDocs = order.documents.filter(doc => queryFocus.includes(doc.tag));
        totalDocs += matchedDocs.length;
        if (matchedDocs.length > 0) {
          docDetails.push({ orderNo: order.orderNo, title: order.title, docCount: matchedDocs.length });
        }
      }
    });

    const parts = [];
    if (customerName) {
      if (totalDocs > 0) {
        parts.push(`为您找到「${customerName}」相关的 ${totalDocs} 份${focusLabel}文件，涉及 ${docDetails.length} 个订单。`);
      } else {
        parts.push(`未找到「${customerName}」相关的${focusLabel}文件。该客户共有 ${count} 个订单，但暂无${focusLabel}记录。`);
      }
    } else {
      if (totalDocs > 0) {
        parts.push(`共检索到 ${totalDocs} 份${focusLabel}文件，涉及 ${count} 个订单。`);
      } else {
        parts.push(`共检索到 ${count} 个相关订单，但暂无${focusLabel}文件记录。`);
      }
    }

    return parts.join('');
  }

  // 通用订单检索回答
  const totalAmount = resultOrders.reduce((sum, o) => sum + toNumber(o.amount), 0);
  const amountStr = totalAmount >= 100000000
    ? `${(totalAmount / 100000000).toFixed(2)} 亿元`
    : totalAmount >= 10000
      ? `${(totalAmount / 10000).toFixed(2)} 万元`
      : `${totalAmount.toLocaleString()} 元`;

  const dates = resultOrders.map(o => o.poDate).filter(Boolean).sort();
  const dateRange = dates.length > 0 ? `时间跨度从 ${dates[0]} 到 ${dates[dates.length - 1]}` : '';

  const customerSet = new Set(resultOrders.map(o => o.customer).filter(Boolean));
  const customerCount = customerSet.size;

  const parts = [];
  parts.push(`根据您的查询条件，共检索到 ${count} 条相关订单，合同总金额合计 ${amountStr}。`);

  if (customerCount > 0 && customerCount <= 5) {
    parts.push(`涉及客户：${Array.from(customerSet).join('、')}。`);
  } else if (customerCount > 5) {
    parts.push(`涉及 ${customerCount} 个客户。`);
  }

  if (dateRange) {
    parts.push(dateRange + '。');
  }

  return parts.join('');
}

/**
 * 生成聚合查询的自然语言回答
 */
function buildAggregationSummary(sorted, groupLabel, totalGroups, limit, topOrders, queryFocus, allOrdersForRatio) {
  const totalAmountAll = (allOrdersForRatio || topOrders).reduce((sum, o) => sum + toNumber(o.amount), 0);
  const topAmount = sorted.reduce((sum, item) => sum + item.totalAmount, 0);
  const topOrderCount = sorted.reduce((sum, item) => sum + item.count, 0);
  const topAmountStr = topAmount >= 100000000
    ? `${(topAmount / 100000000).toFixed(2)} 亿元`
    : `${(topAmount / 10000).toFixed(2)} 万元`;
  const ratio = totalAmountAll > 0 ? ((topAmount / totalAmountAll) * 100).toFixed(1) : '0';

  // 有文件焦点时，用聚合方式直接回答
  const hasFocus = Array.isArray(queryFocus) && queryFocus.length > 0;
  if (hasFocus) {
    const focusLabel = queryFocus.join('、');
    const totalDocs = sorted.reduce((sum, item) => sum + (item.docCount || 0), 0);
    const customerNames = sorted.map(item => `「${item.key}」`).join('、');
    const parts = [];
    parts.push(`合同金额排名前 ${sorted.length} 的${groupLabel}为：${customerNames}。`);
    if (totalDocs > 0) {
      parts.push(`共检索到 ${totalDocs} 份${focusLabel}文件，涉及 ${topOrderCount} 个订单。`);
    } else {
      parts.push(`这 ${sorted.length} 个${groupLabel}共 ${topOrderCount} 笔订单，暂无${focusLabel}文件记录。`);
    }
    return parts.join('');
  }

  const parts = [];
  parts.push(`根据您的查询，系统按${groupLabel}维度进行了统计分析。`);
  parts.push(`共涉及 ${totalGroups} 个${groupLabel}，以下为合同金额排名前 ${sorted.length} 的${groupLabel}。`);
  parts.push(`前 ${sorted.length} 名合计金额 ${topAmountStr}，共 ${topOrderCount} 笔订单，占总金额的 ${ratio}%。`);

  if (sorted.length > 0) {
    parts.push(`其中「${sorted[0].key}」以 ${sorted[0].totalAmount.toLocaleString()} 元位居首位。`);
  }

  return parts.join('');
}
function executeAggregation(aggConfig, orders, documents, parseResult) {
  const { groupBy, orderBy, limit, direction = 'desc' } = aggConfig;
  const queryFocus = parseResult.queryFocus;
  const hasFocus = Array.isArray(queryFocus) && queryFocus.length > 0;

  // 按 groupBy 字段分组
  const groups = {};
  orders.forEach(order => {
    const key = order[groupBy] || '未知';
    if (!groups[key]) {
      groups[key] = { key, count: 0, totalAmount: 0, docCount: 0 };
    }
    groups[key].count += 1;
    groups[key].totalAmount += toNumber(order[orderBy] || order.amount);

    // 统计匹配文件类型的文件数
    if (hasFocus) {
      const matchedDocs = documents.filter(
        doc => doc.orderNo === order.orderNo && queryFocus.includes(doc.tag)
      );
      groups[key].docCount += matchedDocs.length;
    }
  });

  // 排序：始终按金额排序
  let sorted = Object.values(groups).sort((a, b) =>
    direction === 'desc' ? b.totalAmount - a.totalAmount : a.totalAmount - b.totalAmount
  );

  // 限制数量
  if (limit) {
    sorted = sorted.slice(0, limit);
  }

  const groupLabel = FIELD_LABELS[groupBy] || groupBy;
  const focusLabel = hasFocus ? queryFocus.join('、') : '';

  // 根据是否有文件焦点构建不同的表格列
  const columns = hasFocus
    ? [
        { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
        { title: groupLabel, dataIndex: 'name', key: 'name' },
        { title: '订单数', dataIndex: 'count', key: 'count', width: 80 },
        { title: `${focusLabel}数量`, dataIndex: 'docCount', key: 'docCount', width: 100 },
        { title: '合同总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 140 },
      ]
    : [
        { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
        { title: groupLabel, dataIndex: 'name', key: 'name' },
        { title: '订单数', dataIndex: 'count', key: 'count', width: 80 },
        { title: '合同总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 140 },
      ];

  const aggregation = {
    columns,
    dataSource: sorted.map((item, idx) => ({
      key: String(idx + 1),
      rank: idx + 1,
      name: item.key,
      count: item.count,
      docCount: item.docCount || 0,
      totalAmount: item.totalAmount.toLocaleString(),
    })),
  };

  // 只返回聚合结果中 top N 分组对应的订单
  const topKeys = new Set(sorted.map(item => item.key));
  const filteredOrders = orders
    .filter(order => topKeys.has(order[groupBy] || '未知'))
    .map(order => ({
      ...order,
      documents: documents.filter(doc => doc.orderNo === order.orderNo),
    }));

  return {
    orders: filteredOrders,
    total: filteredOrders.length,
    summary: buildAggregationSummary(sorted, groupLabel, Object.keys(groups).length, limit, filteredOrders, queryFocus, orders),
    usedFields: [groupLabel, '合同金额'],
    conditionDesc: parseResult.description || '',
    aggregation,
    orderColumns: DEFAULT_ORDER_COLUMNS,
    queryFocus: queryFocus || null,
  };
}

/**
 * 销售订单条件字段到采购订单字段的映射
 */
const SALES_TO_PURCHASE_FIELD_MAP = {
  orderNo: 'purchaseOrderNo',
  customer: 'supplier',
  poDate: 'purchaseDate',
  amount: 'purchaseAmount',
  title: 'description',
};

/**
 * 将销售维度的条件映射为采购维度的条件
 */
function mapConditionToPurchase(condition) {
  const mappedField = SALES_TO_PURCHASE_FIELD_MAP[condition.field];
  if (!mappedField) return null;
  return { ...condition, field: mappedField, table: 'order' };
}

/**
 * 执行采购单维度检索
 */
function executePurchaseSearch(parseResult, purchaseOrderTable, purchaseDocumentTable) {
  if (!purchaseOrderTable || purchaseOrderTable.length === 0) {
    return { orders: [], total: 0, summary: '暂无数据' };
  }

  const { conditions, queryType } = parseResult;

  // 聚合查询时采购维度返回空结果
  if (queryType === 'aggregation') {
    return { orders: [], total: 0, summary: '聚合查询暂不支持采购单维度' };
  }

  const attachPurchaseDocuments = (orderList) =>
    orderList.map(order => ({
      ...order,
      documents: (purchaseDocumentTable || []).filter(doc => doc.purchaseOrderNo === order.purchaseOrderNo),
    }));

  // 无条件 → 返回全量
  if (!conditions || conditions.length === 0) {
    const allOrders = attachPurchaseDocuments(purchaseOrderTable);
    return {
      orders: allOrders,
      total: allOrders.length,
      summary: `共有 ${allOrders.length} 条采购订单记录。`,
    };
  }

  // 分离 order 条件、document 条件和全文关键词条件
  const fulltextConditions = conditions.filter(c => c.table === 'fulltext');
  const orderConditions = conditions.filter(c => c.table === 'order');
  const docConditions = conditions.filter(c => c.table === 'document');

  // 全文关键词搜索
  let filteredOrders = purchaseOrderTable;
  if (fulltextConditions.length > 0) {
    const keyword = String(fulltextConditions[0].value);
    filteredOrders = purchaseOrderTable.filter(order => {
      const texts = [order.purchaseOrderNo, order.supplier, order.purchaseDate,
        order.purchaseAmount, order.purchaseType, order.description, order.relatedSalesOrder].filter(Boolean);
      const orderDocs = (purchaseDocumentTable || []).filter(d => d.purchaseOrderNo === order.purchaseOrderNo);
      orderDocs.forEach(d => { texts.push(d.name, d.tag); });
      return texts.some(t => String(t).includes(keyword));
    });
  } else {
    // 将 order 条件映射为采购字段
    const mappedOrderConditions = orderConditions
      .map(mapConditionToPurchase)
      .filter(Boolean);

    // 用映射后的条件过滤采购订单
    if (mappedOrderConditions.length > 0) {
      filteredOrders = purchaseOrderTable.filter(order =>
        mappedOrderConditions.every(cond => matchCondition(order, cond))
      );
    }
  }

  // 用 document 条件过滤（tag 匹配采购单据的 tag）
  if (docConditions.length > 0 && purchaseDocumentTable && purchaseDocumentTable.length > 0) {
    const matchingOrderNos = new Set();
    purchaseDocumentTable.forEach(doc => {
      if (docConditions.every(cond => matchCondition(doc, cond))) {
        matchingOrderNos.add(doc.purchaseOrderNo);
      }
    });
    filteredOrders = filteredOrders.filter(order => matchingOrderNos.has(order.purchaseOrderNo));
  }

  const resultOrders = attachPurchaseDocuments(filteredOrders);

  if (resultOrders.length === 0) {
    return {
      orders: [],
      total: 0,
      summary: `根据查询条件，未找到匹配的采购订单记录。`,
    };
  }

  return {
    orders: resultOrders,
    total: resultOrders.length,
    summary: `共检索到 ${resultOrders.length} 条采购订单记录。`,
  };
}

/**
 * 执行单据本身维度检索
 */
function executeDocumentDimensionSearch(parseResult, standaloneDocumentTable) {
  if (!standaloneDocumentTable || standaloneDocumentTable.length === 0) {
    return { documents: [], total: 0, summary: '暂无数据' };
  }

  const { conditions, queryType } = parseResult;

  // 聚合查询时单据维度返回空结果
  if (queryType === 'aggregation') {
    return { documents: [], total: 0, summary: '聚合查询暂不支持单据维度' };
  }

  // 无条件 → 返回全量
  if (!conditions || conditions.length === 0) {
    return {
      documents: [...standaloneDocumentTable],
      total: standaloneDocumentTable.length,
      summary: `共有 ${standaloneDocumentTable.length} 份独立单据。`,
    };
  }

  const fulltextConditions = conditions.filter(c => c.table === 'fulltext');
  const docConditions = conditions.filter(c => c.table === 'document');
  const orderConditions = conditions.filter(c => c.table === 'order');

  let filtered = [...standaloneDocumentTable];

  // 全文关键词搜索：在 fileName + docCategory + structuredFields 所有值中匹配
  if (fulltextConditions.length > 0) {
    const keyword = String(fulltextConditions[0].value);
    filtered = filtered.filter(doc => {
      const texts = [doc.fileName, doc.docCategory, doc.fileFormat];
      if (doc.structuredFields) {
        Object.values(doc.structuredFields).forEach(v => texts.push(String(v)));
      }
      return texts.some(t => String(t).includes(keyword));
    });
  } else {
    // 用 document 条件过滤（tag → docCategory）
    if (docConditions.length > 0) {
      filtered = filtered.filter(doc =>
        docConditions.some(cond => {
          if (cond.field === 'tag') {
            return String(doc.docCategory) === String(cond.value);
          }
          return false;
        })
      );
    }

    // 用 order 条件匹配 fileName + structuredFields 的所有值
    if (orderConditions.length > 0) {
    filtered = filtered.filter(doc => {
      // 收集所有可搜索文本：fileName + structuredFields 所有值
      const searchableTexts = [String(doc.fileName), String(doc.docCategory)];
      if (doc.structuredFields) {
        Object.values(doc.structuredFields).forEach(v => searchableTexts.push(String(v)));
      }
      const allText = searchableTexts.join(' ');

      return orderConditions.some(cond => {
        const val = String(cond.value);
        if (cond.operator === 'contains' || cond.operator === 'eq') {
          return allText.includes(val);
        }
        // 金额条件：尝试匹配 structuredFields 中的数值字段
        if (cond.field === 'amount' && doc.structuredFields) {
          const numericValues = Object.values(doc.structuredFields)
            .map(v => parseFloat(String(v).replace(/[,，]/g, '')))
            .filter(n => !isNaN(n));
          if (cond.operator === 'gt') return numericValues.some(n => n > toNumber(cond.value));
          if (cond.operator === 'gte') return numericValues.some(n => n >= toNumber(cond.value));
          if (cond.operator === 'lt') return numericValues.some(n => n < toNumber(cond.value));
          if (cond.operator === 'lte') return numericValues.some(n => n <= toNumber(cond.value));
        }
        // 时间条件：尝试匹配 structuredFields 中的日期字段
        if (cond.field === 'poDate' && doc.structuredFields) {
          const dateValues = Object.values(doc.structuredFields)
            .filter(v => /^\d{4}-\d{2}-\d{2}$/.test(String(v)));
          if (dateValues.length > 0) {
            return dateValues.some(d => {
              if (cond.operator === 'gte') return d >= String(cond.value);
              if (cond.operator === 'lte') return d <= String(cond.value);
              if (cond.operator === 'lt') return d < String(cond.value);
              return false;
            });
          }
        }
        return false;
      });
    });
    }
  }

  if (filtered.length === 0) {
    return {
      documents: [],
      total: 0,
      summary: `根据查询条件，未找到匹配的独立单据。`,
    };
  }

  return {
    documents: filtered,
    total: filtered.length,
    summary: `共检索到 ${filtered.length} 份独立单据。`,
  };
}

/**
 * 生成综合摘要，包含各维度命中数量
 */
function buildOverallSummary(salesResult, purchaseResult, documentResult) {
  const parts = [];
  const salesTotal = salesResult.total || 0;
  const purchaseTotal = purchaseResult.total || 0;
  const documentTotal = documentResult.total || 0;

  const dimensionParts = [];
  if (salesTotal > 0) {
    dimensionParts.push(`销售订单 ${salesTotal} 条`);
  } else {
    dimensionParts.push(`销售订单 0 条`);
  }
  if (purchaseTotal > 0) {
    dimensionParts.push(`采购单 ${purchaseTotal} 条`);
  } else {
    dimensionParts.push(`采购单 0 条`);
  }
  if (documentTotal > 0) {
    dimensionParts.push(`单据 ${documentTotal} 份`);
  } else {
    dimensionParts.push(`单据 0 份`);
  }

  const totalHits = salesTotal + purchaseTotal + documentTotal;
  if (totalHits > 0) {
    parts.push(`共检索到${dimensionParts.join('，')}。`);
  } else {
    parts.push(`未找到匹配的记录（${dimensionParts.join('，')}）。`);
  }

  return parts.join('');
}

/**
 * 多维度检索入口
 * @param {import('./queryParser').ParseResult} parseResult
 * @param {Object[]} orderTable - 销售订单主表
 * @param {Object[]} documentTable - 销售单据关联表
 * @param {Object[]} purchaseOrderTable - 采购订单主表
 * @param {Object[]} purchaseDocumentTable - 采购单据关联表
 * @param {Object[]} standaloneDocumentTable - 独立单据表
 * @returns {MultiDimensionResult}
 */
export function executeMultiDimensionSearch(parseResult, orderTable, documentTable, purchaseOrderTable, purchaseDocumentTable, standaloneDocumentTable) {
  // 1. 销售订单维度：复用现有 executeSearch
  const salesResult = executeSearch(parseResult, orderTable || [], documentTable || []);

  // 2. 采购单维度
  const purchaseResult = executePurchaseSearch(parseResult, purchaseOrderTable, purchaseDocumentTable);

  // 3. 单据本身维度
  const documentResult = executeDocumentDimensionSearch(parseResult, standaloneDocumentTable);

  // 4. 生成综合摘要
  const overallSummary = buildOverallSummary(salesResult, purchaseResult, documentResult);

  return {
    sales: salesResult,
    purchase: purchaseResult,
    document: documentResult,
    overallSummary,
  };
}

export default executeSearch;
