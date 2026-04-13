# 需求文档：单据检索多维度扩展

## 简介

当前单据检索模块仅支持"销售订单"维度，以销售订单为主表关联文件进行检索和展示。本次需求扩展为三个维度：销售订单维度、采购单维度、单据本身维度。用户在同一个检索对话框中输入问题，系统同时在三个维度中检索，右侧结果列表按维度分组展示命中结果。每个维度均支持独立的单据类型筛选。

## 术语表

- **Search_System**：单据检索系统，负责接收用户查询、解析意图、执行多维度检索并展示结果
- **Sales_Dimension**：销售订单维度，以销售订单（orderNo）为主表，关联该订单下的所有文件
- **Purchase_Dimension**：采购单维度，以采购订单（purchaseOrderNo）为主表，关联该采购单下的所有文件
- **Document_Dimension**：单据本身维度，以单据文件本身为主体，不关联任何订单，以文件名为主要字段，关联该类单据特有的结构化字段
- **Dimension_Tab**：维度标签页，右侧结果面板中用于切换不同维度结果的 Tab 组件
- **Document_Type_Filter**：单据类型筛选器，每个维度独立的文件类型下拉筛选组件
- **Structured_Fields**：结构化字段，单据本身维度中每类单据关联的特定元数据字段（不同类型单据的结构化字段不同）
- **Query_Parser**：查询解析器，将用户自然语言问题解析为结构化查询条件的模块
- **Search_Service**：检索服务，根据解析后的查询条件在各维度数据源中执行检索的模块

## 需求

### 需求 1：采购单维度数据模型

**用户故事：** 作为系统用户，我希望系统支持采购单维度的数据存储，以便能够按采购订单检索关联的单据文件。

#### 验收标准

1. THE Search_System SHALL 提供采购订单主表数据（purchaseOrderTable），包含采购订单号、供应商名称、采购日期、采购金额、币种等基础字段
2. THE Search_System SHALL 提供采购单据关联表数据（purchaseDocumentTable），通过 purchaseOrderNo 与采购订单主表建立一对多关联
3. THE Search_System SHALL 确保采购单据关联表中每条记录包含文件 ID、采购订单号、文件类型、文件名称、文件标签（tag）、文件路径等字段
4. WHEN 采购订单主表数据加载完成时, THE Search_System SHALL 确保每条采购订单记录的 purchaseOrderNo 字段值唯一

### 需求 2：单据本身维度数据模型

**用户故事：** 作为系统用户，我希望系统支持以单据本身为主体的数据存储，以便能够脱离订单维度直接按文件检索单据。

#### 验收标准

1. THE Search_System SHALL 提供独立单据表数据（standaloneDocumentTable），以文件名为主要字段，不关联任何订单
2. THE Search_System SHALL 确保独立单据表中每条记录包含文件 ID、文件名称、单据类型（docCategory）、文件格式等通用字段
3. WHEN 独立单据表中的记录属于同一单据类型时, THE Search_System SHALL 为该类型的所有记录提供相同的结构化字段集合
4. WHEN 独立单据表中的记录属于不同单据类型时, THE Search_System SHALL 允许不同类型拥有各自独立的结构化字段集合
5. THE Search_System SHALL 为每种单据类型定义其结构化字段的元数据配置（字段名、字段标签、字段类型）

### 需求 3：统一检索入口

**用户故事：** 作为系统用户，我希望在同一个检索对话框中输入问题后，系统能同时在销售订单、采购单、单据本身三个维度中检索，以便一次提问获得全面的检索结果。

#### 验收标准

1. WHEN 用户在检索对话框中提交查询时, THE Query_Parser SHALL 解析查询条件并生成适用于三个维度的结构化查询参数
2. WHEN 查询条件解析完成时, THE Search_Service SHALL 同时在销售订单数据源、采购单数据源、独立单据数据源中执行检索
3. WHEN 三个维度的检索均完成时, THE Search_System SHALL 将各维度的检索结果合并后返回给前端展示
4. IF 某个维度的检索未返回任何结果, THEN THE Search_System SHALL 在该维度的结果区域展示空状态提示信息
5. THE Search_System SHALL 在检索结果的自然语言摘要中包含各维度的命中数量信息

### 需求 4：右侧结果面板多维度展示

**用户故事：** 作为系统用户，我希望右侧的结果列表能够按维度分组展示检索结果，以便快速区分和浏览不同维度的命中记录。

#### 验收标准

1. THE Search_System SHALL 在右侧结果面板顶部提供三个 Dimension_Tab，分别标注为"销售订单"、"采购单"、"单据"
2. WHEN 用户点击某个 Dimension_Tab 时, THE Search_System SHALL 切换显示该维度对应的检索结果列表
3. THE Search_System SHALL 在每个 Dimension_Tab 上显示该维度的命中记录数量
4. WHEN 检索完成后, THE Search_System SHALL 默认激活第一个有命中结果的 Dimension_Tab
5. THE Search_System SHALL 确保销售订单维度的结果列表保持现有的卡片式展示样式（订单号、项目名称、客户名称、关联文件列表）
6. THE Search_System SHALL 确保采购单维度的结果列表采用与销售订单维度类似的卡片式展示样式（采购订单号、供应商名称、采购日期、关联文件列表）
7. THE Search_System SHALL 确保单据本身维度的结果列表以文件名为主要展示字段，每条记录展示文件名、单据类型标签及该类单据对应的结构化字段值

