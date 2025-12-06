import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { google } from 'googleapis';
import { query } from '../db/connection';

// Generate Excel file
export async function generateExcel(request: any): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // 設置 A4 紙張大小
  workbook.creator = '叫料系統';
  workbook.created = new Date();

  // Get company info from request or environment
  let companyName = '';
  let companyTaxId = '';
  
  // 優先使用 request 中已設置的公司資訊（可能是從下載時選擇的公司覆蓋的）
  // 注意：如果 company_id 為 null，表示已經被覆蓋，應該使用 company_name
  if (request.company_name) {
    companyName = request.company_name;
    companyTaxId = request.company_tax_id || '';
    console.log('使用覆蓋的公司資訊:', { companyName, companyTaxId, company_id: request.company_id });
  } else if (request.company_id) {
    // 如果有 company_id 但沒有 JOIN 的資料，查詢公司資訊
    try {
      const companyResult = await query(
        'SELECT name, tax_id FROM companies WHERE id = $1',
        [request.company_id]
      );
      if (companyResult.rows.length > 0) {
        companyName = companyResult.rows[0].name || '';
        companyTaxId = companyResult.rows[0].tax_id || '';
        console.log('從數據庫查詢公司資訊:', { companyName, companyTaxId });
      }
    } catch (error) {
      console.warn('查詢公司資訊失敗:', error);
    }
  }
  
  // 如果還是沒有公司資訊，使用環境變數
  if (!companyName) {
    companyName = process.env.COMPANY_NAME || '金鴻空調機電工程有限公司';
    companyTaxId = process.env.COMPANY_TAX_ID || '16272724';
    console.log('使用環境變數公司資訊:', { companyName, companyTaxId });
  }

  // Get address and contact info from request
  // 優先使用已經 JOIN 的地址資訊（如果 getFullRequest 已經 JOIN）
  let deliveryAddress = '';
  let contactPhone = '';
  let contactPerson = '';
  
  try {
    // 優先使用已經 JOIN 的地址資訊（如果有的話）
    if (request.delivery_address || request.contact_person || request.contact_phone) {
      deliveryAddress = request.delivery_address || '';
      contactPhone = request.contact_phone || '';
      contactPerson = request.contact_person || '';
      console.log('使用 JOIN 的地址資訊:', { deliveryAddress, contactPhone, contactPerson });
    } else if (request.address_id) {
      // 如果沒有 JOIN 的資料，但有 address_id，則查詢地址
      const addressResult = await query(
        'SELECT address, contact_person, contact_phone FROM addresses WHERE id = $1',
        [request.address_id]
      );
      if (addressResult.rows.length > 0) {
        deliveryAddress = addressResult.rows[0].address || '';
        contactPhone = addressResult.rows[0].contact_phone || '';
        contactPerson = addressResult.rows[0].contact_person || '';
        console.log('從資料庫查詢地址資訊:', { deliveryAddress, contactPhone, contactPerson });
      } else {
        console.warn('找不到地址資訊，address_id:', request.address_id);
      }
    } else {
      console.warn('沒有 address_id，無法取得地址資訊');
    }
    // 如果沒有 address_id，不顯示地址資訊（保持為空字串）
  } catch (error) {
    console.error('取得地址資訊失敗:', error);
  }

  // Get site name (工區) - 優先使用 request.site_name，否則從送貨地址提取
  let siteName = '';
  
  // 優先使用 request 中已設置的 site_name（從 getFullRequest JOIN 的資料）
  if (request.site_name) {
    siteName = request.site_name;
    console.log('使用 JOIN 的工區資訊:', { siteName });
  } else if (deliveryAddress) {
    // 如果沒有 site_name，從送貨地址提取工區名稱
    // 地址格式通常是：工區 - 詳細地址
    // 例如：三總 - 台北市內湖區成功路二段325號
    // 提取後只使用工區部分（如：三總），不包含詳細地址
    // 優先使用 " - " 分割（空格+破折號+空格）
    const parts = deliveryAddress.split(' - ');
    if (parts.length > 1 && parts[0].trim()) {
      // 如果有 " - "，第一部分就是工區
      siteName = parts[0].trim();
    } else {
      // 如果沒有 " - "，嘗試用 "-" 分割（無空格）
      const parts2 = deliveryAddress.split('-');
      if (parts2.length > 1 && parts2[0].trim()) {
        siteName = parts2[0].trim();
      } else {
        // 如果地址中沒有分隔符，嘗試從地址中提取常見的工區名稱
        const commonSites = ['三總', '金山', '關西', '新竹', '台北', '台中', '高雄'];
        for (const site of commonSites) {
          if (deliveryAddress.includes(site)) {
            siteName = site;
            break;
          }
        }
      }
    }
    console.log('從地址提取工區資訊:', { siteName, deliveryAddress });
  }
  // 如果還是沒有工區，工區欄位會是空的

  // Format date - 格式: YYYYMMDD HHMM
  const createdDate = new Date(request.created_at);
  const dateTimeStr = `${createdDate.getFullYear()}${String(createdDate.getMonth() + 1).padStart(2, '0')}${String(createdDate.getDate()).padStart(2, '0')} ${String(createdDate.getHours()).padStart(2, '0')}${String(createdDate.getMinutes()).padStart(2, '0')}`;

  // Helper function to convert any value to string
  const toString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Sheet 1: 叫料單
  const requestSheet = workbook.addWorksheet('叫料單', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape', // 橫向
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  });

  // 定義樣式
  const headerStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 12, bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } }, // 藍色背景
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };

  const companyStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 16, bold: true },
    alignment: { vertical: 'middle', horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } } // 淺灰色背景
  };

  const dataRowStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 11 },
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    border: {
      top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    }
  };

  const alternateRowStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 11 },
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }, // 淺灰色背景
    border: {
      top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    }
  };

  // 定義資訊區塊樣式
  const infoLabelStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 11, bold: true },
    alignment: { vertical: 'middle', horizontal: 'left' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } }, // 淺灰色背景
    border: {
      top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    }
  };

  const infoValueStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 11 },
    alignment: { vertical: 'middle', horizontal: 'left' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }, // 白色背景
    border: {
      top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    }
  };

  // 添加公司資訊行（置中）
  const companyRow = requestSheet.addRow([companyName]);
  requestSheet.mergeCells(1, 1, 1, 8); // 合併第1行的第1欄到第8欄（8欄位格式）
  companyRow.getCell(1).style = companyStyle;
  companyRow.height = 30;

  const taxIdRow = requestSheet.addRow([`統編：${companyTaxId}`]);
  requestSheet.mergeCells(2, 1, 2, 8); // 合併第2行的第1欄到第8欄
  taxIdRow.getCell(1).style = companyStyle;
  taxIdRow.height = 25;

  // 空行
  requestSheet.addRow([]);

  // 添加叫料單基本資訊（兩欄格式：標籤 | 值）
  const addInfoRow = (label: string, value: string, startRow: number) => {
    const row = requestSheet.addRow([label, value]);
    // 標籤欄（第1欄）
    row.getCell(1).style = infoLabelStyle;
    // 值欄（第2-8欄合併，因為現在是8欄位格式）
    requestSheet.mergeCells(startRow, 2, startRow, 8);
    row.getCell(2).style = infoValueStyle;
    row.height = 22;
  };

  let currentRow = 4; // 從第4行開始（前3行是公司資訊和空行）
  addInfoRow('叫料單號', request.request_number, currentRow++);
  addInfoRow('建立日期', new Date(request.created_at).toLocaleString('zh-TW', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }), currentRow++);
  // 申請人欄位已取消，待建立登入系統架構後再實作
  // addInfoRow('申請人', applicantName, currentRow++);
  // 工區資訊（必須顯示，即使為空）
  addInfoRow('工區', siteName || '', currentRow++);
  // 聯絡人資訊（必須顯示，即使為空）
  addInfoRow('聯絡人', contactPerson || '', currentRow++);
  // 聯繫電話（必須顯示，即使為空）
  addInfoRow('聯繫電話', contactPhone || '', currentRow++);
  // 送貨地址（必須顯示，即使為空）
  addInfoRow('送貨地址', deliveryAddress || '', currentRow++);
  addInfoRow('狀態', request.status, currentRow++);

  // 空行
  requestSheet.addRow([]);
  currentRow++;

  // 添加材料明細表頭（8欄位格式，符合圖片）
  const headers = ['工區', '施工類別', '材料類別', '材料名稱', '材料規格', '單位', '數量', '備註'];
  const headerRow = requestSheet.addRow(headers);
  headerRow.eachCell((cell, colNumber) => {
    cell.style = headerStyle;
  });
  headerRow.height = 25;

  // 設置欄位寬度（8欄位）
  requestSheet.columns = [
    { width: 15 }, // 工區
    { width: 15 }, // 施工類別
    { width: 15 }, // 材料類別
    { width: 20 }, // 材料名稱
    { width: 15 }, // 材料規格
    { width: 10 }, // 單位
    { width: 10 }, // 數量
    { width: 25 }  // 備註
  ];

  // Add material items - 每個材料項目一行
  for (let i = 0; i < request.items.length; i++) {
    const item = request.items[i];
    
    // Get material specification if available
    let materialSpec = '';
    try {
      const materialResult = await query(
        'SELECT specification FROM materials WHERE id = $1',
        [item.material_id]
      );
      if (materialResult.rows.length > 0) {
        materialSpec = toString(materialResult.rows[0].specification || '');
      }
    } catch (error) {
      // Ignore error, use empty values
    }

    // 按照圖片格式的8欄位順序排列
    const rowData = [
      toString(siteName || ''),                     // 1. 工區
      toString(request.construction_category_name || ''), // 2. 施工類別
      toString(item.material_category_name || ''),  // 3. 材料類別
      toString(item.material_name || ''),           // 4. 材料名稱
      toString(materialSpec),                       // 5. 材料規格
      toString(item.unit || item.material_unit || ''), // 6. 單位
      toString(item.quantity),                      // 7. 數量
      toString(item.notes || '')                    // 8. 備註
    ];

    const dataRow = requestSheet.addRow(rowData);
    
    // 使用交替顏色區隔資料行
    const rowStyle = i % 2 === 0 ? dataRowStyle : alternateRowStyle;
    dataRow.eachCell((cell, colNumber) => {
      // 確保所有儲存格都有正確的樣式
      const cellStyle: Partial<ExcelJS.Style> = {
        font: { 
          name: '微軟正黑體', 
          size: 11,
          color: { argb: 'FF000000' } // 確保文字顏色是黑色
        },
        alignment: {
          vertical: 'middle',
          horizontal: colNumber === 1 ? 'center' : (colNumber === 7 ? 'right' : 'left'), // 第一欄（工區）置中，第7欄（數量）靠右，其他靠左
          wrapText: true
        },
        border: {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
        }
      };
      
      // 如果是交替行，添加背景色
      if (i % 2 === 1) {
        cellStyle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      }
      
      // 確保值存在（特別是第 7、8 列）
      if (colNumber === 7) {
        // 第 7 列：數量
        if (cell.value === null || cell.value === undefined) {
          cell.value = item.quantity || 0;
        }
      } else if (colNumber === 8) {
        // 第 8 列：備註
        if (cell.value === null || cell.value === undefined) {
          cell.value = item.notes || '';
        }
      }
      
      cell.style = cellStyle;
      
      // 添加調試日誌（僅第一行）
      if (i === 0) {
        console.log(`第 ${colNumber} 列值:`, cell.value, '類型:', typeof cell.value);
      }
    });
    dataRow.height = 20;
    
    // 特別確保 A13（第一筆資料的第一欄）有值並可見
    if (i === 0) {
      const firstCell = dataRow.getCell(1);
      // 確保值存在
      if (!firstCell.value || String(firstCell.value).trim() === '') {
        console.warn('A13 儲存格為空，設置 siteName:', siteName);
        firstCell.value = siteName || '';
      }
      // 確保儲存格樣式正確
      firstCell.style = {
        font: { name: '微軟正黑體', size: 11, color: { argb: 'FF000000' }, bold: false },
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
        }
      };
      console.log('A13 儲存格值:', firstCell.value, 'siteName:', siteName, '類型:', typeof firstCell.value);
    }
  }

  // Sheet 2: 月份統計 - 分頁名稱格式: 月份＋月統計 (如 "2025年11月統計")
  const currentMonth = createdDate.getMonth() + 1;
  const currentYear = createdDate.getFullYear();
  const monthKey = `${currentYear}${String(currentMonth).padStart(2, '0')}`; // 用於查詢的格式，如 "202511"
  const monthSheetName = `${currentYear}年${currentMonth}月統計`; // 分頁顯示名稱，如 "2025年11月統計"
  const monthStart = new Date(currentYear, currentMonth - 1, 1);
  const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  let monthlyStats: any[] = [];
  try {
    // Query all materials from requests in the current month for this user
    const statsResult = await query(
      `SELECT 
        mc.name as material_category_name,
        m.name as material_name,
        m.specification,
        SUM(mri.quantity) as total_quantity,
        COALESCE(mri.unit, m.unit) as unit,
        mr.status
      FROM material_request_items mri
      INNER JOIN material_requests mr ON mri.request_id = mr.id
      INNER JOIN materials m ON mri.material_id = m.id
      LEFT JOIN material_categories mc ON m.material_category_id = mc.id
      WHERE mr.user_id = $1 
        AND mr.created_at >= $2 
        AND mr.created_at <= $3
      GROUP BY mc.name, m.name, m.specification, COALESCE(mri.unit, m.unit), mr.status
      ORDER BY mc.name, m.name`,
      [request.user_id, monthStart, monthEnd]
    );

    monthlyStats = statsResult.rows;
  } catch (error) {
    console.warn('取得月統計失敗:', error);
  }

  // Sheet 2: 月份統計 - 重新設計結構和排版
  const monthlySheet = workbook.addWorksheet(monthSheetName, {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'portrait', // 改為縱向
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  });

  // 定義月統計樣式
  const monthlyHeaderStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 14, bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } }, // 藍色背景
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };

  const monthlyDataRowStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 11, color: { argb: 'FF000000' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }, // 白色背景
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    border: {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
    }
  };

  const monthlyAlternateRowStyle: Partial<ExcelJS.Style> = {
    font: { name: '微軟正黑體', size: 11, color: { argb: 'FF000000' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }, // 淺灰色背景
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    border: {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
    }
  };

  // 添加標題行
  const titleRow = monthlySheet.addRow([`${monthSheetName}`]);
  monthlySheet.mergeCells(1, 1, 1, 5); // 合併5欄
  titleRow.getCell(1).style = {
    font: { name: '微軟正黑體', size: 16, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } } // 淺灰色背景
  };
  titleRow.height = 30;

  // 空行
  monthlySheet.addRow([]);

  // 添加表頭 - 重新設計欄位
  const monthlyHeaders = ['日期', '材料類別', '材料名稱', '數量', '單位', '狀態'];
  const monthlyHeaderRow = monthlySheet.addRow(monthlyHeaders);
  monthlyHeaderRow.eachCell((cell) => {
    cell.style = monthlyHeaderStyle;
  });
  monthlyHeaderRow.height = 25;

  // 設置欄位寬度
  monthlySheet.columns = [
    { width: 15 }, // 日期
    { width: 20 }, // 材料類別
    { width: 30 }, // 材料名稱
    { width: 12 }, // 數量
    { width: 10 }, // 單位
    { width: 12 }  // 狀態
  ];

  // 添加數據行 - 重新設計數據結構
  for (let i = 0; i < monthlyStats.length; i++) {
    const stat = monthlyStats[i];
    const rowData = [
      toString(monthSheetName.replace('統計', '')), // 日期：顯示月份（如「2025年11月」）
      toString(stat.material_category_name || ''), // 材料類別
      toString(stat.material_name || ''), // 材料名稱
      toString(stat.total_quantity || 0), // 數量
      toString(stat.unit || ''), // 單位
      toString(stat.status || '') // 狀態
    ];

    const dataRow = monthlySheet.addRow(rowData);
    const rowStyle = i % 2 === 0 ? monthlyDataRowStyle : monthlyAlternateRowStyle;
    dataRow.eachCell((cell) => {
      cell.style = rowStyle;
    });
    dataRow.height = 20;
  }

  // 添加統計摘要行（如果有數據）
  if (monthlyStats.length > 0) {
    monthlySheet.addRow([]); // 空行
    
    const summaryRow = monthlySheet.addRow(['合計', '', '', '', '', '']);
    monthlySheet.mergeCells(summaryRow.number, 1, summaryRow.number, 3); // 合併前3欄
    summaryRow.getCell(1).style = {
      font: { name: '微軟正黑體', size: 12, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'right' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } }
    };
    
    // 計算總數量
    const totalQuantity = monthlyStats.reduce((sum, stat) => sum + (parseFloat(toString(stat.total_quantity)) || 0), 0);
    summaryRow.getCell(4).value = totalQuantity;
    summaryRow.getCell(4).style = {
      font: { name: '微軟正黑體', size: 12, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'right' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } }
    };
    summaryRow.height = 25;
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// Upload to Google Drive
export async function uploadToCloud(buffer: Buffer, filename: string): Promise<{ fileId: string; url: string }> {
  try {
    if (!process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
      throw new Error('Google Drive 未配置');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: filename,
      parents: [] // 可以指定資料夾ID
    };

    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: buffer
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    // Make file publicly accessible (optional)
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
    }

    return {
      fileId: response.data.id || '',
      url: response.data.webViewLink || ''
    };
  } catch (error) {
    console.error('上傳雲端失敗:', error);
    // 如果雲端上傳失敗，返回本地URL
    return {
      fileId: '',
      url: `/api/files/${filename}`
    };
  }
}

