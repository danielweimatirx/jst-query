import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button, Checkbox, Tag, Input, List, Tooltip, Pagination, Drawer, Table, Select, Tabs, Modal, message } from 'antd';
import {
  SyncOutlined,
  RightOutlined,
  PlusOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  HistoryOutlined,
  UpOutlined,
  DownOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  TableOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useDocumentConversation } from '../contexts/DocumentConversationContext';
import CombinedThinking from '../components/CombinedThinking';
import OrderRelationsPanel from '../components/OrderRelationsPanel';
import orderTable from '../data/orderTable';
import documentTable from '../data/documentTable';
import purchaseOrderTable from '../data/purchaseOrderTable';
import purchaseDocumentTable from '../data/purchaseDocumentTable';
import standaloneDocumentTable from '../data/standaloneDocumentTable';
import docCategoryMeta from '../data/docCategoryMeta';
import { parseQuery } from '../utils/queryParser';
import { executeSearch, executeMultiDimensionSearch } from '../utils/searchService';
import './QuestionAssistant.css';
import './SalesDocumentSearch.css';
import '../components/QueryResult.css';

const { TextArea } = Input;
const { Option, OptGroup } = Select;

// 有权限的文件类型列表（按维度区分）
const authorizedDocumentTypes = {
  sales: ['合同', '发票', '通电验收单'],
  purchase: ['采购合同', '采购发票', '入库单', '到货验收单', '通电验收单'],
  document: [],  // 凭证维度不区分权限
};

// 初始结果集：全量订单（含关联文件）- 保留用于对话区兼容
const initialResults = executeSearch(
  { conditions: [], queryType: 'list', aggregation: null, description: '' },
  orderTable,
  documentTable
);

// 初始多维度结果集
const initialMultiResults = executeMultiDimensionSearch(
  { conditions: [], queryType: 'list', aggregation: null, description: '' },
  orderTable, documentTable, purchaseOrderTable, purchaseDocumentTable, standaloneDocumentTable
);

