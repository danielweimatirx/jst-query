# 实现计划：单据检索多维度扩展

## 概述

将现有单据检索模块从单一"销售订单"维度扩展为三个维度（销售订单、采购单、单据本身），涉及数据模型新增、检索服务扩展、UI 重构和对话区联动。实现语言为 JavaScript（React + Ant Design）。

## 任务

- [x] 1. 新增采购单和独立单据数据模型
  - [x] 1.1 创建采购订单主表数据文件 `src/data/purchaseOrderTable.js`
    - 定义采购订单数组，包含 purchaseOrderNo、supplier、purchaseDate、purchaseAmount、currency、purchaseType、relatedSalesOrder、status、description 字段
    - 提供至少 10 条 mock 数据，purchaseOrderNo 唯一
    - _需求: 1.1, 1.4_
  - [x] 1.2 创建采购单据关联表数据文件 `src/data/purchaseDocumentTable.js`
    - 定义采购单据数组，包含 id、purchaseOrderNo、type、name、tag、tagColor、path 字段
    - 通过 purchaseOrderNo 与采购订单主表建立一对多关联
    - _需求: 1.2, 1.3_
  - [x] 1.3 创建独立单据表数据文件 `src/data/standaloneDocumentTable.js`
    - 定义独立单据数组，包含 id、fileName、docCategory、fileFormat、structuredFields 字段
    - 同一 docCategory 的记录 structuredFields 拥有相同的 key 集合
    - 提供合同、发票、技术协议、质保书等多种类型的 mock 数据
    - _需求: 2.1, 2.2, 2.3, 2.4_
  - [x] 1.4 创建单据类型元数据配置文件 `src/data/docCategoryMeta.js`
    - 为每种 docCategory 定义 fields 数组（key、label、type）
    - _需求: 2.5_
  - [ ]* 1.5 编写数据模型属性测试
    - **Property 1: 采购单据数据完整性** — 验证 purchaseDocumentTable 中每条记录字段非空且 purchaseOrderNo 在主表中存在
    - **Validates: Requirements 1.2, 1.3**
    - **Property 2: 采购订单号唯一性** — 验证 purchaseOrderTable 中 purchaseOrderNo 唯一
    - **Validates: Requirements 1.4**
    - **Property 3: 独立单据数据完整性** — 验证 standaloneDocumentTable 中字段非空且 docCategory 在 docCategoryMeta 中有定义
    - **Validates: Requirements 2.2, 2.5**
    - **Property 4: 同类型结构化字段一致性** — 验证同一 docCategory 的记录 structuredFields key 集合相同
    - **Validates: Requirements 2.3**

- [x] 2. 扩展销售订单维度单据类型
  - [x] 2.1 在 `src/data/documentTable.js` 中补充新单据类型文件记录
    - 为现有订单补充技术协议（tagColor: '#2db7f5'）、出厂试验报告（tagColor: '#87d068'）、质量异议处理单（tagColor: '#f50'）、质保书（tagColor: '#108ee9'）类型的文件
    - _需求: 6.1, 6.3_
  - [x] 2.2 在 `src/utils/queryParser.js` 的 `KNOWN_DOC_TAGS` 中添加新单据类型关键词
    - 添加 '技术协议'、'出厂试验报告'、'质量异议处理单'、'质保书' 到 KNOWN_DOC_TAGS 数组
    - 在 FIELD_MAP 中补充采购单相关字段映射（供应商→supplier、采购日期→purchaseDate 等）
    - _需求: 6.2, 6.4_
  - [ ]* 2.3 编写标签颜色唯一性属性测试
    - **Property 9: 标签颜色唯一性** — 验证 documentTable 中不同 tag 对应不同 tagColor
    - **Validates: Requirements 6.3**

