import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './PageStyle.css';
import './DataCenter.css';

const DataCenter = () => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' 或 'tables'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fields, setFields] = useState([]); // 初始为空，上传文件后根据表头生成
  const [savedTables, setSavedTables] = useState([
    { 
      id: 1, 
      name: '测试表1',
      description: '用户信息表',
      fieldCount: 3, 
      createTime: '2025-10-20 10:30:00',
      updateTime: '2025-10-20 10:30:00',
      fields: [
        { id: 1, name: '用户ID', type: 'int', description: '主键' },
        { id: 2, name: '用户名', type: 'varchar', length: 100, description: '' },
        { id: 3, name: '创建时间', type: 'datetime', datetimePrecision: 0, description: '' }
      ]
    },
    { 
      id: 2, 
      name: '测试表2',
      description: '订单数据表',
      fieldCount: 2, 
      createTime: '2025-10-21 14:20:00',
      updateTime: '2025-10-21 14:20:00',
      fields: [
        { id: 1, name: '订单编号', type: 'varchar', length: 50, description: '订单唯一标识' },
        { id: 2, name: '金额', type: 'decimal', precision: 10, scale: 2, description: '订单金额' }
      ]
    }
  ]);
  const [importMode, setImportMode] = useState('new'); // 'new' 或 'existing'
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [conflictStrategy, setConflictStrategy] = useState('fail'); // 'fail', 'skip', 'overwrite'
  const [tableName, setTableName] = useState(''); // 表名
  const [tableDescription, setTableDescription] = useState(''); // 表描述

  // 获取要显示的字段列表（根据导入模式决定）
  const getDisplayFields = () => {
    if (importMode === 'existing' && selectedTableId) {
      // 导入到已有表时，显示已有表的字段结构
      const selectedTable = savedTables.find(table => table.id === selectedTableId);
      return selectedTable?.fields || [];
    }
    // 新建表时，显示上传文件解析的字段
    return fields;
  };

  // 处理文件上传
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // 检查文件大小（200MB = 200 * 1024 * 1024 字节）
        if (file.size > 200 * 1024 * 1024) {
          alert('文件大小超过200MB限制，请选择较小的文件');
          return;
        }
        setUploadedFile(file);
        // 解析文件表头并生成字段配置
        parseFileHeaders(file);
        // 初始化表名（使用文件名去除扩展名）
        const defaultTableName = file.name.replace(/\.(xlsx|xls)$/, '');
        setTableName(defaultTableName);
        setTableDescription('');
      } else {
        alert('请上传 xlsx 或 xls 格式的文件');
      }
    }
  };

  // 解析文件表头（默认第一行为表头）
  const parseFileHeaders = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // 读取文件数据
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将工作表转换为二维数组
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 获取第一行作为表头
        if (jsonData && jsonData.length > 0) {
          const headers = jsonData[0];
          
          // 过滤掉空值并转换为字段配置
          const parsedFields = headers
            .filter(header => header !== null && header !== undefined && header !== '')
            .map((header, index) => ({
              id: index + 1,
              name: String(header).trim(),
              type: 'varchar',
              length: 255,
              precision: 10,
              scale: 2,
              datetimePrecision: 0,
              description: ''
            }));
          
          if (parsedFields.length === 0) {
            alert('文件第一行没有找到有效的表头数据');
            return;
          }
          
          setFields(parsedFields);
        } else {
          alert('文件内容为空，请上传包含数据的文件');
        }
      } catch (error) {
        console.error('文件解析失败:', error);
        alert('文件解析失败，请确保文件格式正确');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  // 删除已上传的文件
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFields([]); // 清空字段配置
    setImportMode('new'); // 重置为新建表模式
    setSelectedTableId(null); // 清空选择的表
    setConflictStrategy('fail'); // 重置冲突策略
    setTableName(''); // 清空表名
    setTableDescription(''); // 清空表描述
  };

  // 更新字段
  const handleUpdateField = (id, key, value) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  // 保存表结构
  const handleSaveTable = () => {
    if (!uploadedFile) {
      alert('请先上传文件');
      return;
    }
    if (!tableName.trim()) {
      alert('请填写表名');
      return;
    }
    const hasEmptyNames = fields.some(field => !field.name.trim());
    if (hasEmptyNames) {
      alert('请填写所有字段名称');
      return;
    }
    // 这里添加保存表结构的逻辑
    const now = new Date().toLocaleString('zh-CN');
    const newTable = {
      id: savedTables.length + 1,
      name: tableName.trim(),
      description: tableDescription.trim(),
      fieldCount: fields.length,
      createTime: now,
      updateTime: now,
      fields: fields
    };
    setSavedTables([...savedTables, newTable]);
    alert('表结构保存成功');
  };

  // 清空表数据
  const handleClearTable = (id) => {
    if (window.confirm('确定要清空该表的数据吗？')) {
      // 更新表的最近更新时间
      setSavedTables(savedTables.map(table => 
        table.id === id 
          ? { ...table, updateTime: new Date().toLocaleString('zh-CN') }
          : table
      ));
      alert('表数据已清空');
    }
  };

  // 删除表
  const handleDeleteTable = (id) => {
    if (window.confirm('确定要删除这个表吗？')) {
      setSavedTables(savedTables.filter(table => table.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>数据中心</h2>
      </div>
      <div className="page-content">
        {/* 标签切换 */}
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            文件上传
          </button>
          <button 
            className={`tab-button ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            已有表 ({savedTables.length})
          </button>
        </div>

        {/* 文件上传区域 */}
        {activeTab === 'upload' && (
          <div className="upload-section">
            {/* 上传文件 */}
            <div className="section-title">上传文件</div>
            <div className="upload-area">
              {!uploadedFile ? (
                <label className="upload-label">
                  <input 
                    type="file" 
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">📁</span>
                    <div>点击上传或拖拽文件到这里</div>
                    <div className="upload-hint">
                      支持上传单个不超过200MB的xlsx/xls格式文件
                    </div>
                  </div>
                </label>
              ) : (
                <div className="uploaded-file">
                  <div className="file-icon excel-icon">
                    <svg viewBox="0 0 48 48" width="40" height="40">
                      {/* 文档背景 */}
                      <path d="M8 2h24l8 8v34a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#E8E8E8"/>
                      {/* 文档折角 */}
                      <path d="M32 2v6a2 2 0 0 0 2 2h6z" fill="#D0D0D0"/>
                      {/* Excel 绿色标识 */}
                      <rect x="24" y="24" width="18" height="18" rx="2" fill="#1D6F42"/>
                      {/* X 字母 */}
                      <text x="33" y="37" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">X</text>
                      {/* 表格线条 */}
                      <line x1="27" y1="28" x2="39" y2="28" stroke="#fff" strokeWidth="0.5" opacity="0.6"/>
                      <line x1="27" y1="31" x2="39" y2="31" stroke="#fff" strokeWidth="0.5" opacity="0.6"/>
                      <line x1="30" y1="26" x2="30" y2="32" stroke="#fff" strokeWidth="0.5" opacity="0.6"/>
                      <line x1="36" y1="26" x2="36" y2="32" stroke="#fff" strokeWidth="0.5" opacity="0.6"/>
                    </svg>
                  </div>
                  <span className="file-name">{uploadedFile.name}</span>
                  <button className="remove-file-btn" onClick={handleRemoveFile}>✕</button>
                  <span className="file-check">✓</span>
                </div>
              )}
            </div>

            {/* 导入方式选择 - 始终显示 */}
            <div className="section-title">导入方式</div>
            <div className="import-mode-selector">
              <label className="mode-option">
                <input
                  type="radio"
                  value="new"
                  checked={importMode === 'new'}
                  onChange={(e) => setImportMode(e.target.value)}
                />
                <span>新建表</span>
              </label>
              <label className="mode-option">
                <input
                  type="radio"
                  value="existing"
                  checked={importMode === 'existing'}
                  onChange={(e) => setImportMode(e.target.value)}
                />
                <span>导入到已有表</span>
              </label>
            </div>

            {/* 新建表配置 */}
            {importMode === 'new' && (
              <div className="table-config-section">
                <div className="config-row">
                  <label className="config-label">
                    <span className="required">*</span>表名：
                  </label>
                  <input
                    type="text"
                    className="config-input"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="请输入表名"
                    disabled={!uploadedFile}
                  />
                </div>
                <div className="config-row">
                  <label className="config-label">表描述：</label>
                  <input
                    type="text"
                    className="config-input"
                    value={tableDescription}
                    onChange={(e) => setTableDescription(e.target.value)}
                    placeholder="请输入表描述（可选）"
                    disabled={!uploadedFile}
                  />
                </div>
              </div>
            )}

            {/* 选择已有表 */}
            {importMode === 'existing' && (
              <>
                <div className="existing-table-selector">
                  <label>选择目标表：</label>
                  <select
                    className="table-select"
                    value={selectedTableId || ''}
                    onChange={(e) => setSelectedTableId(parseInt(e.target.value))}
                  >
                    <option value="">请选择表</option>
                    {savedTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name} ({table.fieldCount}个字段)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 主键冲突处理 */}
                <div className="conflict-strategy-selector">
                  <label className="strategy-label">主键冲突处理</label>
                  <div className="strategy-options">
                    <label className="strategy-option">
                      <input
                        type="radio"
                        value="fail"
                        checked={conflictStrategy === 'fail'}
                        onChange={(e) => setConflictStrategy(e.target.value)}
                      />
                      <span>全部导入失败</span>
                    </label>
                    <label className="strategy-option">
                      <input
                        type="radio"
                        value="skip"
                        checked={conflictStrategy === 'skip'}
                        onChange={(e) => setConflictStrategy(e.target.value)}
                      />
                      <span>跳过冲突行</span>
                    </label>
                    <label className="strategy-option">
                      <input
                        type="radio"
                        value="overwrite"
                        checked={conflictStrategy === 'overwrite'}
                        onChange={(e) => setConflictStrategy(e.target.value)}
                      />
                      <span>替换冲突行</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* 表结构定义 - 始终显示 */}
            <div className="section-title">表结构</div>

            {/* 字段配置表格 - 始终显示表头 */}
            <div className="fields-table">
              <div className="table-header">
                <div className="col-drag"></div>
                <div className="col-name"><span className="required">*</span> 字段名称</div>
                <div className="col-type-wrapper"><span className="required">*</span> 字段类型</div>
                <div className="col-description">字段描述</div>
              </div>
              {/* 根据模式显示字段行 */}
              {getDisplayFields().map((field) => (
                <div key={field.id} className="table-row">
                  <div className="col-drag">☰</div>
                  <div className="col-name">
                    <input
                      type="text"
                      value={field.name}
                      readOnly
                      placeholder="请输入"
                    />
                  </div>
                  <div className="col-type-wrapper">
                    <div className="type-inputs">
                      <select
                        className="type-select"
                        value={field.type}
                        onChange={(e) => handleUpdateField(field.id, 'type', e.target.value)}
                        disabled={importMode === 'existing'}
                      >
                        <option value="varchar">VARCHAR</option>
                        <option value="int">INT</option>
                        <option value="text">TEXT</option>
                        <option value="decimal">DECIMAL</option>
                        <option value="datetime">DATETIME</option>
                      </select>
                      
                      {/* VARCHAR 类型显示长度输入框 */}
                      {field.type === 'varchar' && (
                        <input
                          type="number"
                          className="type-param"
                          value={field.length || 255}
                          onChange={(e) => handleUpdateField(field.id, 'length', parseInt(e.target.value) || 255)}
                          min="1"
                          max="65535"
                          disabled={importMode === 'existing'}
                        />
                      )}
                      
                      {/* DECIMAL 类型显示精度和小数位数 */}
                      {field.type === 'decimal' && (
                        <>
                          <input
                            type="number"
                            className="type-param"
                            value={field.precision || 10}
                            onChange={(e) => handleUpdateField(field.id, 'precision', parseInt(e.target.value) || 10)}
                            min="1"
                            max="65"
                            placeholder="精度"
                            disabled={importMode === 'existing'}
                          />
                          <span className="param-separator">,</span>
                          <input
                            type="number"
                            className="type-param"
                            value={field.scale || 2}
                            onChange={(e) => handleUpdateField(field.id, 'scale', parseInt(e.target.value) || 2)}
                            min="0"
                            max="30"
                            placeholder="小数"
                            disabled={importMode === 'existing'}
                          />
                        </>
                      )}
                      
                      {/* DATETIME 类型显示精度 */}
                      {field.type === 'datetime' && (
                        <input
                          type="number"
                          className="type-param"
                          value={field.datetimePrecision !== undefined ? field.datetimePrecision : 0}
                          onChange={(e) => handleUpdateField(field.id, 'datetimePrecision', parseInt(e.target.value) || 0)}
                          min="0"
                          max="6"
                          placeholder="精度"
                          disabled={importMode === 'existing'}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-description">
                    <input
                      type="text"
                      value={field.description || ''}
                      onChange={(e) => handleUpdateField(field.id, 'description', e.target.value)}
                      placeholder="请输入"
                      disabled={importMode === 'existing'}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 操作按钮 */}
            {((importMode === 'new' && uploadedFile && fields.length > 0) || 
              (importMode === 'existing' && selectedTableId && uploadedFile)) && (
              <div className="action-buttons">
                {importMode === 'new' && (
                  <button className="save-btn" onClick={handleSaveTable}>保存表结构</button>
                )}
                {importMode === 'existing' && (
                  <button className="save-btn" onClick={() => alert(`导入到表ID: ${selectedTableId}, 冲突策略: ${conflictStrategy}`)}>导入数据</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 已有表列表 */}
        {activeTab === 'tables' && (
          <div className="tables-section">
            {savedTables.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <div>暂无数据表</div>
                <div className="empty-hint">请先上传文件并配置表结构</div>
              </div>
            ) : (
              <div className="table-list-container">
                <div className="table-list-header">
                  <div className="list-col-name">表名</div>
                  <div className="list-col-time">创建时间</div>
                  <div className="list-col-time">最近更新时间</div>
                  <div className="list-col-actions">操作</div>
                </div>
                <div className="table-list-body">
                  {savedTables.map((table) => (
                    <div key={table.id} className="table-list-row">
                      <div className="list-col-name">{table.name}</div>
                      <div className="list-col-time">{table.createTime}</div>
                      <div className="list-col-time">{table.updateTime}</div>
                      <div className="list-col-actions">
                        <button 
                          className="list-action-btn clear-btn"
                          onClick={() => handleClearTable(table.id)}
                          title="清空数据"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M10 2l3 3-1 1-3-3 1-1z" opacity="0.4"/>
                            <path d="M8.5 3.5l2.5 2.5-2 2-1.5-1.5z" opacity="0.25"/>
                            <path d="M2 14c0-.5 0-1.5.5-2.5.5-1 1.5-2 2.5-2.5l2 2c-.5 1-1.5 2-2.5 2.5-1 .5-2 .5-2.5.5z"/>
                            <path d="M3 14l1-1 1 1-1 1-1-1zm2-2l1-1 1 1-1 1-1-1z" opacity="0.6"/>
                          </svg>
                        </button>
                        <button 
                          className="list-action-btn delete-btn"
                          onClick={() => handleDeleteTable(table.id)}
                          title="删除表"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCenter;

