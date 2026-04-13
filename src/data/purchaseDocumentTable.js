/**
 * 采购单据关联表（Purchase_Document_Table）
 * 通过 purchaseOrderNo 与 Purchase_Order_Table 建立一对多关联
 * 15种单据类型：资产验收报告、银行回单、承兑汇票收付回单、报销发票、
 * 应付账款函证相关单据-对账单、应付账款函证相关单据-应收询证函、采购发票、
 * 采购合同、供应商出厂检验报告、原材料外购直发签收单、到货验收单、
 * 预验收单、通电验收单、最终验收单、入库单
 */
const purchaseDocumentTable = [
  // ========== 采购订单 PO2018-0001 上海电气集团 - 济南R3线整流机组核心部件 ==========
  { id: 'pdoc1', purchaseOrderNo: 'PO2018-0001', type: 'pdf', name: 'PO2018-0001采购订单及合同-上海电气整流机组.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2018/...' },
  { id: 'pdoc2', purchaseOrderNo: 'PO2018-0001', type: 'pdf', name: 'PO2018-0001供应商出厂检验报告-整流机组.pdf', tag: '供应商出厂检验报告', tagColor: '#13c2c2', path: '/user/kass/采购文档/检验报告/2018/...' },
  { id: 'pdoc3', purchaseOrderNo: 'PO2018-0001', type: 'pdf', name: 'PO2018-0001到货验收单-001.pdf', tag: '到货验收单', tagColor: '#52c41a', path: '/user/kass/采购文档/验收单/2018/...' },
  { id: 'pdoc4', purchaseOrderNo: 'PO2018-0001', type: 'pdf', name: 'PO2018-0001入库单-001.pdf', tag: '入库单', tagColor: '#faad14', path: '/user/kass/采购文档/入库单/2018/...' },
  { id: 'pdoc5', purchaseOrderNo: 'PO2018-0001', type: 'image', name: 'PO2018-0001采购发票-001.jpg', tag: '采购发票', tagColor: '#eb2f96', path: '/user/kass/采购文档/发票/2018/...' },

  // ========== 采购订单 PO2018-0002 正泰电器 - 济南R3线配电变压器绝缘组件 ==========
  { id: 'pdoc6', purchaseOrderNo: 'PO2018-0002', type: 'pdf', name: 'PO2018-0002采购订单及合同-正泰电器绝缘组件.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2018/...' },
  { id: 'pdoc7', purchaseOrderNo: 'PO2018-0002', type: 'pdf', name: 'PO2018-0002银行回单-付款.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/采购文档/银行回单/2018/...' },
  { id: 'pdoc8', purchaseOrderNo: 'PO2018-0002', type: 'pdf', name: 'PO2018-0002预验收单-001.pdf', tag: '预验收单', tagColor: '#722ed1', path: '/user/kass/采购文档/验收单/2018/...' },
  { id: 'pdoc9', purchaseOrderNo: 'PO2018-0002', type: 'pdf', name: 'PO2018-0002最终验收单-001.pdf', tag: '最终验收单', tagColor: '#cf1322', path: '/user/kass/采购文档/验收单/2018/...' },

  // ========== 采购订单 PO2019-0003 特变电工 - 成都5号线硅钢片及铜导线 ==========
  { id: 'pdoc10', purchaseOrderNo: 'PO2019-0003', type: 'pdf', name: 'PO2019-0003采购订单及合同-特变电工硅钢片.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2019/...' },
  { id: 'pdoc11', purchaseOrderNo: 'PO2019-0003', type: 'pdf', name: 'PO2019-0003原材料外购直发签收单-001.pdf', tag: '原材料外购直发签收单', tagColor: '#d4b106', path: '/user/kass/采购文档/签收单/2019/...' },
  { id: 'pdoc12', purchaseOrderNo: 'PO2019-0003', type: 'pdf', name: 'PO2019-0003入库单-001.pdf', tag: '入库单', tagColor: '#faad14', path: '/user/kass/采购文档/入库单/2019/...' },
  { id: 'pdoc13', purchaseOrderNo: 'PO2019-0003', type: 'image', name: 'PO2019-0003采购发票-001.jpg', tag: '采购发票', tagColor: '#eb2f96', path: '/user/kass/采购文档/发票/2019/...' },
  { id: 'pdoc14', purchaseOrderNo: 'PO2019-0003', type: 'pdf', name: 'PO2019-0003承兑汇票收付回单-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/采购文档/汇票/2019/...' },

  // ========== 采购订单 PO2019-0004 南京南瑞继保 - 成都18号线保护测控装置 ==========
  { id: 'pdoc15', purchaseOrderNo: 'PO2019-0004', type: 'pdf', name: 'PO2019-0004采购订单及合同-南瑞继保测控装置.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2019/...' },
  { id: 'pdoc16', purchaseOrderNo: 'PO2019-0004', type: 'pdf', name: 'PO2019-0004供应商出厂检验报告-测控装置.pdf', tag: '供应商出厂检验报告', tagColor: '#13c2c2', path: '/user/kass/采购文档/检验报告/2019/...' },
  { id: 'pdoc17', purchaseOrderNo: 'PO2019-0004', type: 'pdf', name: 'PO2019-0004通电验收单-001.pdf', tag: '通电验收单', tagColor: '#08979c', path: '/user/kass/采购文档/验收单/2019/...' },
  { id: 'pdoc18', purchaseOrderNo: 'PO2019-0004', type: 'pdf', name: 'PO2019-0004应付账款对账单-南瑞继保.pdf', tag: '应付账款函证相关单据-对账单', tagColor: '#531dab', path: '/user/kass/采购文档/对账单/2019/...' },

  // ========== 采购订单 PO2020-0005 西安西电 - 深圳12号线主变压器 ==========
  { id: 'pdoc19', purchaseOrderNo: 'PO2020-0005', type: 'pdf', name: 'PO2020-0005采购订单及合同-西电主变压器.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2020/...' },
  { id: 'pdoc20', purchaseOrderNo: 'PO2020-0005', type: 'pdf', name: 'PO2020-0005资产验收报告-主变压器.pdf', tag: '资产验收报告', tagColor: '#1890ff', path: '/user/kass/采购文档/验收报告/2020/...' },
  { id: 'pdoc21', purchaseOrderNo: 'PO2020-0005', type: 'image', name: 'PO2020-0005采购发票-001.jpg', tag: '采购发票', tagColor: '#eb2f96', path: '/user/kass/采购文档/发票/2020/...' },
  { id: 'pdoc22', purchaseOrderNo: 'PO2020-0005', type: 'pdf', name: 'PO2020-0005银行回单-付款.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/采购文档/银行回单/2020/...' },
  { id: 'pdoc23', purchaseOrderNo: 'PO2020-0005', type: 'pdf', name: 'PO2020-0005最终验收单-001.pdf', tag: '最终验收单', tagColor: '#cf1322', path: '/user/kass/采购文档/验收单/2020/...' },

  // ========== 采购订单 PO2020-0006 河南平高电气 - 深圳14号线高压开关柜 ==========
  { id: 'pdoc24', purchaseOrderNo: 'PO2020-0006', type: 'pdf', name: 'PO2020-0006采购订单及合同-平高电气开关柜.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2020/...' },
  { id: 'pdoc25', purchaseOrderNo: 'PO2020-0006', type: 'pdf', name: 'PO2020-0006入库单-001.pdf', tag: '入库单', tagColor: '#faad14', path: '/user/kass/采购文档/入库单/2020/...' },
  { id: 'pdoc26', purchaseOrderNo: 'PO2020-0006', type: 'pdf', name: 'PO2020-0006报销发票-安装调试差旅.jpg', tag: '报销发票', tagColor: '#c41d7f', path: '/user/kass/采购文档/报销/2020/...' },
  { id: 'pdoc27', purchaseOrderNo: 'PO2020-0006', type: 'pdf', name: 'PO2020-0006到货验收单-001.pdf', tag: '到货验收单', tagColor: '#52c41a', path: '/user/kass/采购文档/验收单/2020/...' },

  // ========== 采购订单 PO2021-0007 中国西电 - 武汉11号线铁芯及绕组材料 ==========
  { id: 'pdoc28', purchaseOrderNo: 'PO2021-0007', type: 'pdf', name: 'PO2021-0007采购订单及合同-西电铁芯绕组材料.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2021/...' },
  { id: 'pdoc29', purchaseOrderNo: 'PO2021-0007', type: 'pdf', name: 'PO2021-0007原材料外购直发签收单-001.pdf', tag: '原材料外购直发签收单', tagColor: '#d4b106', path: '/user/kass/采购文档/签收单/2021/...' },
  { id: 'pdoc30', purchaseOrderNo: 'PO2021-0007', type: 'pdf', name: 'PO2021-0007入库单-001.pdf', tag: '入库单', tagColor: '#faad14', path: '/user/kass/采购文档/入库单/2021/...' },
  { id: 'pdoc31', purchaseOrderNo: 'PO2021-0007', type: 'image', name: 'PO2021-0007采购发票-001.jpg', tag: '采购发票', tagColor: '#eb2f96', path: '/user/kass/采购文档/发票/2021/...' },
  { id: 'pdoc32', purchaseOrderNo: 'PO2021-0007', type: 'pdf', name: 'PO2021-0007承兑汇票收付回单-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/采购文档/汇票/2021/...' },

  // ========== 采购订单 PO2022-0008 天津特变电工 - 青海格尔木光伏硅钢片 ==========
  { id: 'pdoc33', purchaseOrderNo: 'PO2022-0008', type: 'pdf', name: 'PO2022-0008采购订单及合同-特变电工硅钢片.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2022/...' },
  { id: 'pdoc34', purchaseOrderNo: 'PO2022-0008', type: 'pdf', name: 'PO2022-0008供应商出厂检验报告-硅钢片.pdf', tag: '供应商出厂检验报告', tagColor: '#13c2c2', path: '/user/kass/采购文档/检验报告/2022/...' },
  { id: 'pdoc35', purchaseOrderNo: 'PO2022-0008', type: 'pdf', name: 'PO2022-0008应收询证函-特变电工.pdf', tag: '应付账款函证相关单据-应收询证函', tagColor: '#9254de', path: '/user/kass/采购文档/询证函/2022/...' },

  // ========== 采购订单 PO2023-0009 许继电气 - 南京7号线整流变压器 ==========
  { id: 'pdoc36', purchaseOrderNo: 'PO2023-0009', type: 'pdf', name: 'PO2023-0009采购订单及合同-许继电气整流变压器.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2023/...' },
  { id: 'pdoc37', purchaseOrderNo: 'PO2023-0009', type: 'pdf', name: 'PO2023-0009预验收单-001.pdf', tag: '预验收单', tagColor: '#722ed1', path: '/user/kass/采购文档/验收单/2023/...' },
  { id: 'pdoc38', purchaseOrderNo: 'PO2023-0009', type: 'pdf', name: 'PO2023-0009通电验收单-001.pdf', tag: '通电验收单', tagColor: '#08979c', path: '/user/kass/采购文档/验收单/2023/...' },
  { id: 'pdoc39', purchaseOrderNo: 'PO2023-0009', type: 'image', name: 'PO2023-0009采购发票-001.jpg', tag: '采购发票', tagColor: '#eb2f96', path: '/user/kass/采购文档/发票/2023/...' },
  { id: 'pdoc40', purchaseOrderNo: 'PO2023-0009', type: 'pdf', name: 'PO2023-0009资产验收报告-整流变压器.pdf', tag: '资产验收报告', tagColor: '#1890ff', path: '/user/kass/采购文档/验收报告/2023/...' },

  // ========== 采购订单 PO2023-0010 思源电气 - 广州13号线牵引整流机组变压器 ==========
  { id: 'pdoc41', purchaseOrderNo: 'PO2023-0010', type: 'pdf', name: 'PO2023-0010采购订单及合同-思源电气变压器.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2023/...' },
  { id: 'pdoc42', purchaseOrderNo: 'PO2023-0010', type: 'pdf', name: 'PO2023-0010到货验收单-001.pdf', tag: '到货验收单', tagColor: '#52c41a', path: '/user/kass/采购文档/验收单/2023/...' },
  { id: 'pdoc43', purchaseOrderNo: 'PO2023-0010', type: 'pdf', name: 'PO2023-0010入库单-001.pdf', tag: '入库单', tagColor: '#faad14', path: '/user/kass/采购文档/入库单/2023/...' },
  { id: 'pdoc44', purchaseOrderNo: 'PO2023-0010', type: 'pdf', name: 'PO2023-0010应付账款对账单-思源电气.pdf', tag: '应付账款函证相关单据-对账单', tagColor: '#531dab', path: '/user/kass/采购文档/对账单/2023/...' },

  // ========== 采购订单 PO2024-0011 保定天威保变 - 中石化镇海散热器及套管 ==========
  { id: 'pdoc45', purchaseOrderNo: 'PO2024-0011', type: 'pdf', name: 'PO2024-0011采购订单及合同-天威保变散热器套管.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2024/...' },
  { id: 'pdoc46', purchaseOrderNo: 'PO2024-0011', type: 'pdf', name: 'PO2024-0011银行回单-付款.pdf', tag: '银行回单', tagColor: '#389e0d', path: '/user/kass/采购文档/银行回单/2024/...' },
  { id: 'pdoc47', purchaseOrderNo: 'PO2024-0011', type: 'image', name: 'PO2024-0011采购发票-001.jpg', tag: '采购发票', tagColor: '#eb2f96', path: '/user/kass/采购文档/发票/2024/...' },
  { id: 'pdoc48', purchaseOrderNo: 'PO2024-0011', type: 'pdf', name: 'PO2024-0011报销发票-验收出差费用.jpg', tag: '报销发票', tagColor: '#c41d7f', path: '/user/kass/采购文档/报销/2024/...' },
  { id: 'pdoc49', purchaseOrderNo: 'PO2024-0011', type: 'pdf', name: 'PO2024-0011应收询证函-天威保变.pdf', tag: '应付账款函证相关单据-应收询证函', tagColor: '#9254de', path: '/user/kass/采购文档/询证函/2024/...' },

  // ========== 采购订单 PO2024-0012 山东电工电气 - 济南4号线整流变压器成套设备 ==========
  { id: 'pdoc50', purchaseOrderNo: 'PO2024-0012', type: 'pdf', name: 'PO2024-0012采购订单及合同-山东电工整流变压器.pdf', tag: '采购合同', tagColor: '#2f54eb', path: '/user/kass/采购文档/合同/2024/...' },
  { id: 'pdoc51', purchaseOrderNo: 'PO2024-0012', type: 'pdf', name: 'PO2024-0012供应商出厂检验报告-整流变压器.pdf', tag: '供应商出厂检验报告', tagColor: '#13c2c2', path: '/user/kass/采购文档/检验报告/2024/...' },
  { id: 'pdoc52', purchaseOrderNo: 'PO2024-0012', type: 'pdf', name: 'PO2024-0012资产验收报告-成套设备.pdf', tag: '资产验收报告', tagColor: '#1890ff', path: '/user/kass/采购文档/验收报告/2024/...' },
  { id: 'pdoc53', purchaseOrderNo: 'PO2024-0012', type: 'pdf', name: 'PO2024-0012承兑汇票收付回单-001.pdf', tag: '承兑汇票收付回单', tagColor: '#d48806', path: '/user/kass/采购文档/汇票/2024/...' },
];

export default purchaseDocumentTable;
