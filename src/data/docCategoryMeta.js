/**
 * 单据类型元数据配置（docCategoryMeta）
 * 为每种 docCategory 定义结构化字段的元数据：key、label（中文标签）、type（string/date/number）
 * 用于单据本身维度中动态渲染结构化字段列
 */
const docCategoryMeta = {
  '诉讼文件': {
    fields: [
      { key: 'caseNo', label: '案件编号', type: 'string' },
      { key: 'court', label: '法院', type: 'string' },
      { key: 'filingDate', label: '立案日期', type: 'date' },
      { key: 'caseType', label: '案件类型', type: 'string' },
      { key: 'amount', label: '涉案金额', type: 'number' },
    ],
  },
  '报价单': {
    fields: [
      { key: 'quotationNo', label: '报价单号', type: 'string' },
      { key: 'customer', label: '客户', type: 'string' },
      { key: 'quotationDate', label: '报价日期', type: 'date' },
      { key: 'validDays', label: '有效天数', type: 'number' },
      { key: 'totalAmount', label: '总金额', type: 'number' },
    ],
  },
  '综合财务分析指标': {
    fields: [
      { key: 'reportPeriod', label: '报告期间', type: 'string' },
      { key: 'revenueGrowth', label: '营收增长率', type: 'string' },
      { key: 'netProfitMargin', label: '净利润率', type: 'string' },
      { key: 'currentRatio', label: '流动比率', type: 'string' },
    ],
  },
  '财务报表主表（盖章）': {
    fields: [
      { key: 'reportYear', label: '报告年度', type: 'string' },
      { key: 'totalAssets', label: '总资产', type: 'number' },
      { key: 'totalRevenue', label: '总收入', type: 'number' },
      { key: 'preparedBy', label: '编制部门', type: 'string' },
      { key: 'stampDate', label: '盖章日期', type: 'date' },
    ],
  },
  '年度审计报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'auditFirm', label: '审计机构', type: 'string' },
      { key: 'auditYear', label: '审计年度', type: 'string' },
      { key: 'opinion', label: '审计意见', type: 'string' },
    ],
  },
  'IT审计报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'auditFirm', label: '审计机构', type: 'string' },
      { key: 'auditScope', label: '审计范围', type: 'string' },
      { key: 'auditDate', label: '审计日期', type: 'date' },
      { key: 'conclusion', label: '审计结论', type: 'string' },
    ],
  },
  '验资报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'verifyFirm', label: '验资机构', type: 'string' },
      { key: 'verifyDate', label: '验资日期', type: 'date' },
      { key: 'registeredCapital', label: '注册资本', type: 'number' },
      { key: 'paidInCapital', label: '实收资本', type: 'number' },
    ],
  },
  '政府补助文件/政府项目专项审计报告': {
    fields: [
      { key: 'projectName', label: '项目名称', type: 'string' },
      { key: 'grantAmount', label: '补助金额', type: 'number' },
      { key: 'grantDate', label: '拨付日期', type: 'date' },
      { key: 'auditFirm', label: '审计机构', type: 'string' },
      { key: 'conclusion', label: '审计结论', type: 'string' },
    ],
  },
  '信用评级': {
    fields: [
      { key: 'ratingAgency', label: '评级机构', type: 'string' },
      { key: 'ratingDate', label: '评级日期', type: 'date' },
      { key: 'creditRating', label: '信用等级', type: 'string' },
      { key: 'outlook', label: '评级展望', type: 'string' },
    ],
  },
  '资产评估报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'assessmentFirm', label: '评估机构', type: 'string' },
      { key: 'assessmentDate', label: '评估基准日', type: 'date' },
      { key: 'assetType', label: '资产类型', type: 'string' },
      { key: 'assessedValue', label: '评估价值', type: 'number' },
    ],
  },
  '纳税申报表': {
    fields: [
      { key: 'taxPeriod', label: '纳税期间', type: 'string' },
      { key: 'taxType', label: '税种', type: 'string' },
      { key: 'taxableIncome', label: '应纳税所得额', type: 'number' },
      { key: 'taxAmount', label: '应纳税额', type: 'number' },
    ],
  },
  '完税凭证': {
    fields: [
      { key: 'certificateNo', label: '凭证编号', type: 'string' },
      { key: 'taxType', label: '税种', type: 'string' },
      { key: 'taxPeriod', label: '纳税期间', type: 'string' },
      { key: 'paidAmount', label: '已缴金额', type: 'number' },
      { key: 'paymentDate', label: '缴款日期', type: 'date' },
    ],
  },
  '纳税信用等级证明': {
    fields: [
      { key: 'taxpayerNo', label: '纳税人识别号', type: 'string' },
      { key: 'evaluationYear', label: '评价年度', type: 'string' },
      { key: 'creditLevel', label: '信用等级', type: 'string' },
      { key: 'issuingAuthority', label: '发证机关', type: 'string' },
    ],
  },
  '无欠税证明': {
    fields: [
      { key: 'certificateNo', label: '证明编号', type: 'string' },
      { key: 'issuingAuthority', label: '发证机关', type: 'string' },
      { key: 'issueDate', label: '出具日期', type: 'date' },
      { key: 'validUntil', label: '有效期至', type: 'date' },
    ],
  },
  '研发加计扣除报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'auditFirm', label: '鉴证机构', type: 'string' },
      { key: 'rdExpense', label: '研发费用总额', type: 'number' },
      { key: 'deductionAmount', label: '加计扣除金额', type: 'number' },
      { key: 'reportYear', label: '报告年度', type: 'string' },
    ],
  },
  '同期资料鉴定报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'auditFirm', label: '鉴证机构', type: 'string' },
      { key: 'reportYear', label: '报告年度', type: 'string' },
      { key: 'relatedPartyAmount', label: '关联交易金额', type: 'number' },
      { key: 'conclusion', label: '鉴定结论', type: 'string' },
    ],
  },
  '高新审计报告': {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string' },
      { key: 'auditFirm', label: '审计机构', type: 'string' },
      { key: 'auditYear', label: '审计年度', type: 'string' },
      { key: 'rdRatio', label: '研发费用占比', type: 'string' },
      { key: 'highTechRevenue', label: '高新技术收入', type: 'number' },
    ],
  },
  '担保协议': {
    fields: [
      { key: 'agreementNo', label: '协议编号', type: 'string' },
      { key: 'guarantor', label: '担保方', type: 'string' },
      { key: 'guaranteeAmount', label: '担保金额', type: 'number' },
      { key: 'startDate', label: '起始日期', type: 'date' },
      { key: 'endDate', label: '终止日期', type: 'date' },
    ],
  },
  '授信协议': {
    fields: [
      { key: 'agreementNo', label: '协议编号', type: 'string' },
      { key: 'bank', label: '授信银行', type: 'string' },
      { key: 'creditLimit', label: '授信额度', type: 'number' },
      { key: 'startDate', label: '起始日期', type: 'date' },
      { key: 'endDate', label: '终止日期', type: 'date' },
    ],
  },
  '借款协议': {
    fields: [
      { key: 'agreementNo', label: '协议编号', type: 'string' },
      { key: 'lender', label: '贷款方', type: 'string' },
      { key: 'loanAmount', label: '借款金额', type: 'number' },
      { key: 'interestRate', label: '利率', type: 'string' },
      { key: 'maturityDate', label: '到期日', type: 'date' },
    ],
  },
  '凭证入账支持文件': {
    fields: [
      { key: 'voucherNo', label: '凭证号', type: 'string' },
      { key: 'accountingPeriod', label: '会计期间', type: 'string' },
      { key: 'entryType', label: '入账类型', type: 'string' },
      { key: 'amount', label: '金额', type: 'number' },
    ],
  },
  '银行回单': {
    fields: [
      { key: 'transactionNo', label: '交易流水号', type: 'string' },
      { key: 'transactionDate', label: '交易日期', type: 'date' },
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'counterparty', label: '对方户名', type: 'string' },
    ],
  },
  '承兑汇票收付回单': {
    fields: [
      { key: 'billNo', label: '票据号', type: 'string' },
      { key: 'issueDate', label: '出票日期', type: 'date' },
      { key: 'dueDate', label: '到期日期', type: 'date' },
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'drawer', label: '出票人', type: 'string' },
    ],
  },
  '报销发票': {
    fields: [
      { key: 'invoiceNo', label: '发票编号', type: 'string' },
      { key: 'invoiceDate', label: '发票日期', type: 'date' },
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'expenseType', label: '费用类型', type: 'string' },
      { key: 'department', label: '报销部门', type: 'string' },
    ],
  },
  '应付账款函证相关单据-对账单': {
    fields: [
      { key: 'statementNo', label: '对账单号', type: 'string' },
      { key: 'supplier', label: '供应商', type: 'string' },
      { key: 'statementDate', label: '对账日期', type: 'date' },
      { key: 'balanceAmount', label: '余额', type: 'number' },
    ],
  },
  '应付账款函证相关单据-应收询证函': {
    fields: [
      { key: 'confirmationNo', label: '询证函编号', type: 'string' },
      { key: 'counterparty', label: '对方单位', type: 'string' },
      { key: 'confirmationDate', label: '函证日期', type: 'date' },
      { key: 'confirmedAmount', label: '确认金额', type: 'number' },
      { key: 'replyStatus', label: '回函状态', type: 'string' },
    ],
  },
  '采购框架协议、质量协议': {
    fields: [
      { key: 'agreementNo', label: '协议编号', type: 'string' },
      { key: 'supplier', label: '供应商', type: 'string' },
      { key: 'agreementType', label: '协议类型', type: 'string' },
      { key: 'startDate', label: '起始日期', type: 'date' },
      { key: 'endDate', label: '终止日期', type: 'date' },
    ],
  },
};

export default docCategoryMeta;