const SalesDocumentSearch = () => {
  const {
    conversations: docConversations,
    activeConversationId: docActiveConversationId,
    updateConversation: docUpdateConversation,
    createNewConversation: docCreateNewConversation,
    formatDateTime: formatDocDateTime,
  } = useDocumentConversation();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = useMemo(
    () => docConversations.find((c) => c.id === docActiveConversationId),
    [docConversations, docActiveConversationId]
  );

  // 首次进入单据检索页时，如果没有任何对话，则自动创建一个新对话并设为当前对话
  useEffect(() => {
    if (!docActiveConversationId && (!docConversations || docConversations.length === 0)) {
      docCreateNewConversation();
    }
  }, [docActiveConversationId, docConversations, docCreateNewConversation]);

  useEffect(() => {
    if (isGenerating) return;
    if (activeConv && Array.isArray(activeConv.messages)) {
      setMessages(activeConv.messages);
    } else {
      setMessages([]);
    }
  }, [docActiveConversationId, activeConv?.id, activeConv?.messages, isGenerating]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [isResultsCollapsed, setIsResultsCollapsed] = useState(false);
  const [searchResults, setSearchResults] = useState(initialResults);
  const [activeViewMessageId, setActiveViewMessageId] = useState(null);

  // === 多维度状态管理 (Task 6.1) ===
  const [activeDimension, setActiveDimension] = useState('sales');
  const [dimensionResults, setDimensionResults] = useState({
    sales: initialMultiResults.sales,
    purchase: initialMultiResults.purchase,
    document: initialMultiResults.document,
  });
  const [dimensionFilters, setDimensionFilters] = useState({
    sales: { selectedDocTypes: ['__ALL__'], currentPage: 1, pageSize: 10, selectedItems: [], expandedItems: [] },
    purchase: { selectedDocTypes: ['__ALL__'], currentPage: 1, pageSize: 10, selectedItems: [], expandedItems: [] },
    document: { selectedDocTypes: ['__ALL__'], currentPage: 1, pageSize: 10, selectedItems: [], expandedItems: [] },
  });

  // 采购单详情抽屉状态
  const [purchaseDetailVisible, setPurchaseDetailVisible] = useState(false);
  const [purchaseDetailItem, setPurchaseDetailItem] = useState(null);

  // 单据预览弹窗状态
  const [docPreviewVisible, setDocPreviewVisible] = useState(false);
  const [docPreviewItem, setDocPreviewItem] = useState(null);

  // 维度筛选状态更新辅助函数
  const updateDimensionFilter = (dimension, updates) => {
    setDimensionFilters(prev => ({
      ...prev,
      [dimension]: { ...prev[dimension], ...updates },
    }));
  };
  
  // 提取当前维度的文件类型（分有权限和无权限）
  const getDimensionDocTypes = (dimension) => {
    const typesSet = new Set();
    if (dimension === 'document') {
      (dimensionResults.document.documents || []).forEach(doc => {
        if (doc.docCategory) typesSet.add(doc.docCategory);
      });
    } else {
      const orders = dimensionResults[dimension].orders || [];
      orders.forEach(item => {
        if (item.documents && item.documents.length > 0) {
          item.documents.forEach(doc => typesSet.add(doc.tag));
        }
      });
    }
    const all = Array.from(typesSet).sort();
    const dimAuthorized = authorizedDocumentTypes[dimension] || [];
    const authorized = all.filter(t => dimAuthorized.includes(t));
    const unauthorized = all.filter(t => !dimAuthorized.includes(t));
    return { allDocumentTypes: all, authorizedTypes: authorized, unauthorizedTypes: unauthorized };
  };

  // 当前维度的筛选状态
  const currentFilters = dimensionFilters[activeDimension];

  // 计算当前维度分页后的数据
  const getPaginatedData = (dimension) => {
    const filters = dimensionFilters[dimension];
    const start = (filters.currentPage - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    if (dimension === 'document') {
      return (dimensionResults.document.documents || []).slice(start, end);
    }
    return (dimensionResults[dimension].orders || []).slice(start, end);
  };

  // 当前页是否全选（维度感知）
  const isDimensionAllSelected = (dimension) => {
    const filters = dimensionFilters[dimension];
    const paginated = getPaginatedData(dimension);
    if (paginated.length === 0) return false;
    const idField = dimension === 'document' ? 'id' : (dimension === 'purchase' ? 'purchaseOrderNo' : 'orderNo');
    return paginated.every(item => filters.selectedItems.includes(item[idField]));
  };

  // 部分选中
  const isDimensionIndeterminate = (dimension) => {
    const filters = dimensionFilters[dimension];
    const paginated = getPaginatedData(dimension);
    const idField = dimension === 'document' ? 'id' : (dimension === 'purchase' ? 'purchaseOrderNo' : 'orderNo');
    const selectedInPage = paginated.filter(item => filters.selectedItems.includes(item[idField])).length;
    return selectedInPage > 0 && selectedInPage < paginated.length;
  };

  // 处理单个项目的选中/取消选中（维度感知）
  const handleDimensionItemSelect = (dimension, itemId, checked) => {
    updateDimensionFilter(dimension, {
      selectedItems: checked
        ? [...dimensionFilters[dimension].selectedItems, itemId]
        : dimensionFilters[dimension].selectedItems.filter(id => id !== itemId),
    });
  };

  // 处理全选/取消全选（维度感知）
  const handleDimensionSelectAll = (dimension, checked) => {
    const paginated = getPaginatedData(dimension);
    const idField = dimension === 'document' ? 'id' : (dimension === 'purchase' ? 'purchaseOrderNo' : 'orderNo');
    const currentPageIds = paginated.map(item => item[idField]);
    if (checked) {
      updateDimensionFilter(dimension, {
        selectedItems: [...new Set([...dimensionFilters[dimension].selectedItems, ...currentPageIds])],
      });
    } else {
      updateDimensionFilter(dimension, {
        selectedItems: dimensionFilters[dimension].selectedItems.filter(id => !currentPageIds.includes(id)),
      });
    }
  };

  // 处理批量下载（维度感知）
  const handleDimensionBatchDownload = (dimension) => {
    const filters = dimensionFilters[dimension];
    if (filters.selectedItems.length === 0) {
      message.warning('请先选择要下载的项目');
      return;
    }
    message.success(`开始下载 ${filters.selectedItems.length} 个项目的文件`);
  };

  // 展开/折叠（维度感知）
  const toggleDimensionExpand = (dimension, id) => {
    const filters = dimensionFilters[dimension];
    updateDimensionFilter(dimension, {
      expandedItems: filters.expandedItems.includes(id)
        ? filters.expandedItems.filter(item => item !== id)
        : [...filters.expandedItems, id],
    });
  };

  // 处理文件类型选择变化（维度感知）
  const handleDimensionDocTypeChange = (dimension, values) => {
    const ALL_VALUE = '__ALL__';
    const currentSelected = dimensionFilters[dimension].selectedDocTypes;

    let newSelected;
    if (values.includes(ALL_VALUE)) {
      if (!currentSelected.includes(ALL_VALUE)) {
        newSelected = [ALL_VALUE];
      } else if (values.length > 1) {
        newSelected = values.filter(val => val !== ALL_VALUE);
      } else {
        newSelected = [ALL_VALUE];
      }
    } else if (values.length === 0) {
      newSelected = [ALL_VALUE];
    } else {
      newSelected = values;
    }
    updateDimensionFilter(dimension, { selectedDocTypes: newSelected, currentPage: 1 });
  };

  // 根据选中的文件类型过滤文档（维度感知）
  const getFilteredDocuments = (documents, dimension) => {
    if (!documents || documents.length === 0) return [];
    const ALL_VALUE = '__ALL__';
    const selectedTypes = (dimension ? dimensionFilters[dimension] : dimensionFilters[activeDimension]).selectedDocTypes;
    if (selectedTypes.length === 0 || selectedTypes.includes(ALL_VALUE)) {
      return documents;
    }
    if (dimension === 'document') {
      return documents.filter(doc => selectedTypes.includes(doc.docCategory));
    }
    return documents.filter(doc => selectedTypes.includes(doc.tag));
  };

  /**
   * 切换右侧订单列表区域的展开/收起状态
   * @returns {void}
   */
  const toggleResultsPanel = () => {
    setIsResultsCollapsed((prev) => !prev);
  };

  /**
   * 单据检索发送消息：解析问题 → 思考过程 → 执行查询 → 展示结果 → 更新右侧面板
   */
  const handleDocSendMessage = () => {
    if (!inputValue.trim() || !docActiveConversationId) return;
    const question = inputValue.trim();
    setInputValue('');
    setIsGenerating(true);

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: question,
      time: formatDocDateTime(new Date()),
    };
    const base = [...messages, userMessage];
    setMessages(base);
    docUpdateConversation(docActiveConversationId, { title: question.substring(0, 20), messages: base });

    // 解析查询条件
    const parsed = parseQuery(question);

    const combinedId = `combined_${Date.now()}`;
    const intentDesc = parsed.queryType === 'aggregation'
      ? `用户希望进行统计分析：${parsed.description}`
      : parsed.conditions.length > 0
        ? `用户希望检索订单：${parsed.description}`
        : '用户希望进行销售单据检索';
    const intentData = { description: intentDesc, status: 'loading' };
    const steps = [
      { title: '理解问题', description: `识别查询意图：${parsed.description || '全量检索'}`, status: 'loading' },
      { title: '在销售单据中检索', description: '检索销售订单维度数据', status: 'loading' },
      { title: '在采购单据中检索', description: '检索采购单维度数据', status: 'loading' },
      { title: '在独立单据中检索', description: '检索独立单据维度数据', status: 'loading' },
    ];
    const combinedMessage = {
      id: combinedId,
      sender: 'ai',
      type: 'combined',
      intentData: { ...intentData, status: 'loading' },
      config: { source: '销售单据', scope: '全部', caliber: '管口数据', filter: '全部数据' },
      dataInfo: { time: '', metrics: [], dimensions: [] },
      steps: steps.map((s) => ({ ...s, status: 'loading' })),
      isComplete: false,
      isStopped: false,
      time: formatDocDateTime(new Date()),
    };
    const withCombined = [...base, combinedMessage];
    setMessages(withCombined);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === combinedId ? { ...m, intentData: { ...m.intentData, status: 'done' } } : m
        )
      );
    }, 600);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== combinedId) return m;
          const newSteps = [...m.steps];
          newSteps[0] = { ...newSteps[0], status: 'done' };
          return { ...m, steps: newSteps };
        })
      );
    }, 1000);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== combinedId) return m;
          const newSteps = [...m.steps];
          newSteps[1] = { ...newSteps[1], status: 'done' };
          return { ...m, steps: newSteps };
        })
      );
    }, 1400);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== combinedId) return m;
          const newSteps = [...m.steps];
          newSteps[2] = { ...newSteps[2], status: 'done' };
          return { ...m, steps: newSteps };
        })
      );
    }, 1800);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== combinedId) return m;
          const newSteps = [...m.steps];
          newSteps[3] = { ...newSteps[3], status: 'done' };
          return { ...m, steps: newSteps, isComplete: true };
        })
      );
    }, 2200);
    setTimeout(() => {
      const resultId = `result_${Date.now()}`;
      const resultMessage = {
        id: resultId,
        sender: 'ai',
        type: 'result',
        resultStatus: 'generating',
        originalQuestion: question,
        data: {},
        time: formatDocDateTime(new Date()),
        liked: false,
        disliked: false,
      };
      setMessages((prev) => [...prev, resultMessage]);
    }, 2600);
    setTimeout(() => {
      // 执行多维度检索作为主要检索
      const multiResult = executeMultiDimensionSearch(
        parsed, orderTable, documentTable, purchaseOrderTable, purchaseDocumentTable, standaloneDocumentTable
      );
      // Use sales dimension for backward compatibility with chat panel
      const salesResult = multiResult.sales;

      setMessages((prev) => {
        const next = prev.map((m) => {
          if (m.type !== 'result' || m.resultStatus !== 'generating') return m;
          return {
            ...m,
            resultStatus: 'completed',
            data: {
              summary: multiResult.overallSummary,
              orders: salesResult.orders,
              totalCount: salesResult.total,
              aggregation: salesResult.aggregation || null,
              orderColumns: salesResult.orderColumns || [],
              queryFocus: salesResult.queryFocus || null,
              multiDimensionResults: multiResult,
            },
          };
        });
        docUpdateConversation(docActiveConversationId, { messages: next });
        return next;
      });

      // 更新右侧面板
      setSearchResults({
        orders: salesResult.orders,
        total: salesResult.total,
        summary: salesResult.summary,
        usedFields: [],
        conditionDesc: '',
        aggregation: null,
        orderColumns: salesResult.orderColumns || [],
      });
      setDimensionResults({
        sales: multiResult.sales,
        purchase: multiResult.purchase,
        document: multiResult.document,
      });
      // 重置各维度筛选状态，如果有文件类型焦点则自动设置筛选
      const queryFocus = parsed.queryFocus;
      const hasDocFocus = Array.isArray(queryFocus) && queryFocus.length > 0;
      const autoFilter = hasDocFocus ? queryFocus : ['__ALL__'];
      setDimensionFilters({
        sales: { selectedDocTypes: autoFilter, currentPage: 1, pageSize: 10, selectedItems: [], expandedItems: [] },
        purchase: { selectedDocTypes: autoFilter, currentPage: 1, pageSize: 10, selectedItems: [], expandedItems: [] },
        document: { selectedDocTypes: autoFilter, currentPage: 1, pageSize: 10, selectedItems: [], expandedItems: [] },
      });
      // 默认激活第一个有结果的维度
      if (multiResult.sales.total > 0) {
        setActiveDimension('sales');
      } else if (multiResult.purchase.total > 0) {
        setActiveDimension('purchase');
      } else if (multiResult.document.total > 0) {
        setActiveDimension('document');
      } else {
        setActiveDimension('sales');
      }

      setIsGenerating(false);
    }, 3200);
  };

  const handleDocKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDocSendMessage();
    }
  };

  /** 根据文件类型或扩展名返回格式图标 */
  const getFileFormatIcon = (doc) => {
    const lower = (doc.name || '').toLowerCase();
    if (doc.type === 'pdf' || lower.endsWith('.pdf')) return <FilePdfOutlined className="doc-format-icon doc-format-pdf" />;
    if (/\.(docx|doc)$/.test(lower)) return <FileWordOutlined className="doc-format-icon doc-format-word" />;
    if (doc.type === 'image' || /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(lower)) return <FileImageOutlined className="doc-format-icon doc-format-image" />;
    return <FileOutlined className="doc-format-icon" />;
  };

  const renderDocumentItem = (doc) => (
    <div key={doc.id} className="document-item">
      <div className="document-info">
        {getFileFormatIcon(doc)}
        <span className="doc-name">{doc.name}</span>
      </div>
      <div className="document-actions">
        <Tag color={doc.tagColor} className={doc.tag ? `doc-tag doc-tag-${doc.tag}` : 'doc-tag'}>{doc.tag}</Tag>
        <Tooltip title="预览">
          <Button type="text" icon={<EyeOutlined />} />
        </Tooltip>
        <Tooltip title={doc.path}>
          <Button type="text" icon={<InfoCircleOutlined />} />
        </Tooltip>
        <Tooltip title="下载">
          <Button type="text" icon={<DownloadOutlined />} />
        </Tooltip>
      </div>
    </div>
  );

  /**
   * 详情数据：按图2的5组字段结构
   * 一.订单基础信息 | 二.发票相关信息 | 三.发货相关信息 | 四.付款相关信息 | 五.物料清单
   */
  const getDetailData = (item) => {
    return {
      groups: [
        {
          title: '订单基础信息',
          fields: [
            { label: '销售凭证', value: item.orderNo },
            { label: '凭证日期', value: item.poDate },
            { label: '售达方', value: item.soldTo },
            { label: '客户名称', value: item.customer },
            { label: '客户合同编号', value: item.customerContractNo },
            { label: '销售代表处描述', value: item.salesOfficeDesc },
            { label: '销售代表描述', value: item.salesRepDesc },
            { label: '销售地区描述', value: item.salesRegionDesc },
            { label: '订单不含税金额合计', value: item.amountExclTax },
            { label: '订单不含税金额(CNY)', value: item.amountExclTax },
            { label: '合同总金额(CNY)', value: item.totalAmountCNY },
            { label: '合同总金额', value: item.totalAmountOrder },
            { label: '货币', value: item.currency },
            { label: '分销渠道描述', value: item.channelDesc },
            { label: '控股方', value: item.holdingCompany },
            { label: '用户行业(披露口径)', value: item.industryCode },
            { label: '用户行业(披露口径)描述', value: item.industryDesc },
            { label: '税率', value: item.taxRate },
            { label: '报价单编号', value: item.quotationNo },
            { label: '付款条件备注', value: item.paymentTerms },
          ],
        },
        {
          title: '发票相关信息',
          isTable: true,
          tableType: 'invoice',
        },
        {
          title: '付款相关信息',
          isTable: true,
          tableType: 'payment',
          summaryFields: [
            { label: '欠款金额', value: item.outstandingAmount || '-' },
            { label: '合同欠款金额', value: item.contractDebt || '-' },
          ],
        },
      ],
      invoiceList: [
        { key: '1', vatInvoiceCode: 'VIC-' + item.orderNo + '-01', vatInvoiceNo: item.vatInvoiceNo || '-', vatInvoiceDate: item.vatInvoiceDate || '-', vatInvoiceRate: item.vatInvoiceRate || '-', vatInvoiceAmount: item.vatInvoiceAmount ? String(Math.round(Number(item.vatInvoiceAmount.replace(/,/g, '')) * 0.4)) + '.00' : '-' },
        { key: '2', vatInvoiceCode: 'VIC-' + item.orderNo + '-02', vatInvoiceNo: item.vatInvoiceNo ? item.vatInvoiceNo.replace(/1$/, '2') : '-', vatInvoiceDate: item.vatInvoiceDate ? item.vatInvoiceDate.replace(/\d{2}$/, '18') : '-', vatInvoiceRate: item.vatInvoiceRate || '-', vatInvoiceAmount: item.vatInvoiceAmount ? String(Math.round(Number(item.vatInvoiceAmount.replace(/,/g, '')) * 0.35)) + '.00' : '-' },
        { key: '3', vatInvoiceCode: 'VIC-' + item.orderNo + '-03', vatInvoiceNo: item.vatInvoiceNo ? item.vatInvoiceNo.replace(/1$/, '3') : '-', vatInvoiceDate: item.vatInvoiceDate ? item.vatInvoiceDate.replace(/\d{2}$/, '25') : '-', vatInvoiceRate: item.vatInvoiceRate || '-', vatInvoiceAmount: item.vatInvoiceAmount ? String(Math.round(Number(item.vatInvoiceAmount.replace(/,/g, '')) * 0.25)) + '.00' : '-' },
      ],
      paymentList: [
        { key: '1', companyCode: '1000', receiptNo: 'RC-' + item.orderNo + '-001', paymentDate: item.paymentDate || '-', paymentAmount: item.paymentAmount || '-', paymentCurrency: item.paymentCurrency || '-' },
        { key: '2', companyCode: '1000', receiptNo: 'RC-' + item.orderNo + '-002', paymentDate: item.paymentDate ? '2025-01-15' : '-', paymentAmount: item.paymentAmount ? String(Math.round(Number(item.paymentAmount.replace(/,/g, '')) * 0.3)) : '-', paymentCurrency: item.paymentCurrency || '-' },
      ],
      materialList: [
        { key: '1', productGroup: 'T01', productGroupDesc: '变压器', model: 'SCBH15-1250/10.5', spec: '1250.00', desc: '干变 SCBH15-1250/10.5 ZB.011786.5001', goodsIssueDate: '2020-12-28', profitCenter: '1617', profitCenterDesc: '干变事业部' },
        { key: '2', productGroup: 'T01', productGroupDesc: '变压器', model: 'SCBH15-1250/10.5', spec: '1250.00', desc: '干变 SCBH15-1250/10.5 ZB.011786.5002', goodsIssueDate: '2021-04-10', profitCenter: '1618', profitCenterDesc: '成套事业部' },
      ],
    };
  };

  const invoiceColumns = [
    { title: 'VAT发票代码', dataIndex: 'vatInvoiceCode', key: 'vatInvoiceCode', width: 150 },
    { title: 'VAT发票号', dataIndex: 'vatInvoiceNo', key: 'vatInvoiceNo', width: 180 },
    { title: 'VAT发票时间', dataIndex: 'vatInvoiceDate', key: 'vatInvoiceDate', width: 120 },
    { title: 'VAT发票税率', dataIndex: 'vatInvoiceRate', key: 'vatInvoiceRate', width: 100 },
    { title: 'VAT发票金额', dataIndex: 'vatInvoiceAmount', key: 'vatInvoiceAmount', width: 140 },
  ];

  const paymentColumns = [
    { title: '公司代码', dataIndex: 'companyCode', key: 'companyCode', width: 100 },
    { title: '会计凭证号', dataIndex: 'receiptNo', key: 'receiptNo', width: 180 },
    { title: '回款时间', dataIndex: 'paymentDate', key: 'paymentDate', width: 120 },
    { title: '回款金额', dataIndex: 'paymentAmount', key: 'paymentAmount', width: 140 },
    { title: '交易货币', dataIndex: 'paymentCurrency', key: 'paymentCurrency', width: 100 },
  ];

  const materialColumns = [
    { title: '产品组', dataIndex: 'productGroup', key: 'productGroup', width: 80 },
    { title: '产品组描述', dataIndex: 'productGroupDesc', key: 'productGroupDesc', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 160 },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 100 },
    { title: '物料描述', dataIndex: 'desc', key: 'desc' },
    { title: '发货过账日期', dataIndex: 'goodsIssueDate', key: 'goodsIssueDate', width: 120 },
    { title: '利润中心', dataIndex: 'profitCenter', key: 'profitCenter', width: 100 },
    { title: '利润中心描述', dataIndex: 'profitCenterDesc', key: 'profitCenterDesc', width: 120 },
  ];

  return (
    <div className="sales-search-page">
      {/* Left Panel：与智能问数一致的对话区（提问、思考过程、结果展示），无问数配置 */}
      <div className="search-chat-panel doc-chat-panel">
        <div className="chat-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="chat-area">
            {docActiveConversationId ? (
              <>
                <div className="messages-container">
                  {messages.length === 0 ? (
                    <div className="welcome-message">
                      <div className="welcome-text">向 AI 提问关于单据检索的任何问题</div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                      >
                        <div className="message-content">
                          {message.type === 'combined' ? (
                            <CombinedThinking
                              intentData={message.intentData || {}}
                              config={message.config || {}}
                              dataInfo={message.dataInfo || {}}
                              steps={message.steps || []}
                              isComplete={message.isComplete}
                              isStopped={message.isStopped || false}
                            />
                          ) : message.type === 'result' ? (
                            <>
                              {message.resultStatus && (
                                <div className="result-status-header">
                                  <div className="result-status-content">
                                    {message.resultStatus === 'generating' ? (
                                      <>
                                        <LoadingOutlined style={{ fontSize: 16, color: '#f59e0b', marginRight: 8 }} spin />
                                        <span className="result-status-text">结果输出中</span>
                                      </>
                                    ) : message.resultStatus === 'completed' ? (
                                      <>
                                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16, marginRight: 8 }} />
                                        <span className="result-status-text">输出完成</span>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                              {(() => {
                                const data = message.data || {};
                                const multiResults = data.multiDimensionResults;
                                const hasSummary = typeof data.summary === 'string' && data.summary.trim().length > 0;
                                const hasAggregation = data.aggregation && Array.isArray(data.aggregation.dataSource);

                                // 各维度数据
                                const salesOrders = multiResults?.sales?.orders || data.orders || [];
                                const salesTotal = multiResults?.sales?.total || data.totalCount || 0;
                                const purchaseOrders = multiResults?.purchase?.orders || [];
                                const purchaseTotal = multiResults?.purchase?.total || 0;
                                const documents = multiResults?.document?.documents || [];
                                const documentTotal = multiResults?.document?.total || 0;
                                const hasAnyResult = salesTotal > 0 || purchaseTotal > 0 || documentTotal > 0;
                                const hasContent = hasSummary || hasAnyResult || hasAggregation;

                                // 跳转到指定维度
                                const handleViewDimension = (dimension) => {
                                  setActiveViewMessageId(message.id);
                                  if (multiResults) {
                                    setDimensionResults({
                                      sales: multiResults.sales,
                                      purchase: multiResults.purchase,
                                      document: multiResults.document,
                                    });
                                  }
                                  setActiveDimension(dimension);
                                  updateDimensionFilter(dimension, {
                                    currentPage: 1, selectedItems: [], selectedDocTypes: ['__ALL__'], expandedItems: [],
                                  });
                                  if (isResultsCollapsed) setIsResultsCollapsed(false);
                                };

                                if (hasContent) {
                                  return (
                                    <div className="doc-search-result">
                                      {hasSummary && (
                                        <div className="doc-result-summary">{data.summary}</div>
                                      )}

                                      {hasAggregation && (
                                        <div className="result-block">
                                          <div className="block-header">
                                            <h4 className="block-title">统计结果</h4>
                                            <button className={`doc-view-orders-btn`} onClick={() => handleViewDimension('sales')}>
                                              <EyeOutlined style={{ marginRight: 4 }} />
                                              查看订单列表
                                            </button>
                                          </div>
                                          <div className="table-wrapper">
                                            <Table
                                              rowKey="key"
                                              columns={data.aggregation.columns}
                                              dataSource={data.aggregation.dataSource}
                                              pagination={data.aggregation.dataSource.length > 10 ? { pageSize: 10, showTotal: (total) => `共 ${total} 条`, showSizeChanger: false, size: 'small' } : false}
                                              size="middle" bordered className="custom-result-table"
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {!hasAggregation && hasAnyResult && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                          {/* 销售订单维度 */}
                                          {salesTotal > 0 && (
                                            <div className="result-block">
                                              <div className="block-header">
                                                <h4 className="block-title">销售订单（{salesTotal} 条）</h4>
                                                <button className="doc-view-orders-btn" onClick={() => handleViewDimension('sales')}>
                                                  <EyeOutlined style={{ marginRight: 4 }} />查看
                                                </button>
                                              </div>
                                              <div className="table-wrapper">
                                                <Table
                                                  rowKey="orderNo" size="middle" bordered className="custom-result-table"
                                                  columns={[
                                                    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 130 },
                                                    { title: '项目名称', dataIndex: 'title', key: 'title', ellipsis: true },
                                                    { title: '客户名称', dataIndex: 'customer', key: 'customer', ellipsis: true },
                                                  ]}
                                                  dataSource={salesOrders}
                                                  pagination={salesTotal > 20 ? { pageSize: 20, showTotal: (total) => `共 ${total} 条`, size: 'small', showSizeChanger: false } : false}
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {/* 采购单维度 */}
                                          {purchaseTotal > 0 && (
                                            <div className="result-block">
                                              <div className="block-header">
                                                <h4 className="block-title">采购单（{purchaseTotal} 条）</h4>
                                                <button className="doc-view-orders-btn" onClick={() => handleViewDimension('purchase')}>
                                                  <EyeOutlined style={{ marginRight: 4 }} />查看
                                                </button>
                                              </div>
                                              <div className="table-wrapper">
                                                <Table
                                                  rowKey="purchaseOrderNo" size="middle" bordered className="custom-result-table"
                                                  columns={[
                                                    { title: '采购单号', dataIndex: 'purchaseOrderNo', key: 'purchaseOrderNo', width: 140 },
                                                    { title: '供应商', dataIndex: 'supplier', key: 'supplier', ellipsis: true },
                                                    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
                                                  ]}
                                                  dataSource={purchaseOrders}
                                                  pagination={purchaseTotal > 20 ? { pageSize: 20, showTotal: (total) => `共 ${total} 条`, size: 'small', showSizeChanger: false } : false}
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {/* 凭证维度 */}
                                          {documentTotal > 0 && (
                                            <div className="result-block">
                                              <div className="block-header">
                                                <h4 className="block-title">凭证（{documentTotal} 份）</h4>
                                                <button className="doc-view-orders-btn" onClick={() => handleViewDimension('document')}>
                                                  <EyeOutlined style={{ marginRight: 4 }} />查看
                                                </button>
                                              </div>
                                              <div className="table-wrapper">
                                                <Table
                                                  rowKey="id" size="middle" bordered className="custom-result-table"
                                                  columns={[
                                                    { title: '文件名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
                                                    { title: '类型', dataIndex: 'docCategory', key: 'docCategory', width: 120 },
                                                    { title: '格式', dataIndex: 'fileFormat', key: 'fileFormat', width: 70, render: v => (v || '').toUpperCase() },
                                                  ]}
                                                  dataSource={documents}
                                                  pagination={documentTotal > 20 ? { pageSize: 20, showTotal: (total) => `共 ${total} 份`, size: 'small', showSizeChanger: false } : false}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {!hasAnyResult && !hasAggregation && (
                                        <div className="doc-result-empty">暂无匹配的订单</div>
                                      )}
                                    </div>
                                  );
                                }

                                if (message.resultStatus === 'stopped') {
                                  return (
                                    <div className="result-loading-placeholder">
                                      <span className="result-loading-text" style={{ color: '#999' }}>输出已停止</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="result-loading-placeholder">
                                    <div className="result-loading-spinner" />
                                    <span className="result-loading-text">正在生成结果...</span>
                                  </div>
                                );
                              })()}
                              {message.resultStatus === 'completed' && (
                                <div className="message-footer">
                                  <div className="footer-actions">
                                    <div className="footer-rating-btns">
                                      <button
                                        className={`footer-icon-btn rating-btn ${message.liked ? 'active' : ''}`}
                                        onClick={() =>
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === message.id ? { ...m, liked: !m.liked, disliked: false } : m
                                            )
                                          )
                                        }
                                        title="点赞"
                                      >
                                        <LikeOutlined style={{ fontSize: 16, color: message.liked ? '#1890ff' : undefined }} />
                                      </button>
                                      <button
                                        className={`footer-icon-btn rating-btn ${message.disliked ? 'active' : ''}`}
                                        onClick={() =>
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === message.id ? { ...m, disliked: !m.disliked, liked: false } : m
                                            )
                                          )
                                        }
                                        title="点踩"
                                      >
                                        <DislikeOutlined style={{ fontSize: 16, color: message.disliked ? '#ff4d4f' : undefined }} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="footer-time">{message.time}</div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p>{message.text}</p>
                          )}
                        </div>
                        {message.sender === 'user' && message.text && message.type !== 'result' && message.type !== 'combined' && (
                          <div className="message-time">{message.time}</div>
                        )}
                      </div>
                    ))
                  )}
                <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                  <div className="input-wrapper">
                    <textarea
                      className="message-input"
                      placeholder="向 AI 提问关于单据检索的任何问题"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleDocKeyPress}
                      rows={3}
                    />
                    <div className="input-actions">
                      {isGenerating ? (
                        <button className="send-button-round stop-button" type="button">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="6" width="12" height="12" rx="1" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="send-button-round"
                          onClick={handleDocSendMessage}
                          disabled={!inputValue.trim()}
                          type="button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M12 19V5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 12l7-7 7 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="chat-placeholder">
                <div className="placeholder-icon">💬</div>
                <div className="placeholder-text">请选择或创建对话开始单据检索</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 折叠/展开浮动按钮：位于左右面板交界处 */}
      <div
        className={`results-toggle-fab ${isResultsCollapsed ? 'collapsed' : ''}`}
        onClick={toggleResultsPanel}
      >
        {isResultsCollapsed ? <DoubleLeftOutlined /> : <DoubleRightOutlined />}
      </div>

      {/* Right Panel - Multi-dimension Tabs */}
      {!isResultsCollapsed && (
      <div className="search-results-panel">
        <Tabs
          activeKey={activeDimension}
          onChange={(key) => setActiveDimension(key)}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          items={[
            {
              key: 'sales',
              label: `销售订单 (${dimensionResults.sales.total || 0})`,
              children: (() => {
                const dimension = 'sales';
                const filters = dimensionFilters[dimension];
                const { authorizedTypes, unauthorizedTypes } = getDimensionDocTypes(dimension);
                const paginated = getPaginatedData(dimension);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="results-header">
                      <div className="results-header-left">
                        <Checkbox
                          checked={isDimensionAllSelected(dimension)}
                          indeterminate={isDimensionIndeterminate(dimension)}
                          onChange={(e) => handleDimensionSelectAll(dimension, e.target.checked)}
                        >
                          全选当前页
                        </Checkbox>
                        {filters.selectedItems.length > 0 && (
                          <span className="selected-count">已选 {filters.selectedItems.length} 个订单</span>
                        )}
                      </div>
                      <div className="results-header-right">
                        <Select
                          mode="multiple"
                          placeholder="文件类型"
                          value={filters.selectedDocTypes}
                          onChange={(values) => handleDimensionDocTypeChange(dimension, values)}
                          style={{ width: 200, marginRight: 12 }}
                          allowClear
                          maxTagCount="responsive"
                          popupClassName="document-type-select-dropdown"
                        >
                          <Option key="__ALL__" value="__ALL__">全部</Option>
                          {authorizedTypes.length > 0 && (
                            <OptGroup label={<span style={{color: "#52c41a", fontWeight: 500}}>有权限</span>} key="authorized">
                              {authorizedTypes.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                              ))}
                            </OptGroup>
                          )}
                          {unauthorizedTypes.length > 0 && (
                            <OptGroup label={<span style={{color: "#8c8c8c", fontWeight: 500}}>无权限</span>} key="unauthorized">
                              {unauthorizedTypes.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                              ))}
                            </OptGroup>
                          )}
                        </Select>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDimensionBatchDownload(dimension)}
                          disabled={filters.selectedItems.length === 0}
                        >
                          下载文件
                        </Button>
                        <Button
                          icon={<SyncOutlined />}
                          onClick={() => updateDimensionFilter(dimension, {
                            selectedDocTypes: ['__ALL__'], selectedItems: [], currentPage: 1,
                          })}
                        >
                          重置
                        </Button>
                      </div>
                    </div>
                    <div className="results-list">
                      <List
                        dataSource={paginated}
                        locale={{ emptyText: '暂无匹配的销售订单' }}
                        renderItem={item => (
                          <div className="result-item-card">
                            <div className="result-item-header">
                              <div className="result-item-title-group">
                                <Checkbox
                                  checked={filters.selectedItems.includes(item.orderNo)}
                                  onChange={(e) => handleDimensionItemSelect(dimension, item.orderNo, e.target.checked)}
                                />
                                {item.orderNo && (
                                  <span className="result-order-no">{item.orderNo}</span>
                                )}
                                <span className="result-item-title">{item.title}</span>
                              </div>
                              <div className="result-item-actions">
                                <Tooltip title="查看详情">
                                  <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => { setDetailItem(item); setDetailVisible(true); }}
                                  />
                                </Tooltip>
                                <Tooltip title="相关文件">
                                  <Button type="text" icon={filters.expandedItems.includes(item.orderNo) ? <UpOutlined /> : <DownOutlined />} onClick={() => toggleDimensionExpand(dimension, item.orderNo)} />
                                </Tooltip>
                              </div>
                            </div>
                            <div className="result-item-meta result-item-meta-tags">
                              <Tooltip title="客户名称">
                                <Tag className="meta-tag">{item.customer}</Tag>
                              </Tooltip>
                              <Tooltip title="采购订单日期">
                                <Tag className="meta-tag">{item.poDate}</Tag>
                              </Tooltip>
                              <Tooltip title="合同总金额 / 货币单位">
                                <Tag className="meta-tag">{item.amount} {item.currency}</Tag>
                              </Tooltip>
                            </div>
                            {filters.expandedItems.includes(item.orderNo) && (
                              <div className="result-item-details">
                                {getFilteredDocuments(item.documents, dimension).map(doc => renderDocumentItem(doc))}
                                {getFilteredDocuments(item.documents, dimension).length === 0 && item.documents && item.documents.length > 0 && (
                                  <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
                                    当前筛选条件下暂无文档
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className="results-pagination">
                      <Pagination
                        current={filters.currentPage}
                        total={dimensionResults.sales.total || 0}
                        pageSize={filters.pageSize}
                        showSizeChanger={true}
                        pageSizeOptions={['10', '20', '50', '100']}
                        showTotal={(total) => `共 ${total} 条`}
                        locale={{ items_per_page: '条/页' }}
                        onChange={(page) => updateDimensionFilter(dimension, { currentPage: page })}
                        onShowSizeChange={(current, size) => updateDimensionFilter(dimension, { pageSize: size, currentPage: 1 })}
                      />
                    </div>
                  </div>
                );
              })(),
            },
            {
              key: 'purchase',
              label: `采购单 (${dimensionResults.purchase.total || 0})`,
              children: (() => {
                const dimension = 'purchase';
                const filters = dimensionFilters[dimension];
                const { authorizedTypes, unauthorizedTypes } = getDimensionDocTypes(dimension);
                const paginated = getPaginatedData(dimension);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="results-header">
                      <div className="results-header-left">
                        <Checkbox
                          checked={isDimensionAllSelected(dimension)}
                          indeterminate={isDimensionIndeterminate(dimension)}
                          onChange={(e) => handleDimensionSelectAll(dimension, e.target.checked)}
                        >
                          全选当前页
                        </Checkbox>
                        {filters.selectedItems.length > 0 && (
                          <span className="selected-count">已选 {filters.selectedItems.length} 个采购单</span>
                        )}
                      </div>
                      <div className="results-header-right">
                        <Select
                          mode="multiple"
                          placeholder="文件类型"
                          value={filters.selectedDocTypes}
                          onChange={(values) => handleDimensionDocTypeChange(dimension, values)}
                          style={{ width: 200, marginRight: 12 }}
                          allowClear
                          maxTagCount="responsive"
                          popupClassName="document-type-select-dropdown"
                        >
                          <Option key="__ALL__" value="__ALL__">全部</Option>
                          {authorizedTypes.length > 0 && (
                            <OptGroup label={<span style={{color: "#52c41a", fontWeight: 500}}>有权限</span>} key="authorized">
                              {authorizedTypes.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                              ))}
                            </OptGroup>
                          )}
                          {unauthorizedTypes.length > 0 && (
                            <OptGroup label={<span style={{color: "#8c8c8c", fontWeight: 500}}>无权限</span>} key="unauthorized">
                              {unauthorizedTypes.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                              ))}
                            </OptGroup>
                          )}
                        </Select>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDimensionBatchDownload(dimension)}
                          disabled={filters.selectedItems.length === 0}
                        >
                          下载文件
                        </Button>
                        <Button
                          icon={<SyncOutlined />}
                          onClick={() => updateDimensionFilter(dimension, {
                            selectedDocTypes: ['__ALL__'], selectedItems: [], currentPage: 1,
                          })}
                        >
                          重置
                        </Button>
                      </div>
                    </div>
                    <div className="results-list">
                      <List
                        dataSource={paginated}
                        locale={{ emptyText: '暂无匹配的采购单' }}
                        renderItem={item => (
                          <div className="result-item-card">
                            <div className="result-item-header">
                              <div className="result-item-title-group">
                                <Checkbox
                                  checked={filters.selectedItems.includes(item.purchaseOrderNo)}
                                  onChange={(e) => handleDimensionItemSelect(dimension, item.purchaseOrderNo, e.target.checked)}
                                />
                                {item.purchaseOrderNo && (
                                  <span className="result-order-no">{item.purchaseOrderNo}</span>
                                )}
                                <span className="result-item-title">{item.description}</span>
                              </div>
                              <div className="result-item-actions">
                                <Tooltip title="查看详情">
                                  <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => { setPurchaseDetailItem(item); setPurchaseDetailVisible(true); }}
                                  />
                                </Tooltip>
                                <Tooltip title="相关文件">
                                  <Button type="text" icon={filters.expandedItems.includes(item.purchaseOrderNo) ? <UpOutlined /> : <DownOutlined />} onClick={() => toggleDimensionExpand(dimension, item.purchaseOrderNo)} />
                                </Tooltip>
                              </div>
                            </div>
                            <div className="result-item-meta result-item-meta-tags">
                              <Tooltip title="供应商名称">
                                <Tag className="meta-tag">{item.supplier}</Tag>
                              </Tooltip>
                              <Tooltip title="采购日期">
                                <Tag className="meta-tag">{item.purchaseDate}</Tag>
                              </Tooltip>
                              <Tooltip title="采购金额 / 币种">
                                <Tag className="meta-tag">{item.purchaseAmount} {item.currency}</Tag>
                              </Tooltip>
                            </div>
                            {filters.expandedItems.includes(item.purchaseOrderNo) && (
                              <div className="result-item-details">
                                {getFilteredDocuments(item.documents, dimension).map(doc => renderDocumentItem(doc))}
                                {getFilteredDocuments(item.documents, dimension).length === 0 && item.documents && item.documents.length > 0 && (
                                  <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
                                    当前筛选条件下暂无文档
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className="results-pagination">
                      <Pagination
                        current={filters.currentPage}
                        total={dimensionResults.purchase.total || 0}
                        pageSize={filters.pageSize}
                        showSizeChanger={true}
                        pageSizeOptions={['10', '20', '50', '100']}
                        showTotal={(total) => `共 ${total} 条`}
                        locale={{ items_per_page: '条/页' }}
                        onChange={(page) => updateDimensionFilter(dimension, { currentPage: page })}
                        onShowSizeChange={(current, size) => updateDimensionFilter(dimension, { pageSize: size, currentPage: 1 })}
                      />
                    </div>
                  </div>
                );
              })(),
            },
            {
              key: 'document',
              label: `凭证 (${dimensionResults.document.total || 0})`,
              children: (() => {
                const dimension = 'document';
                const filters = dimensionFilters[dimension];
                const { authorizedTypes, unauthorizedTypes } = getDimensionDocTypes(dimension);
                const allDocs = dimensionResults.document.documents || [];
                const filteredDocs = getFilteredDocuments(allDocs, dimension);
                const start = (filters.currentPage - 1) * filters.pageSize;
                const end = start + filters.pageSize;
                const paginated = filteredDocs.slice(start, end);

                // Determine if single type is selected for structured field display
                const isSingleType = filters.selectedDocTypes.length === 1 && filters.selectedDocTypes[0] !== '__ALL__';
                const singleType = isSingleType ? filters.selectedDocTypes[0] : null;
                const structuredFieldsMeta = singleType && docCategoryMeta[singleType] ? docCategoryMeta[singleType].fields : [];

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="results-header">
                      <div className="results-header-left">
                        <Checkbox
                          checked={isDimensionAllSelected(dimension)}
                          indeterminate={isDimensionIndeterminate(dimension)}
                          onChange={(e) => handleDimensionSelectAll(dimension, e.target.checked)}
                        >
                          全选当前页
                        </Checkbox>
                        {filters.selectedItems.length > 0 && (
                          <span className="selected-count">已选 {filters.selectedItems.length} 份单据</span>
                        )}
                      </div>
                      <div className="results-header-right">
                        <Select
                          mode="multiple"
                          placeholder="单据类型"
                          value={filters.selectedDocTypes}
                          onChange={(values) => handleDimensionDocTypeChange(dimension, values)}
                          style={{ width: 200, marginRight: 12 }}
                          allowClear
                          maxTagCount="responsive"
                          popupClassName="document-type-select-dropdown"
                        >
                          <Option key="__ALL__" value="__ALL__">全部</Option>
                          {authorizedTypes.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                          ))}
                          {unauthorizedTypes.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                          ))}
                        </Select>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDimensionBatchDownload(dimension)}
                          disabled={filters.selectedItems.length === 0}
                        >
                          下载文件
                        </Button>
                        <Button
                          icon={<SyncOutlined />}
                          onClick={() => updateDimensionFilter(dimension, {
                            selectedDocTypes: ['__ALL__'], selectedItems: [], currentPage: 1,
                          })}
                        >
                          重置
                        </Button>
                      </div>
                    </div>
                    <div className="results-list">
                      <List
                        dataSource={paginated}
                        locale={{ emptyText: '暂无匹配的单据' }}
                        renderItem={doc => {
                          const formatIcon = doc.fileFormat === 'pdf' ? <FilePdfOutlined className="doc-format-icon doc-format-pdf" />
                            : doc.fileFormat === 'docx' || doc.fileFormat === 'doc' ? <FileWordOutlined className="doc-format-icon doc-format-word" />
                            : doc.fileFormat === 'jpg' || doc.fileFormat === 'png' || doc.fileFormat === 'jpeg' ? <FileImageOutlined className="doc-format-icon doc-format-image" />
                            : doc.fileFormat === 'xlsx' || doc.fileFormat === 'xls' ? <FileExcelOutlined className="doc-format-icon" style={{ color: '#52c41a' }} />
                            : <FileOutlined className="doc-format-icon" />;

                          const categoryMeta = docCategoryMeta[doc.docCategory];
                          const DOC_CATEGORY_COLORS = {
                            '诉讼文件': '#f5222d', '报价单': '#fa541c', '综合财务分析指标': '#fa8c16',
                            '财务报表主表（盖章）': '#faad14', '年度审计报告': '#a0d911', 'IT审计报告': '#52c41a',
                            '验资报告': '#13c2c2', '政府补助文件/政府项目专项审计报告': '#1890ff',
                            '信用评级': '#2f54eb', '资产评估报告': '#722ed1', '纳税申报表': '#eb2f96',
                            '完税凭证': '#f759ab', '纳税信用等级证明': '#597ef7', '无欠税证明': '#36cfc9',
                            '研发加计扣除报告': '#9254de', '同期资料鉴定报告': '#ff7a45', '高新审计报告': '#73d13d',
                            '担保协议': '#ff4d4f', '授信协议': '#40a9ff', '借款协议': '#ffc53d',
                            '凭证入账支持文件': '#bae637', '银行回单': '#389e0d', '承兑汇票收付回单': '#d48806',
                            '报销发票': '#c41d7f', '应付账款函证相关单据-对账单': '#531dab',
                            '应付账款函证相关单据-应收询证函': '#08979c', '采购框架协议、质量协议': '#cf1322',
                          };
                          const categoryColor = DOC_CATEGORY_COLORS[doc.docCategory] || '#8c8c8c';

                          return (
                            <div className="result-item-card">
                              <div className="result-item-header">
                                <div className="result-item-title-group">
                                  <Checkbox
                                    checked={filters.selectedItems.includes(doc.id)}
                                    onChange={(e) => handleDimensionItemSelect(dimension, doc.id, e.target.checked)}
                                  />
                                  {formatIcon}
                                  <span className="result-item-title">{doc.fileName}</span>
                                </div>
                                <div className="result-item-actions">
                                  <Tag color={categoryColor}>{doc.docCategory}</Tag>
                                  <Tooltip title="预览">
                                    <Button
                                      type="text"
                                      icon={<EyeOutlined />}
                                      onClick={() => { setDocPreviewItem(doc); setDocPreviewVisible(true); }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                              {/* Structured fields display - always show based on docCategory */}
                              {doc.structuredFields && docCategoryMeta[doc.docCategory] ? (
                                <div className="result-item-meta" style={{ marginTop: 8 }}>
                                  {docCategoryMeta[doc.docCategory].fields.map(field => (
                                    <div className="meta-col" key={field.key}>
                                      <span className="meta-field">{field.label}:</span>
                                      <span className="meta-value">{doc.structuredFields[field.key] || '-'}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="result-item-meta result-item-meta-tags" style={{ marginTop: 8 }}>
                                  <Tooltip title="单据类型">
                                    <Tag color={categoryColor} className="meta-tag">{doc.docCategory}</Tag>
                                  </Tooltip>
                                  <Tooltip title="文件格式">
                                    <Tag className="meta-tag">{doc.fileFormat.toUpperCase()}</Tag>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>
                    <div className="results-pagination">
                      <Pagination
                        current={filters.currentPage}
                        total={filteredDocs.length}
                        pageSize={filters.pageSize}
                        showSizeChanger={true}
                        pageSizeOptions={['10', '20', '50', '100']}
                        showTotal={(total) => `共 ${total} 份`}
                        locale={{ items_per_page: '条/页' }}
                        onChange={(page) => updateDimensionFilter(dimension, { currentPage: page })}
                        onShowSizeChange={(current, size) => updateDimensionFilter(dimension, { pageSize: size, currentPage: 1 })}
                      />
                    </div>
                  </div>
                );
              })(),
            },
          ]}
        />
      </div>
      )}
      {/* 详情抽屉：右侧滑出 */}
      <Drawer
        open={detailVisible}
        title={detailItem ? detailItem.title : '详情'}
        width="70%"
        placement="right"
        onClose={() => setDetailVisible(false)}
        bodyStyle={{ padding: 0, overflowY: 'auto', background: '#f7f8fa' }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}
        className="detail-drawer"
      >
        {detailItem && (
          <div className="detail-modal detail-drawer-content">
            {getDetailData(detailItem).groups.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                {gIdx === 2 && (
                  <div className="detail-block">
                    <div className="detail-block-title">发货相关信息</div>
                    <div className="detail-block-content detail-material-table">
                      <Table
                        columns={materialColumns}
                        dataSource={getDetailData(detailItem).materialList}
                        pagination={false}
                        size="small"
                        scroll={{ x: true }}
                      />
                    </div>
                  </div>
                )}
                <div className="detail-block">
                  <div className="detail-block-title">{group.title}</div>
                  {group.isTable ? (
                    <div className="detail-block-content detail-material-table">
                      {group.summaryFields && (
                        <div className="detail-block-content" style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 0 }}>
                          {group.summaryFields.map((f, idx) => (
                            <div className="detail-field-item" key={idx}>
                              <span className="detail-field-label">{f.label}</span>
                              <span className="detail-field-value">{f.value || '-'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <Table
                        columns={group.tableType === 'invoice' ? invoiceColumns : paymentColumns}
                        dataSource={group.tableType === 'invoice' ? getDetailData(detailItem).invoiceList : getDetailData(detailItem).paymentList}
                        pagination={false}
                        size="small"
                        scroll={{ x: true }}
                      />
                    </div>
                  ) : (
                    <div className="detail-block-content">
                      {group.fields.map((f, idx) => (
                        <div className="detail-field-item" key={idx}>
                          <span className="detail-field-label">{f.label}</span>
                          <span className="detail-field-value">{f.value || '-'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
            <div className="detail-block">
              <div className="detail-block-title">关联单号</div>
              <div className="detail-block-content" style={{ display: 'block', padding: '16px' }}>
                <OrderRelationsPanel orderNo={detailItem.orderNo} />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 采购单详情抽屉 (Task 6.4) */}
      <Drawer
        open={purchaseDetailVisible}
        title={purchaseDetailItem ? `采购单详情 - ${purchaseDetailItem.purchaseOrderNo}` : '采购单详情'}
        width="60%"
        placement="right"
        onClose={() => setPurchaseDetailVisible(false)}
        bodyStyle={{ padding: 0, overflowY: 'auto', background: '#f7f8fa' }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}
        className="detail-drawer"
      >
        {purchaseDetailItem && (
          <div className="detail-modal detail-drawer-content">
            <div className="detail-block">
              <div className="detail-block-title">采购订单基础信息</div>
              <div className="detail-block-content">
                <div className="detail-field-item">
                  <span className="detail-field-label">采购订单号</span>
                  <span className="detail-field-value">{purchaseDetailItem.purchaseOrderNo}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">供应商名称</span>
                  <span className="detail-field-value">{purchaseDetailItem.supplier}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">采购日期</span>
                  <span className="detail-field-value">{purchaseDetailItem.purchaseDate}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">采购金额</span>
                  <span className="detail-field-value">{purchaseDetailItem.purchaseAmount} {purchaseDetailItem.currency}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">采购类型</span>
                  <span className="detail-field-value">{purchaseDetailItem.purchaseType}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">关联销售订单</span>
                  <span className="detail-field-value">{purchaseDetailItem.relatedSalesOrder || '-'}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">状态</span>
                  <span className="detail-field-value">{purchaseDetailItem.status}</span>
                </div>
                <div className="detail-field-item">
                  <span className="detail-field-label">描述</span>
                  <span className="detail-field-value">{purchaseDetailItem.description}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </Drawer>

      {/* 单据预览弹窗 */}
      <Modal
        open={docPreviewVisible}
        title={docPreviewItem ? docPreviewItem.fileName : '单据预览'}
        width="70%"
        footer={null}
        onCancel={() => setDocPreviewVisible(false)}
        bodyStyle={{ padding: 0, height: '75vh', overflow: 'hidden' }}
        centered
      >
        {docPreviewItem && (() => {
          const fmt = (docPreviewItem.fileFormat || '').toLowerCase();
          const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fmt);
          const isPdf = fmt === 'pdf';

          if (isImage) {
            return (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                <div style={{ textAlign: 'center' }}>
                  <FileImageOutlined style={{ fontSize: 80, color: '#722ed1', marginBottom: 16 }} />
                  <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>{docPreviewItem.fileName}</div>
                  <div style={{ color: '#999', fontSize: 13 }}>图片预览（示例）</div>
                </div>
              </div>
            );
          }

          if (isPdf) {
            return (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#525659' }}>
                <div style={{ padding: '8px 16px', background: '#3b3b3b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontSize: 13 }}>{docPreviewItem.fileName}</span>
                  <span style={{ color: '#aaa', fontSize: 12 }}>1 / 1</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '60%', maxWidth: 500, background: '#fff', borderRadius: 4, padding: '40px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)', minHeight: 400, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ borderBottom: '2px solid #1890ff', paddingBottom: 8, marginBottom: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{docPreviewItem.docCategory}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{docPreviewItem.fileName}</div>
                    </div>
                    {docPreviewItem.structuredFields && docCategoryMeta[docPreviewItem.docCategory] ? (
                      docCategoryMeta[docPreviewItem.docCategory].fields.map(field => (
                        <div key={field.key} style={{ display: 'flex', fontSize: 13, lineHeight: '24px' }}>
                          <span style={{ color: '#666', minWidth: 120, flexShrink: 0 }}>{field.label}：</span>
                          <span style={{ color: '#333' }}>{docPreviewItem.structuredFields[field.key] || '-'}</span>
                        </div>
                      ))
                    ) : null}
                    <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #eee', textAlign: 'center', color: '#bbb', fontSize: 11 }}>
                      本文件为模拟预览 · 实际环境将展示真实PDF内容
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // 其他格式
          return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              <div style={{ textAlign: 'center' }}>
                <FileOutlined style={{ fontSize: 80, color: '#999', marginBottom: 16 }} />
                <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>{docPreviewItem.fileName}</div>
                <div style={{ color: '#999', fontSize: 13 }}>{fmt.toUpperCase()} 文件预览（示例）</div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default SalesDocumentSearch;