// Send email
export async function sendEmail(options: {
  to: string;
  subject: string;
  request: any;
  excelBuffer?: Buffer;
  filename?: string;
}): Promise<void> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn('郵件服務未配置');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    let html = `
      <h2>叫料單已建立</h2>
      <p><strong>叫料單號：</strong>${options.request.request_number}</p>
      <p><strong>建立日期：</strong>${new Date(options.request.created_at).toLocaleString('zh-TW')}</p>
      <p><strong>施工類別：</strong>${options.request.construction_category_name}</p>
      ${options.request.notes ? `<p><strong>備註：</strong>${options.request.notes}</p>` : ''}
      
      <h3>材料明細</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>材料類別</th>
          <th>材料名稱</th>
          <th>數量</th>
          <th>單位</th>
        </tr>
    `;

    for (const item of options.request.items) {
      html += `
        <tr>
          <td>${item.material_category_name || ''}</td>
          <td>${item.material_name || ''}</td>
          <td>${item.quantity}</td>
          <td>${item.unit || item.material_unit || ''}</td>
        </tr>
      `;
    }

    html += '</table>';

    const mailOptions: any = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: html
    };

    if (options.excelBuffer) {
      // 使用提供的檔名，或使用預設檔名
      const attachmentFilename = options.filename || `${options.request.request_number}.xlsx`;
      mailOptions.attachments = [{
        filename: attachmentFilename,
        content: options.excelBuffer
      }];
    }

    await transporter.sendMail(mailOptions);
    console.log('郵件發送成功:', options.to);
  } catch (error) {
    console.error('發送郵件失敗:', error);
    throw error;
  }
}

// Send LINE Notify
export async function sendLineNotify(options: {
  token: string;
  message: string;
  request: any;
}): Promise<void> {
  try {
    let message = `${options.message}\n`;
    message += `叫料單號：${options.request.request_number}\n`;
    message += `施工類別：${options.request.construction_category_name}\n`;
    message += `建立日期：${new Date(options.request.created_at).toLocaleString('zh-TW')}\n\n`;
    message += '材料明細：\n';

    for (const item of options.request.items) {
      message += `- ${item.material_category_name || ''} | ${item.material_name || ''} | 數量：${item.quantity} ${item.unit || item.material_unit || ''}\n`;
    }

    if (options.request.notes) {
      message += `\n備註：${options.request.notes}`;
    }

    await axios.post(
      'https://notify-api.line.me/api/notify',
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${options.token}`
        }
      }
    );

    console.log('LINE通知發送成功');
  } catch (error) {
    console.error('發送LINE通知失敗:', error);
    throw error;
  }
}