- [x] 3. 检查点 - 确保数据模型和解析器正确
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 4. 扩展检索服务支持多维度
  - [x] 4.1 在 `src/utils/searchService.js` 中新增 `executeMultiDimensionSearch` 函数
    - 接收 parseResult 和所有数据表作为参数
    - 销售订单维度复用现有 executeSearch 逻辑
    - 采购单维度以 purchaseOrderTable 为主表执行类似检索
    - 单据本身维度在 standaloneDocumentTable 中按条件过滤
    - 返回 MultiDimensionResult 结构（sales、purchase、document、overallSummary）
    - _需求: 3.1, 3.2, 3.3, 3.5_
  - [x] 4.2 实现综合摘要生成逻辑
    - overallSummary 包含各维度命中数量（如"销售订单 X 条，采购单 Y 条，单据 Z 份"）
    - 某维度无结果时在摘要中体现
    - _需求: 3.5, 9.1_
  - [x] 4.3 处理空结果和异常场景
    - 某维度数据源为空时返回 `{ orders/documents: [], total: 0, summary: '暂无数据' }`
    - 无条件时三个维度均返回全量数据
    - _需求: 3.4_
  - [ ]* 4.4 编写查询解析和多维度检索属性测试
    - **Property 5: 查询解析有效性** — 验证任意非空字符串输入 parseQuery 返回有效 ParseResult
    - **Validates: Requirements 3.1**
    - **Property 6: 多维度检索结果完整性** — 验证 executeMultiDimensionSearch 返回包含 sales、purchase、document 三个键且 total 为非负整数
    - **Validates: Requirements 3.2, 3.3**
    - **Property 7: 综合摘要包含各维度数量** — 验证 overallSummary 包含三个维度的命中数量数值
    - **Validates: Requirements 3.5, 9.1**

- [x] 5. 检查点 - 确保检索服务正确
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 6. 重构右侧结果面板为多维度 Tabs
  - [x] 6.1 在 `SalesDocumentSearch.js` 中引入多维度状态管理
    - 新增 activeDimension、dimensionResults、dimensionFilters 状态
    - 每个维度独立管理 selectedDocTypes、currentPage、pageSize、selectedItems、expandedItems
    - _需求: 4.1, 5.4, 10.4_
  - [x] 6.2 使用 Ant Design Tabs 组件重构右侧面板
    - 三个 TabPane：销售订单、采购单、单据
    - 每个 Tab 标签显示该维度命中数量
    - 默认激活第一个有命中结果的 Tab
    - _需求: 4.1, 4.2, 4.3, 4.4_
  - [x] 6.3 实现销售订单维度 Tab 内容
    - 保持现有卡片式展示样式（订单号、项目名称、客户名称、关联文件列表）
    - 独立的单据类型筛选器、分页和批量操作
    - _需求: 4.5, 5.1, 5.2, 5.3, 10.1, 10.2, 10.3_
  - [x] 6.4 实现采购单维度 Tab 内容
    - 卡片式展示（采购订单号、供应商名称、采购日期、关联文件列表）
    - 独立的单据类型筛选器、分页和批量操作
    - 点击详情按钮打开采购单详情抽屉（基础信息 + 关联文件列表）
    - _需求: 4.6, 5.1, 5.2, 7.1, 7.2, 7.3, 10.1, 10.2, 10.3_
  - [x] 6.5 实现单据本身维度 Tab 内容
    - 以文件名为主要展示字段，展示单据类型标签和结构化字段值
    - 筛选到单一类型时展示该类型全部结构化字段，选择"全部"时仅展示通用字段
    - 结构化字段展示顺序与 docCategoryMeta 配置一致
    - 独立的单据类型筛选器、分页和批量操作
    - _需求: 4.7, 5.1, 5.2, 8.1, 8.2, 8.3, 8.4, 10.1, 10.2, 10.3_
  - [ ]* 6.6 编写文档类型过滤属性测试
    - **Property 8: 文档类型过滤正确性** — 验证过滤后结果中每个文档 tag 属于选中类型集合，且无遗漏
    - **Validates: Requirements 5.2, 5.5**

- [x] 7. 检查点 - 确保右侧面板多维度展示正确
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 8. 更新对话区多维度展示和联动
  - [x] 8.1 修改 `handleDocSendMessage` 调用 `executeMultiDimensionSearch`
    - 替换原有 executeSearch 调用为 executeMultiDimensionSearch
    - 导入新增的数据表
    - 将返回的 MultiDimensionResult 更新到 dimensionResults 状态
    - _需求: 3.2, 3.3_
  - [x] 8.2 扩展思考过程步骤为 4 步
    - 理解问题 → 在销售单据中检索 → 在采购单据中检索 → 在独立单据中检索
    - _需求: 9.3_
  - [x] 8.3 更新结果消息摘要展示各维度命中数量
    - 使用 overallSummary 替换原有 summary
    - 点击"查看订单列表"按钮切换右侧面板到对应维度并展开
    - _需求: 9.1, 9.2_

- [x] 9. 最终检查点 - 确保所有功能正确
  - 确保所有测试通过，如有疑问请向用户确认。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 进度
- 每个任务引用了具体的需求编号以确保可追溯性
- 检查点确保增量验证
- 属性测试使用 `fast-check` 库验证正确性属性
- 单元测试验证具体示例和边界情况
