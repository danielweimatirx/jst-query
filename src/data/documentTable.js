/**
 * 文件表（Document_Table）
 * 通过 orderNo 与 Order_Table 建立一对多关联
 */
const documentTable = [
  // 订单 2018000740 的文件
  { id: 'doc1', orderNo: '2018000740', type: 'pdf', name: '2018000740济南地铁...', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/01国内干变/合同/2018年合同/...' },
  { id: 'doc2', orderNo: '2018000740', type: 'pdf', name: '2078000740济南地铁R3号线一期工...', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/01国内干变/合同/2018年合同/...' },
  { id: 'doc3', orderNo: '2018000740', type: 'pdf', name: '2018000740济南地铁R3线---中航通...', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/01国内干变/合同/2018年合同/...' },
  { id: 'doc4', orderNo: '2018000740', type: 'image', name: '1742917077466_0221760146001931...', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2018/...' },
  { id: 'doc5', orderNo: '2018000740', type: 'image', name: '00738896.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2018/...' },
  { id: 'doc6', orderNo: '2018000740', type: 'pdf', name: '(运行证明) 2018000740济南市轨道...', tag: '运行证明', tagColor: 'orange', path: '/user/kass/项目文档/证明文件/...' },


  // 订单 2014001586 的文件
  { id: 'doc13', orderNo: '2014001586', type: 'pdf', name: '2014001586郑州地铁2号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/01国内干变/合同/2014年合同/...' },
  { id: 'doc14', orderNo: '2014001586', type: 'image', name: '发票-2014001586-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2014/...' },

  // 订单 2014002143 的文件
  { id: 'doc15', orderNo: '2014002143', type: 'pdf', name: '2014002143郑州城郊铁路合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/01国内干变/合同/2014年合同/...' },

  // 订单 2012000553 的文件
  { id: 'doc16', orderNo: '2012000553', type: 'pdf', name: '北京地铁14号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/...' },
  { id: 'doc17', orderNo: '2012000553', type: 'pdf', name: '2012000553北京地铁14号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/01国内干变/合同/2012年合同/...' },


  // 订单 2014002345 的文件
  { id: 'doc19', orderNo: '2014002345', type: 'pdf', name: '新疆甘泉堡翻车机合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2014年合同/...' },

  // 订单 2014002678 的文件
  { id: 'doc20', orderNo: '2014002678', type: 'pdf', name: '临城唐县光伏电站合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2014年合同/...' },
  { id: 'doc21', orderNo: '2014002678', type: 'pdf', name: '通电验收单-临城唐县.pdf', tag: '通电验收单', tagColor: 'red', path: '/user/kass/项目文档/验收单/...' },

  // ========== 新增订单的文件 ==========

  // 订单 2019001001 成都地铁5号线
  { id: 'doc22', orderNo: '2019001001', type: 'pdf', name: '成都地铁5号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2019/...' },
  { id: 'doc23', orderNo: '2019001001', type: 'pdf', name: '2019001001成都地铁5号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2019年合同/...' },
  { id: 'doc24', orderNo: '2019001001', type: 'image', name: '发票-2019001001-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2019/...' },
  { id: 'doc25', orderNo: '2019001001', type: 'image', name: '发票-2019001001-002.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2019/...' },


  // 订单 2019001002 成都地铁18号线
  { id: 'doc27', orderNo: '2019001002', type: 'pdf', name: '2019001002成都地铁18号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2019年合同/...' },
  { id: 'doc28', orderNo: '2019001002', type: 'image', name: '发票-2019001002-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2019/...' },


  // 订单 2020001003 深圳地铁12号线
  { id: 'doc30', orderNo: '2020001003', type: 'pdf', name: '深圳地铁12号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2020/...' },
  { id: 'doc31', orderNo: '2020001003', type: 'pdf', name: '2020001003深圳地铁12号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2020年合同/...' },
  { id: 'doc32', orderNo: '2020001003', type: 'image', name: '发票-2020001003-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2020/...' },
  { id: 'doc33', orderNo: '2020001003', type: 'image', name: '发票-2020001003-002.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2020/...' },
  { id: 'doc34', orderNo: '2020001003', type: 'pdf', name: '运行证明-深圳12号线.pdf', tag: '运行证明', tagColor: 'orange', path: '/user/kass/项目文档/证明文件/...' },

  // 订单 2020001004 深圳地铁14号线
  { id: 'doc35', orderNo: '2020001004', type: 'pdf', name: '2020001004深圳地铁14号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2020年合同/...' },
  { id: 'doc36', orderNo: '2020001004', type: 'image', name: '发票-2020001004-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2020/...' },
  { id: 'doc37', orderNo: '2020001004', type: 'pdf', name: '通电验收单-深圳14号线.pdf', tag: '通电验收单', tagColor: 'red', path: '/user/kass/项目文档/验收单/...' },

  // 订单 2021001005 武汉地铁11号线
  { id: 'doc38', orderNo: '2021001005', type: 'pdf', name: '武汉地铁11号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2021/...' },
  { id: 'doc39', orderNo: '2021001005', type: 'pdf', name: '2021001005武汉地铁11号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2021年合同/...' },
  { id: 'doc40', orderNo: '2021001005', type: 'image', name: '发票-2021001005-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2021/...' },


  // 订单 2021001006 西安地铁8号线
  { id: 'doc42', orderNo: '2021001006', type: 'pdf', name: '2021001006西安地铁8号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2021年合同/...' },
  { id: 'doc43', orderNo: '2021001006', type: 'image', name: '发票-2021001006-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2021/...' },
  { id: 'doc44', orderNo: '2021001006', type: 'image', name: '发票-2021001006-002.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2021/...' },


  // 订单 2022001007 青海格尔木光伏
  { id: 'doc46', orderNo: '2022001007', type: 'pdf', name: '青海格尔木光伏电站合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2022年合同/...' },
  { id: 'doc47', orderNo: '2022001007', type: 'image', name: '发票-2022001007-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2022/...' },
  { id: 'doc48', orderNo: '2022001007', type: 'pdf', name: '通电验收单-格尔木光伏.pdf', tag: '通电验收单', tagColor: 'red', path: '/user/kass/项目文档/验收单/...' },

  // 订单 2022001008 内蒙古风电
  { id: 'doc49', orderNo: '2022001008', type: 'pdf', name: '内蒙古乌兰察布风电场合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2022年合同/...' },
  { id: 'doc50', orderNo: '2022001008', type: 'image', name: '发票-2022001008-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2022/...' },


  // 订单 2023001009 南京地铁7号线
  { id: 'doc52', orderNo: '2023001009', type: 'pdf', name: '南京地铁7号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2023/...' },
  { id: 'doc53', orderNo: '2023001009', type: 'pdf', name: '2023001009南京地铁7号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2023年合同/...' },
  { id: 'doc54', orderNo: '2023001009', type: 'image', name: '发票-2023001009-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2023/...' },


  // 订单 2023001010 广州地铁13号线
  { id: 'doc56', orderNo: '2023001010', type: 'pdf', name: '广州地铁13号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2023/...' },
  { id: 'doc57', orderNo: '2023001010', type: 'pdf', name: '2023001010广州地铁13号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2023年合同/...' },
  { id: 'doc58', orderNo: '2023001010', type: 'image', name: '发票-2023001010-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2023/...' },
  { id: 'doc59', orderNo: '2023001010', type: 'image', name: '发票-2023001010-002.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2023/...' },
  { id: 'doc60', orderNo: '2023001010', type: 'pdf', name: '运行证明-广州13号线.pdf', tag: '运行证明', tagColor: 'orange', path: '/user/kass/项目文档/证明文件/...' },

  // 订单 2023001011 宝钢湛江
  { id: 'doc61', orderNo: '2023001011', type: 'pdf', name: '宝钢湛江冶金变压器合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2023年合同/...' },
  { id: 'doc62', orderNo: '2023001011', type: 'image', name: '发票-2023001011-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2023/...' },


  // 订单 2024001012 中石化镇海
  { id: 'doc64', orderNo: '2024001012', type: 'pdf', name: '中石化镇海炼化合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2024年合同/...' },
  { id: 'doc65', orderNo: '2024001012', type: 'image', name: '发票-2024001012-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2024/...' },


  // 订单 2024001013 甘肃酒泉风电
  { id: 'doc67', orderNo: '2024001013', type: 'pdf', name: '甘肃酒泉风电场合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2024年合同/...' },
  { id: 'doc68', orderNo: '2024001013', type: 'image', name: '发票-2024001013-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2024/...' },

  // 订单 2024001014 济南轨道交通4号线
  { id: 'doc69', orderNo: '2024001014', type: 'pdf', name: '济南轨道交通4号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2024/...' },
  { id: 'doc70', orderNo: '2024001014', type: 'pdf', name: '2024001014济南轨道交通4号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2024年合同/...' },
  { id: 'doc71', orderNo: '2024001014', type: 'image', name: '发票-2024001014-001.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2024/...' },
  { id: 'doc72', orderNo: '2024001014', type: 'image', name: '发票-2024001014-002.jpg', tag: '发票', tagColor: 'purple', path: '/user/kass/财务文档/发票/2024/...' },

  // 订单 2025001015 长沙地铁6号线
  { id: 'doc73', orderNo: '2025001015', type: 'pdf', name: '长沙地铁6号线中标通知书.pdf', tag: '中标通知书', tagColor: 'blue', path: '/user/kass/公司文档/营销/销售/中标通知/2025/...' },
  { id: 'doc74', orderNo: '2025001015', type: 'pdf', name: '2025001015长沙地铁6号线合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2025年合同/...' },

  // 订单 2025001016 宁夏中卫光伏
  { id: 'doc75', orderNo: '2025001016', type: 'pdf', name: '宁夏中卫光伏电站合同.pdf', tag: '合同', tagColor: 'green', path: '/user/kass/公司文档/营销/销售/合同/2025年合同/...' },

  // ========== 新增单据类型：银行回单、承兑汇票收付回单、报销发票 ==========

  // 银行回单（tagColor: '#389e0d'）
  { id: 'doc96', orderNo: '2018000740', type: 'pdf', name: '银行回单-济南R3线货款收入-001.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/财务文档/银行回单/2018/...' },
  { id: 'doc97', orderNo: '2019001001', type: 'pdf', name: '银行回单-成都5号线货款收入-001.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/财务文档/银行回单/2019/...' },
  { id: 'doc98', orderNo: '2020001003', type: 'pdf', name: '银行回单-深圳12号线货款收入-001.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/财务文档/银行回单/2020/...' },
  { id: 'doc99', orderNo: '2023001010', type: 'pdf', name: '银行回单-广州13号线货款收入-001.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/财务文档/银行回单/2023/...' },
  { id: 'doc100', orderNo: '2024001014', type: 'pdf', name: '银行回单-济南4号线预付款收入-001.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/财务文档/银行回单/2024/...' },

  // 承兑汇票收付回单（tagColor: '#d48806'）
  { id: 'doc101', orderNo: '2019001002', type: 'pdf', name: '承兑汇票收款回单-成都18号线-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/财务文档/汇票回单/2019/...' },
  { id: 'doc102', orderNo: '2021001005', type: 'pdf', name: '承兑汇票收款回单-武汉11号线-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/财务文档/汇票回单/2021/...' },
  { id: 'doc103', orderNo: '2022001007', type: 'pdf', name: '承兑汇票收款回单-格尔木光伏-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/财务文档/汇票回单/2022/...' },
  { id: 'doc104', orderNo: '2023001009', type: 'pdf', name: '承兑汇票收款回单-南京7号线-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/财务文档/汇票回单/2023/...' },

  // 报销发票（tagColor: '#c41d7f'）
  { id: 'doc105', orderNo: '2018000740', type: 'image', name: '报销发票-济南R3线项目差旅费.jpg', tag: '报销发票', tagColor: '#c41d7f', path: '/user/kass/财务文档/报销/2018/...' },
  { id: 'doc106', orderNo: '2020001004', type: 'image', name: '报销发票-深圳14号线安装调试差旅.jpg', tag: '报销发票', tagColor: '#c41d7f', path: '/user/kass/财务文档/报销/2020/...' },
  { id: 'doc107', orderNo: '2023001010', type: 'image', name: '报销发票-广州13号线验收出差费.jpg', tag: '报销发票', tagColor: '#c41d7f', path: '/user/kass/财务文档/报销/2023/...' },
  { id: 'doc108', orderNo: '2024001012', type: 'image', name: '报销发票-中石化镇海项目差旅费.jpg', tag: '报销发票', tagColor: '#c41d7f', path: '/user/kass/财务文档/报销/2024/...' },

  // ========== 技术协议 ==========
  { id: 'doc109', orderNo: '2018000740', type: 'pdf', name: '技术协议-济南R3线干式变压器.pdf', tag: '技术协议', tagColor: '#2db7f5', path: '/user/kass/项目文档/技术协议/2018/...' },
  { id: 'doc110', orderNo: '2020001003', type: 'pdf', name: '技术协议-深圳12号线变压器技术规范.pdf', tag: '技术协议', tagColor: '#2db7f5', path: '/user/kass/项目文档/技术协议/2020/...' },
  { id: 'doc111', orderNo: '2022001007', type: 'pdf', name: '技术协议-格尔木光伏变压器参数.pdf', tag: '技术协议', tagColor: '#2db7f5', path: '/user/kass/项目文档/技术协议/2022/...' },
  { id: 'doc112', orderNo: '2024001014', type: 'pdf', name: '技术协议-济南4号线牵引变压器.pdf', tag: '技术协议', tagColor: '#2db7f5', path: '/user/kass/项目文档/技术协议/2024/...' },
  { id: 'doc113', orderNo: '2025001015', type: 'pdf', name: '技术协议-长沙6号线干式变压器.pdf', tag: '技术协议', tagColor: '#2db7f5', path: '/user/kass/项目文档/技术协议/2025/...' },

  // ========== 应收催收单 ==========
  { id: 'doc114', orderNo: '2019001001', type: 'pdf', name: '应收催收单-成都5号线尾款催收.pdf', tag: '应收催收单', tagColor: '#fa8c16', path: '/user/kass/财务文档/催收/2019/...' },
  { id: 'doc115', orderNo: '2021001005', type: 'pdf', name: '应收催收单-武汉11号线质保金催收.pdf', tag: '应收催收单', tagColor: '#fa8c16', path: '/user/kass/财务文档/催收/2021/...' },
  { id: 'doc116', orderNo: '2023001009', type: 'pdf', name: '应收催收单-南京7号线货款催收.pdf', tag: '应收催收单', tagColor: '#fa8c16', path: '/user/kass/财务文档/催收/2023/...' },
  { id: 'doc117', orderNo: '2024001013', type: 'pdf', name: '应收催收单-甘肃酒泉风电尾款催收.pdf', tag: '应收催收单', tagColor: '#fa8c16', path: '/user/kass/财务文档/催收/2024/...' },

  // ========== 竣工验收单 ==========
  { id: 'doc118', orderNo: '2019001002', type: 'pdf', name: '竣工验收单-成都18号线工程验收.pdf', tag: '竣工验收单', tagColor: '#13c2c2', path: '/user/kass/项目文档/竣工验收/2019/...' },
  { id: 'doc119', orderNo: '2020001004', type: 'pdf', name: '竣工验收单-深圳14号线工程验收.pdf', tag: '竣工验收单', tagColor: '#13c2c2', path: '/user/kass/项目文档/竣工验收/2020/...' },
  { id: 'doc120', orderNo: '2022001008', type: 'pdf', name: '竣工验收单-内蒙古风电场工程验收.pdf', tag: '竣工验收单', tagColor: '#13c2c2', path: '/user/kass/项目文档/竣工验收/2022/...' },
  { id: 'doc121', orderNo: '2023001010', type: 'pdf', name: '竣工验收单-广州13号线工程验收.pdf', tag: '竣工验收单', tagColor: '#13c2c2', path: '/user/kass/项目文档/竣工验收/2023/...' },

  // ========== 拣配单 ==========
  { id: 'doc122', orderNo: '2020001003', type: 'pdf', name: '拣配单-深圳12号线变压器出库.pdf', tag: '拣配单', tagColor: '#597ef7', path: '/user/kass/仓储文档/拣配单/2020/...' },
  { id: 'doc123', orderNo: '2021001006', type: 'pdf', name: '拣配单-西安8号线变压器出库.pdf', tag: '拣配单', tagColor: '#597ef7', path: '/user/kass/仓储文档/拣配单/2021/...' },
  { id: 'doc124', orderNo: '2023001011', type: 'pdf', name: '拣配单-宝钢湛江冶金变压器出库.pdf', tag: '拣配单', tagColor: '#597ef7', path: '/user/kass/仓储文档/拣配单/2023/...' },
  { id: 'doc125', orderNo: '2025001016', type: 'pdf', name: '拣配单-宁夏中卫光伏变压器出库.pdf', tag: '拣配单', tagColor: '#597ef7', path: '/user/kass/仓储文档/拣配单/2025/...' },

  // ========== 代付协议 ==========
  { id: 'doc126', orderNo: '2019001001', type: 'pdf', name: '代付协议-成都5号线运费代付.pdf', tag: '代付协议', tagColor: '#9254de', path: '/user/kass/财务文档/代付协议/2019/...' },
  { id: 'doc127', orderNo: '2022001007', type: 'pdf', name: '代付协议-格尔木光伏安装费代付.pdf', tag: '代付协议', tagColor: '#9254de', path: '/user/kass/财务文档/代付协议/2022/...' },
  { id: 'doc128', orderNo: '2024001012', type: 'pdf', name: '代付协议-中石化镇海运输费代付.pdf', tag: '代付协议', tagColor: '#9254de', path: '/user/kass/财务文档/代付协议/2024/...' },

  // ========== 产品退货单 ==========
  { id: 'doc129', orderNo: '2021001005', type: 'pdf', name: '产品退货单-武汉11号线备件退货.pdf', tag: '产品退货单', tagColor: '#f5222d', path: '/user/kass/仓储文档/退货单/2021/...' },
  { id: 'doc130', orderNo: '2023001010', type: 'pdf', name: '产品退货单-广州13号线不合格品退货.pdf', tag: '产品退货单', tagColor: '#f5222d', path: '/user/kass/仓储文档/退货单/2023/...' },
  { id: 'doc131', orderNo: '2024001014', type: 'pdf', name: '产品退货单-济南4号线配件退货.pdf', tag: '产品退货单', tagColor: '#f5222d', path: '/user/kass/仓储文档/退货单/2024/...' },

  // ========== 装箱清单 ==========
  { id: 'doc132', orderNo: '2018000740', type: 'pdf', name: '装箱清单-济南R3线变压器发货.pdf', tag: '装箱清单', tagColor: '#52c41a', path: '/user/kass/物流文档/装箱清单/2018/...' },
  { id: 'doc133', orderNo: '2020001003', type: 'pdf', name: '装箱清单-深圳12号线变压器发货.pdf', tag: '装箱清单', tagColor: '#52c41a', path: '/user/kass/物流文档/装箱清单/2020/...' },
  { id: 'doc134', orderNo: '2022001008', type: 'pdf', name: '装箱清单-内蒙古风电变压器发货.pdf', tag: '装箱清单', tagColor: '#52c41a', path: '/user/kass/物流文档/装箱清单/2022/...' },
  { id: 'doc135', orderNo: '2025001015', type: 'pdf', name: '装箱清单-长沙6号线变压器发货.pdf', tag: '装箱清单', tagColor: '#52c41a', path: '/user/kass/物流文档/装箱清单/2025/...' },

  // ========== 出口报关单 ==========
  { id: 'doc136', orderNo: '2020001004', type: 'pdf', name: '出口报关单-深圳14号线设备出口.pdf', tag: '出口报关单', tagColor: '#1890ff', path: '/user/kass/外贸文档/报关单/2020/...' },
  { id: 'doc137', orderNo: '2023001011', type: 'pdf', name: '出口报关单-宝钢湛江冶金设备出口.pdf', tag: '出口报关单', tagColor: '#1890ff', path: '/user/kass/外贸文档/报关单/2023/...' },
  { id: 'doc138', orderNo: '2025001016', type: 'pdf', name: '出口报关单-宁夏中卫光伏设备出口.pdf', tag: '出口报关单', tagColor: '#1890ff', path: '/user/kass/外贸文档/报关单/2025/...' },

  // ========== 其他 ==========
  { id: 'doc139', orderNo: '2019001002', type: 'pdf', name: '其他-成都18号线项目备忘录.pdf', tag: '其他', tagColor: '#8c8c8c', path: '/user/kass/项目文档/其他/2019/...' },
  { id: 'doc140', orderNo: '2021001006', type: 'pdf', name: '其他-西安8号线现场照片汇总.pdf', tag: '其他', tagColor: '#8c8c8c', path: '/user/kass/项目文档/其他/2021/...' },
  { id: 'doc141', orderNo: '2024001013', type: 'pdf', name: '其他-甘肃酒泉风电项目会议纪要.pdf', tag: '其他', tagColor: '#8c8c8c', path: '/user/kass/项目文档/其他/2024/...' },
];

export default documentTable;