### 需求 5：各维度独立的单据类型筛选

**用户故事：** 作为系统用户，我希望每个维度都有独立的单据类型筛选器，以便在某个维度内按文件类型进一步过滤结果。

#### 验收标准

1. THE Search_System SHALL 在每个 Dimension_Tab 对应的结果区域内提供独立的 Document_Type_Filter 组件
2. WHEN 用户在某个维度的 Document_Type_Filter 中选择特定单据类型时, THE Search_System SHALL 仅过滤该维度的结果列表，不影响其他维度的展示
3. THE Search_System SHALL 确保每个维度的 Document_Type_Filter 默认选中"全部"选项
4. WHEN 用户切换 Dimension_Tab 时, THE Search_System SHALL 保留各维度已选择的筛选状态
5. THE Search_System SHALL 确保每个维度的 Document_Type_Filter 下拉选项仅包含该维度检索结果中实际存在的单据类型

### 需求 6：销售订单维度单据类型补充

**用户故事：** 作为系统用户，我希望销售订单维度能覆盖更多的单据类型，以便在销售订单下检索到所有相关的文件。

#### 验收标准

1. THE Search_System SHALL 在销售订单维度的文件关联数据中补充以下单据类型：技术协议、出厂试验报告、质量异议处理单、质保书
2. THE Search_System SHALL 确保新增的单据类型在 Document_Type_Filter 的下拉选项中可见
3. THE Search_System SHALL 为每种新增的单据类型分配唯一的标签颜色（tagColor），与现有类型不重复
4. WHEN 用户查询涉及新增单据类型的关键词时, THE Query_Parser SHALL 正确识别并将其纳入检索条件

### 需求 7：采购单维度结果详情

**用户故事：** 作为系统用户，我希望能够查看采购单的详细信息，以便了解采购订单的完整数据。

#### 验收标准

1. WHEN 用户点击采购单维度结果列表中某条记录的详情按钮时, THE Search_System SHALL 打开详情抽屉展示该采购订单的完整信息
2. THE Search_System SHALL 在采购单详情抽屉中展示采购订单基础信息（采购订单号、供应商名称、采购日期、采购金额等）
3. THE Search_System SHALL 在采购单详情抽屉中展示该采购订单关联的所有文件列表

### 需求 8：单据本身维度结构化字段动态展示

**用户故事：** 作为系统用户，我希望在单据本身维度中，不同类型的单据能展示各自特有的结构化字段，以便查看每类单据的关键信息。

#### 验收标准

1. WHEN 单据本身维度的结果列表中包含某类单据时, THE Search_System SHALL 根据该类单据的元数据配置动态渲染对应的结构化字段列
2. WHEN 用户通过 Document_Type_Filter 筛选到单一单据类型时, THE Search_System SHALL 在列表中展示该类型特有的全部结构化字段
3. WHEN 用户未筛选或选择"全部"时, THE Search_System SHALL 在列表中展示通用字段（文件名、单据类型、文件格式），不展示特定类型的结构化字段
4. THE Search_System SHALL 确保结构化字段的展示顺序与元数据配置中定义的顺序一致

### 需求 9：多维度检索结果在对话区的展示

**用户故事：** 作为系统用户，我希望左侧对话区的检索结果也能体现多维度信息，以便在对话流中了解各维度的命中情况。

#### 验收标准

1. WHEN 检索完成后, THE Search_System SHALL 在对话区的结果消息中展示各维度的命中数量摘要（如"销售订单 5 条，采购单 3 条，单据 8 份"）
2. WHEN 用户点击对话区结果消息中的"查看订单列表"按钮时, THE Search_System SHALL 将右侧面板切换到对应的检索结果并展开
3. THE Search_System SHALL 确保对话区的思考过程步骤中体现多维度检索的执行状态（如"在销售单据中检索"、"在采购单据中检索"、"在独立单据中检索"）

### 需求 10：各维度分页与批量操作

**用户故事：** 作为系统用户，我希望每个维度的结果列表都支持独立的分页和批量操作，以便高效管理大量检索结果。

#### 验收标准

1. THE Search_System SHALL 为每个维度的结果列表提供独立的分页组件
2. WHEN 用户在某个维度中翻页时, THE Search_System SHALL 仅更新该维度的列表内容，不影响其他维度的分页状态
3. THE Search_System SHALL 为每个维度的结果列表提供独立的全选复选框和批量下载功能
4. WHEN 用户切换 Dimension_Tab 时, THE Search_System SHALL 保留各维度已选择的分页位置和勾选状态
