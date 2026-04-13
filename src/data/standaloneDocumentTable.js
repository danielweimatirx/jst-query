/**
 * 独立单据表（Standalone_Document_Table）
 * 以文件本身为主体，不关联任何订单
 * 每条记录包含 id、fileName、docCategory、fileFormat、structuredFields
 * 同一 docCategory 的记录 structuredFields 拥有相同的 key 集合
 */
const standaloneDocumentTable = [
  // ========== 1. 诉讼文件 ==========
  {
    id: 'sdoc1',
    fileName: '金石特电气与华能集团合同纠纷案诉讼材料.pdf',
    docCategory: '诉讼文件',
    fileFormat: 'pdf',
    structuredFields: {
      caseNo: '(2022)鲁01民初1256号',
      court: '济南市中级人民法院',
      filingDate: '2022-03-15',
      caseType: '合同纠纷',
      amount: '3560000',
    },
  },
  {
    id: 'sdoc2',
    fileName: '金石特电气与中铁建设质量争议诉讼文件.pdf',
    docCategory: '诉讼文件',
    fileFormat: 'pdf',
    structuredFields: {
      caseNo: '(2023)鲁01民初0892号',
      court: '济南市中级人民法院',
      filingDate: '2023-06-20',
      caseType: '产品质量纠纷',
      amount: '1280000',
    },
  },
  {
    id: 'sdoc3',
    fileName: '金石特电气与深圳地铁集团货款追偿案.pdf',
    docCategory: '诉讼文件',
    fileFormat: 'pdf',
    structuredFields: {
      caseNo: '(2024)粤03民初0345号',
      court: '深圳市中级人民法院',
      filingDate: '2024-01-10',
      caseType: '货款追偿',
      amount: '5120000',
    },
  },

  // ========== 2. 报价单 ==========
  {
    id: 'sdoc4',
    fileName: '南京地铁7号线整流变压器报价单.pdf',
    docCategory: '报价单',
    fileFormat: 'pdf',
    structuredFields: {
      quotationNo: 'QT-2023-0015',
      customer: '南京地铁集团有限公司',
      quotationDate: '2023-01-20',
      validDays: '30',
      totalAmount: '5200000',
    },
  },
  {
    id: 'sdoc5',
    fileName: '广州地铁13号线牵引整流机组报价单.pdf',
    docCategory: '报价单',
    fileFormat: 'pdf',
    structuredFields: {
      quotationNo: 'QT-2023-0028',
      customer: '广州地铁集团有限公司',
      quotationDate: '2023-05-08',
      validDays: '45',
      totalAmount: '6300000',
    },
  },
  {
    id: 'sdoc6',
    fileName: '济南轨道交通4号线整流变压器报价单.xlsx',
    docCategory: '报价单',
    fileFormat: 'xlsx',
    structuredFields: {
      quotationNo: 'QT-2024-0003',
      customer: '济南轨道交通集团有限公司',
      quotationDate: '2024-03-12',
      validDays: '30',
      totalAmount: '5800000',
    },
  },

  // ========== 3. 综合财务分析指标 ==========
  {
    id: 'sdoc7',
    fileName: '金石特电气2022年度综合财务分析指标报告.pdf',
    docCategory: '综合财务分析指标',
    fileFormat: 'pdf',
    structuredFields: {
      reportPeriod: '2022年度',
      revenueGrowth: '12.5%',
      netProfitMargin: '8.3%',
      currentRatio: '1.85',
    },
  },
  {
    id: 'sdoc8',
    fileName: '金石特电气2023年度综合财务分析指标报告.pdf',
    docCategory: '综合财务分析指标',
    fileFormat: 'pdf',
    structuredFields: {
      reportPeriod: '2023年度',
      revenueGrowth: '15.2%',
      netProfitMargin: '9.1%',
      currentRatio: '2.01',
    },
  },

  // ========== 4. 财务报表主表（盖章） ==========
  {
    id: 'sdoc9',
    fileName: '金石特电气2022年度财务报表主表（盖章版）.pdf',
    docCategory: '财务报表主表（盖章）',
    fileFormat: 'pdf',
    structuredFields: {
      reportYear: '2022',
      totalAssets: '856000000',
      totalRevenue: '423000000',
      preparedBy: '财务部',
      stampDate: '2023-03-15',
    },
  },
  {
    id: 'sdoc10',
    fileName: '金石特电气2023年度财务报表主表（盖章版）.pdf',
    docCategory: '财务报表主表（盖章）',
    fileFormat: 'pdf',
    structuredFields: {
      reportYear: '2023',
      totalAssets: '912000000',
      totalRevenue: '487000000',
      preparedBy: '财务部',
      stampDate: '2024-03-20',
    },
  },

  // ========== 5. 年度审计报告 ==========
  {
    id: 'sdoc11',
    fileName: '金石特电气2022年度审计报告-信永中和.pdf',
    docCategory: '年度审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'XYZH/2023SJBG-0156',
      auditFirm: '信永中和会计师事务所',
      auditYear: '2022',
      opinion: '标准无保留意见',
    },
  },
  {
    id: 'sdoc12',
    fileName: '金石特电气2023年度审计报告-信永中和.pdf',
    docCategory: '年度审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'XYZH/2024SJBG-0203',
      auditFirm: '信永中和会计师事务所',
      auditYear: '2023',
      opinion: '标准无保留意见',
    },
  },
  {
    id: 'sdoc13',
    fileName: '金石特电气2021年度审计报告-立信.pdf',
    docCategory: '年度审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'LX/2022SJBG-0089',
      auditFirm: '立信会计师事务所',
      auditYear: '2021',
      opinion: '标准无保留意见',
    },
  },

  // ========== 6. IT审计报告 ==========
  {
    id: 'sdoc14',
    fileName: '金石特电气2023年度IT审计报告.pdf',
    docCategory: 'IT审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'IT-AUDIT-2023-001',
      auditFirm: '德勤华永会计师事务所',
      auditScope: 'ERP系统及财务信息系统',
      auditDate: '2023-11-15',
      conclusion: '未发现重大缺陷',
    },
  },
  {
    id: 'sdoc15',
    fileName: '金石特电气2022年度IT审计报告.pdf',
    docCategory: 'IT审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'IT-AUDIT-2022-001',
      auditFirm: '安永华明会计师事务所',
      auditScope: 'OA系统及生产管理系统',
      auditDate: '2022-10-20',
      conclusion: '存在一般性建议事项',
    },
  },

  // ========== 7. 验资报告 ==========
  {
    id: 'sdoc16',
    fileName: '金石特电气增资验资报告-2022.pdf',
    docCategory: '验资报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'YZ-2022-0056',
      verifyFirm: '信永中和会计师事务所',
      verifyDate: '2022-06-30',
      registeredCapital: '200000000',
      paidInCapital: '200000000',
    },
  },
  {
    id: 'sdoc17',
    fileName: '金石特电气设立验资报告-2018.pdf',
    docCategory: '验资报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'YZ-2018-0012',
      verifyFirm: '立信会计师事务所',
      verifyDate: '2018-01-15',
      registeredCapital: '100000000',
      paidInCapital: '100000000',
    },
  },

  // ========== 8. 政府补助文件/政府项目专项审计报告 ==========
  {
    id: 'sdoc18',
    fileName: '2023年度省级技术改造专项资金补助审计报告.pdf',
    docCategory: '政府补助文件/政府项目专项审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      projectName: '智能变压器生产线技术改造',
      grantAmount: '5000000',
      grantDate: '2023-08-15',
      auditFirm: '信永中和会计师事务所',
      conclusion: '资金使用合规',
    },
  },
  {
    id: 'sdoc19',
    fileName: '2022年度国家重点研发计划专项审计报告.pdf',
    docCategory: '政府补助文件/政府项目专项审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      projectName: '高效节能型干式变压器研发',
      grantAmount: '8000000',
      grantDate: '2022-05-20',
      auditFirm: '立信会计师事务所',
      conclusion: '资金使用合规',
    },
  },

  // ========== 9. 信用评级 ==========
  {
    id: 'sdoc20',
    fileName: '金石特电气2023年度主体信用评级报告.pdf',
    docCategory: '信用评级',
    fileFormat: 'pdf',
    structuredFields: {
      ratingAgency: '中诚信国际信用评级有限公司',
      ratingDate: '2023-07-10',
      creditRating: 'AA',
      outlook: '稳定',
    },
  },
  {
    id: 'sdoc21',
    fileName: '金石特电气2022年度主体信用评级报告.pdf',
    docCategory: '信用评级',
    fileFormat: 'pdf',
    structuredFields: {
      ratingAgency: '联合资信评估股份有限公司',
      ratingDate: '2022-06-25',
      creditRating: 'AA-',
      outlook: '正面',
    },
  },

  // ========== 10. 资产评估报告 ==========
  {
    id: 'sdoc22',
    fileName: '金石特电气固定资产评估报告-2023.pdf',
    docCategory: '资产评估报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'PG-2023-0078',
      assessmentFirm: '中联资产评估集团有限公司',
      assessmentDate: '2023-09-30',
      assetType: '固定资产',
      assessedValue: '356000000',
    },
  },
  {
    id: 'sdoc23',
    fileName: '金石特电气无形资产评估报告-2022.pdf',
    docCategory: '资产评估报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'PG-2022-0045',
      assessmentFirm: '北京中企华资产评估有限公司',
      assessmentDate: '2022-12-15',
      assetType: '无形资产',
      assessedValue: '89000000',
    },
  },

  // ========== 11. 纳税申报表 ==========
  {
    id: 'sdoc24',
    fileName: '金石特电气2023年度企业所得税纳税申报表.pdf',
    docCategory: '纳税申报表',
    fileFormat: 'pdf',
    structuredFields: {
      taxPeriod: '2023年度',
      taxType: '企业所得税',
      taxableIncome: '58000000',
      taxAmount: '14500000',
    },
  },
  {
    id: 'sdoc25',
    fileName: '金石特电气2023年12月增值税纳税申报表.pdf',
    docCategory: '纳税申报表',
    fileFormat: 'pdf',
    structuredFields: {
      taxPeriod: '2023年12月',
      taxType: '增值税',
      taxableIncome: '42000000',
      taxAmount: '5460000',
    },
  },
  {
    id: 'sdoc26',
    fileName: '金石特电气2022年度企业所得税纳税申报表.pdf',
    docCategory: '纳税申报表',
    fileFormat: 'pdf',
    structuredFields: {
      taxPeriod: '2022年度',
      taxType: '企业所得税',
      taxableIncome: '51000000',
      taxAmount: '12750000',
    },
  },

  // ========== 12. 完税凭证 ==========
  {
    id: 'sdoc27',
    fileName: '金石特电气2023年度企业所得税完税凭证.pdf',
    docCategory: '完税凭证',
    fileFormat: 'pdf',
    structuredFields: {
      certificateNo: 'WS-2024-003256',
      taxType: '企业所得税',
      taxPeriod: '2023年度',
      paidAmount: '14500000',
      paymentDate: '2024-05-30',
    },
  },
  {
    id: 'sdoc28',
    fileName: '金石特电气2023年12月增值税完税凭证.pdf',
    docCategory: '完税凭证',
    fileFormat: 'pdf',
    structuredFields: {
      certificateNo: 'WS-2024-000189',
      taxType: '增值税',
      taxPeriod: '2023年12月',
      paidAmount: '5460000',
      paymentDate: '2024-01-15',
    },
  },

  // ========== 13. 纳税信用等级证明 ==========
  {
    id: 'sdoc29',
    fileName: '金石特电气2023年度纳税信用等级证明.pdf',
    docCategory: '纳税信用等级证明',
    fileFormat: 'pdf',
    structuredFields: {
      taxpayerNo: '91370100MA3XXXXXX',
      evaluationYear: '2023',
      creditLevel: 'A级',
      issuingAuthority: '济南市税务局',
    },
  },
  {
    id: 'sdoc30',
    fileName: '金石特电气2022年度纳税信用等级证明.pdf',
    docCategory: '纳税信用等级证明',
    fileFormat: 'pdf',
    structuredFields: {
      taxpayerNo: '91370100MA3XXXXXX',
      evaluationYear: '2022',
      creditLevel: 'A级',
      issuingAuthority: '济南市税务局',
    },
  },

  // ========== 14. 无欠税证明 ==========
  {
    id: 'sdoc31',
    fileName: '金石特电气2024年度无欠税证明.pdf',
    docCategory: '无欠税证明',
    fileFormat: 'pdf',
    structuredFields: {
      certificateNo: 'QS-2024-00567',
      issuingAuthority: '济南市历下区税务局',
      issueDate: '2024-03-01',
      validUntil: '2024-06-30',
    },
  },
  {
    id: 'sdoc32',
    fileName: '金石特电气2023年度无欠税证明.pdf',
    docCategory: '无欠税证明',
    fileFormat: 'pdf',
    structuredFields: {
      certificateNo: 'QS-2023-00432',
      issuingAuthority: '济南市历下区税务局',
      issueDate: '2023-03-10',
      validUntil: '2023-06-30',
    },
  },

  // ========== 15. 研发加计扣除报告 ==========
  {
    id: 'sdoc33',
    fileName: '金石特电气2023年度研发费用加计扣除鉴证报告.pdf',
    docCategory: '研发加计扣除报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'RD-JJ-2024-0023',
      auditFirm: '信永中和会计师事务所',
      rdExpense: '32000000',
      deductionAmount: '24000000',
      reportYear: '2023',
    },
  },
  {
    id: 'sdoc34',
    fileName: '金石特电气2022年度研发费用加计扣除鉴证报告.pdf',
    docCategory: '研发加计扣除报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'RD-JJ-2023-0018',
      auditFirm: '信永中和会计师事务所',
      rdExpense: '28000000',
      deductionAmount: '21000000',
      reportYear: '2022',
    },
  },

  // ========== 16. 同期资料鉴定报告 ==========
  {
    id: 'sdoc35',
    fileName: '金石特电气2023年度关联交易同期资料鉴定报告.pdf',
    docCategory: '同期资料鉴定报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'TP-2024-0012',
      auditFirm: '德勤华永会计师事务所',
      reportYear: '2023',
      relatedPartyAmount: '45000000',
      conclusion: '符合独立交易原则',
    },
  },
  {
    id: 'sdoc36',
    fileName: '金石特电气2022年度关联交易同期资料鉴定报告.pdf',
    docCategory: '同期资料鉴定报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'TP-2023-0009',
      auditFirm: '安永华明会计师事务所',
      reportYear: '2022',
      relatedPartyAmount: '38000000',
      conclusion: '符合独立交易原则',
    },
  },

  // ========== 17. 高新审计报告 ==========
  {
    id: 'sdoc37',
    fileName: '金石特电气高新技术企业认定专项审计报告-2023.pdf',
    docCategory: '高新审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'GX-AUDIT-2023-0034',
      auditFirm: '信永中和会计师事务所',
      auditYear: '2023',
      rdRatio: '6.8%',
      highTechRevenue: '380000000',
    },
  },
  {
    id: 'sdoc38',
    fileName: '金石特电气高新技术企业认定专项审计报告-2020.pdf',
    docCategory: '高新审计报告',
    fileFormat: 'pdf',
    structuredFields: {
      reportNo: 'GX-AUDIT-2020-0021',
      auditFirm: '立信会计师事务所',
      auditYear: '2020',
      rdRatio: '5.9%',
      highTechRevenue: '310000000',
    },
  },

  // ========== 18. 担保协议 ==========
  {
    id: 'sdoc39',
    fileName: '金石特电气与工商银行担保协议-2023.pdf',
    docCategory: '担保协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'DB-2023-ICBC-001',
      guarantor: '金石特电气集团有限公司',
      guaranteeAmount: '50000000',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
    },
  },
  {
    id: 'sdoc40',
    fileName: '金石特电气与建设银行担保协议-2024.pdf',
    docCategory: '担保协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'DB-2024-CCB-002',
      guarantor: '金石特电气集团有限公司',
      guaranteeAmount: '30000000',
      startDate: '2024-01-15',
      endDate: '2025-01-14',
    },
  },
  {
    id: 'sdoc41',
    fileName: '金石特电气与中国银行担保协议-2022.pdf',
    docCategory: '担保协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'DB-2022-BOC-001',
      guarantor: '金石特电气集团有限公司',
      guaranteeAmount: '40000000',
      startDate: '2022-03-01',
      endDate: '2023-02-28',
    },
  },

  // ========== 19. 授信协议 ==========
  {
    id: 'sdoc42',
    fileName: '金石特电气与工商银行综合授信协议-2024.pdf',
    docCategory: '授信协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'SX-2024-ICBC-001',
      bank: '中国工商银行济南分行',
      creditLimit: '100000000',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
  },
  {
    id: 'sdoc43',
    fileName: '金石特电气与建设银行综合授信协议-2023.pdf',
    docCategory: '授信协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'SX-2023-CCB-001',
      bank: '中国建设银行济南分行',
      creditLimit: '80000000',
      startDate: '2023-04-01',
      endDate: '2024-03-31',
    },
  },

  // ========== 20. 借款协议 ==========
  {
    id: 'sdoc44',
    fileName: '金石特电气与工商银行流动资金借款合同-2024.pdf',
    docCategory: '借款协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'JK-2024-ICBC-001',
      lender: '中国工商银行济南分行',
      loanAmount: '30000000',
      interestRate: '3.85%',
      maturityDate: '2025-03-15',
    },
  },
  {
    id: 'sdoc45',
    fileName: '金石特电气与农业银行项目贷款合同-2023.pdf',
    docCategory: '借款协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'JK-2023-ABC-001',
      lender: '中国农业银行济南分行',
      loanAmount: '50000000',
      interestRate: '4.10%',
      maturityDate: '2026-06-30',
    },
  },

  // ========== 21. 凭证入账支持文件 ==========
  {
    id: 'sdoc46',
    fileName: '2024年3月固定资产折旧计提凭证支持文件.pdf',
    docCategory: '凭证入账支持文件',
    fileFormat: 'pdf',
    structuredFields: {
      voucherNo: 'PZ-2024-03-0156',
      accountingPeriod: '2024年3月',
      entryType: '固定资产折旧',
      amount: '1250000',
    },
  },
  {
    id: 'sdoc47',
    fileName: '2024年1月工资计提凭证支持文件.pdf',
    docCategory: '凭证入账支持文件',
    fileFormat: 'pdf',
    structuredFields: {
      voucherNo: 'PZ-2024-01-0089',
      accountingPeriod: '2024年1月',
      entryType: '工资薪酬计提',
      amount: '3560000',
    },
  },
  {
    id: 'sdoc48',
    fileName: '2023年12月存货跌价准备凭证支持文件.pdf',
    docCategory: '凭证入账支持文件',
    fileFormat: 'pdf',
    structuredFields: {
      voucherNo: 'PZ-2023-12-0234',
      accountingPeriod: '2023年12月',
      entryType: '存货跌价准备',
      amount: '890000',
    },
  },

  // ========== 22. 银行回单 ==========
  {
    id: 'sdoc49',
    fileName: '工商银行电子回单-济南轨道交通货款收入.pdf',
    docCategory: '银行回单',
    fileFormat: 'pdf',
    structuredFields: {
      transactionNo: 'ICBC-2024-03150001',
      transactionDate: '2024-03-15',
      amount: '2580000',
      counterparty: '济南轨道交通集团有限公司',
    },
  },
  {
    id: 'sdoc50',
    fileName: '建设银行电子回单-供应商付款.pdf',
    docCategory: '银行回单',
    fileFormat: 'pdf',
    structuredFields: {
      transactionNo: 'CCB-2024-02280003',
      transactionDate: '2024-02-28',
      amount: '1560000',
      counterparty: '上海电气集团股份有限公司',
    },
  },
  {
    id: 'sdoc51',
    fileName: '农业银行电子回单-广州地铁货款收入.pdf',
    docCategory: '银行回单',
    fileFormat: 'pdf',
    structuredFields: {
      transactionNo: 'ABC-2023-12200005',
      transactionDate: '2023-12-20',
      amount: '3150000',
      counterparty: '广州地铁集团有限公司',
    },
  },

  // ========== 23. 承兑汇票收付回单 ==========
  {
    id: 'sdoc52',
    fileName: '银行承兑汇票收款回单-南京地铁.pdf',
    docCategory: '承兑汇票收付回单',
    fileFormat: 'pdf',
    structuredFields: {
      billNo: 'BA-2024-NJ-00123',
      issueDate: '2024-01-10',
      dueDate: '2024-07-10',
      amount: '2600000',
      drawer: '南京地铁集团有限公司',
    },
  },
  {
    id: 'sdoc53',
    fileName: '商业承兑汇票付款回单-特变电工.pdf',
    docCategory: '承兑汇票收付回单',
    fileFormat: 'pdf',
    structuredFields: {
      billNo: 'CA-2023-TB-00089',
      issueDate: '2023-09-15',
      dueDate: '2024-03-15',
      amount: '1800000',
      drawer: '金石特电气股份有限公司',
    },
  },
  {
    id: 'sdoc54',
    fileName: '银行承兑汇票收款回单-深圳地铁.pdf',
    docCategory: '承兑汇票收付回单',
    fileFormat: 'pdf',
    structuredFields: {
      billNo: 'BA-2023-SZ-00067',
      issueDate: '2023-06-20',
      dueDate: '2023-12-20',
      amount: '4500000',
      drawer: '深圳市地铁集团有限公司',
    },
  },

  // ========== 24. 报销发票 ==========
  {
    id: 'sdoc55',
    fileName: '差旅费报销发票-南京项目出差.jpg',
    docCategory: '报销发票',
    fileFormat: 'jpg',
    structuredFields: {
      invoiceNo: 'BX-2024-0156',
      invoiceDate: '2024-03-05',
      amount: '3560',
      expenseType: '差旅费',
      department: '销售部',
    },
  },
  {
    id: 'sdoc56',
    fileName: '办公用品采购报销发票-2024Q1.jpg',
    docCategory: '报销发票',
    fileFormat: 'jpg',
    structuredFields: {
      invoiceNo: 'BX-2024-0089',
      invoiceDate: '2024-01-20',
      amount: '12800',
      expenseType: '办公用品',
      department: '行政部',
    },
  },
  {
    id: 'sdoc57',
    fileName: '业务招待费报销发票-广州客户接待.jpg',
    docCategory: '报销发票',
    fileFormat: 'jpg',
    structuredFields: {
      invoiceNo: 'BX-2023-0678',
      invoiceDate: '2023-11-12',
      amount: '5680',
      expenseType: '业务招待费',
      department: '市场部',
    },
  },

  // ========== 25. 应付账款函证相关单据-对账单 ==========
  {
    id: 'sdoc58',
    fileName: '应付账款对账单-上海电气集团-2023Q4.pdf',
    docCategory: '应付账款函证相关单据-对账单',
    fileFormat: 'pdf',
    structuredFields: {
      statementNo: 'DZ-2023-SH-001',
      supplier: '上海电气集团股份有限公司',
      statementDate: '2023-12-31',
      balanceAmount: '2350000',
    },
  },
  {
    id: 'sdoc59',
    fileName: '应付账款对账单-特变电工-2023Q4.pdf',
    docCategory: '应付账款函证相关单据-对账单',
    fileFormat: 'pdf',
    structuredFields: {
      statementNo: 'DZ-2023-TB-001',
      supplier: '特变电工股份有限公司',
      statementDate: '2023-12-31',
      balanceAmount: '1680000',
    },
  },

  // ========== 26. 应付账款函证相关单据-应收询证函 ==========
  {
    id: 'sdoc60',
    fileName: '应收账款询证函-济南轨道交通-2023年末.pdf',
    docCategory: '应付账款函证相关单据-应收询证函',
    fileFormat: 'pdf',
    structuredFields: {
      confirmationNo: 'XZ-2023-JN-001',
      counterparty: '济南轨道交通集团有限公司',
      confirmationDate: '2023-12-31',
      confirmedAmount: '4560000',
      replyStatus: '已回函确认',
    },
  },
  {
    id: 'sdoc61',
    fileName: '应收账款询证函-广州地铁集团-2023年末.pdf',
    docCategory: '应付账款函证相关单据-应收询证函',
    fileFormat: 'pdf',
    structuredFields: {
      confirmationNo: 'XZ-2023-GZ-001',
      counterparty: '广州地铁集团有限公司',
      confirmationDate: '2023-12-31',
      confirmedAmount: '3200000',
      replyStatus: '已回函确认',
    },
  },
  {
    id: 'sdoc62',
    fileName: '应收账款询证函-深圳地铁集团-2023年末.pdf',
    docCategory: '应付账款函证相关单据-应收询证函',
    fileFormat: 'pdf',
    structuredFields: {
      confirmationNo: 'XZ-2023-SZ-001',
      counterparty: '深圳市地铁集团有限公司',
      confirmationDate: '2023-12-31',
      confirmedAmount: '5800000',
      replyStatus: '已回函-金额有差异',
    },
  },

  // ========== 27. 采购框架协议、质量协议 ==========
  {
    id: 'sdoc63',
    fileName: '金石特电气与上海电气年度采购框架协议-2024.pdf',
    docCategory: '采购框架协议、质量协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'KJ-2024-SH-001',
      supplier: '上海电气集团股份有限公司',
      agreementType: '采购框架协议',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
  },
  {
    id: 'sdoc64',
    fileName: '金石特电气与特变电工质量协议-2023.pdf',
    docCategory: '采购框架协议、质量协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'ZL-2023-TB-001',
      supplier: '特变电工股份有限公司',
      agreementType: '质量协议',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
    },
  },
  {
    id: 'sdoc65',
    fileName: '金石特电气与西电集团采购框架协议-2024.pdf',
    docCategory: '采购框架协议、质量协议',
    fileFormat: 'pdf',
    structuredFields: {
      agreementNo: 'KJ-2024-XD-001',
      supplier: '中国西电电气股份有限公司',
      agreementType: '采购框架协议',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
    },
  },
];

export default standaloneDocumentTable;
