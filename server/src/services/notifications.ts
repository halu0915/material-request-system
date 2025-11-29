import XLSX from 'xlsx-js-style';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { google } from 'googleapis';

// Helper function to apply cell styles
function applyCellStyle(sheet: any, cellAddress: string, style: any) {
  if (!sheet[cellAddress]) {
    sheet[cellAddress] = { t: 's', v: '' };
  }
  sheet[cellAddress].s = style;
}

// Generate Excel file with company header and A4 formatting
export async function generateExcel(request: any, companyName?: string, taxId?: string, monthlyRequests?: any[]): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();

  // Get company info from environment or use defaults
  const company = companyName || process.env.COMPANY_NAME || '公司名稱';
  const taxIdNumber = taxId || process.env.COMPANY_TAX_ID || '統編：00000000';
  const workArea = request.work_area || request.construction_category_name || '';

  // Main data sheet with company header
  const mainData = [
    // Company header
    [company],
    ['統編：' + taxIdNumber],
    [],
    // Request info
    ['叫料單號', request.request_number],
    ['建立日期', new Date(request.created_at).toLocaleString('zh-TW')],
    ['申請人', request.applicant_name || ''],
    ['聯繫電話', request.contact_phone || ''],
    ['工區', workArea],
    ['施工類別', request.construction_category_name || ''],
    ['送貨地址', request.delivery_address || ''],
    ['狀態', request.status],
    [],
    // Table header (without image and link columns - they will be added vertically)
    ['工區', '施工類別', '材料類別', '材料名稱', '材料規格', '單位', '數量', '備註']
  ];

  // Add material items with image and link in separate rows below each item
  for (const item of request.items) {
    // Main item row
    mainData.push([
      workArea,
      request.construction_category_name || '',
      item.material_category_name || '',
      item.material_name || '',
      item.material_specification || '',
      item.unit || item.material_unit || '',
      item.quantity,
      item.notes || ''
    ]);
    
    // Add image and link rows below the item (vertical layout)
    if (item.image_url || item.link_url) {
      const imageLinkRow = ['', '', '', '', '', '', '', ''];
      if (item.image_url) {
        imageLinkRow[7] = `圖片：${item.image_url}`;
      }
      if (item.link_url) {
        imageLinkRow[7] += (item.image_url ? ' | ' : '') + `連結：${item.link_url}`;
      }
      mainData.push(imageLinkRow);
    }
  }

  const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
  
  // Add hyperlinks for image_url and link_url in the notes column (column H, index 7)
  // Header row is row 12 (0-based index 11), data starts from row 13 (index 12)
  const headerRowIndex = 11; // 0-based index for row 12
  let dataRowIndex = headerRowIndex + 1; // Start from first data row (row 13)
  
  for (const item of request.items) {
    // Add hyperlinks in the notes column (column H) for image and link
    if (item.image_url || item.link_url) {
      const notesCellAddress = XLSX.utils.encode_cell({ r: dataRowIndex, c: 7 }); // Column H (index 7)
      if (!mainSheet[notesCellAddress]) {
        mainSheet[notesCellAddress] = { t: 's', v: '' };
      }
      
      // If there's an image link row below, add hyperlinks there
      if (item.image_url || item.link_url) {
        dataRowIndex++; // Move to the image/link row
        const linkRowCellAddress = XLSX.utils.encode_cell({ r: dataRowIndex, c: 7 }); // Column H
        
        if (item.image_url) {
          const imageCellAddress = XLSX.utils.encode_cell({ r: dataRowIndex, c: 7 });
          if (!mainSheet[imageCellAddress]) {
            mainSheet[imageCellAddress] = { t: 's', v: '' };
          }
          mainSheet[imageCellAddress].l = { Target: item.image_url, Tooltip: '查看圖片' };
          mainSheet[imageCellAddress].v = '查看圖片';
          mainSheet[imageCellAddress].t = 's';
        }
        
        if (item.link_url) {
          const linkCellAddress = XLSX.utils.encode_cell({ r: dataRowIndex, c: 7 });
          if (!mainSheet[linkCellAddress]) {
            mainSheet[linkCellAddress] = { t: 's', v: '' };
          }
          // If image already exists, append link text
          if (item.image_url && mainSheet[linkCellAddress].v) {
            mainSheet[linkCellAddress].v += ' | ';
          }
          mainSheet[linkCellAddress].l = { Target: item.link_url, Tooltip: '開啟連結' };
          if (!item.image_url) {
            mainSheet[linkCellAddress].v = '開啟連結';
          } else {
            mainSheet[linkCellAddress].v = (mainSheet[linkCellAddress].v || '查看圖片') + ' | 開啟連結';
          }
          mainSheet[linkCellAddress].t = 's';
        }
      }
    }
    
    dataRowIndex++; // Move to next item
  }

  // Set column widths optimized for A4 (portrait) - reduced to fit on one page
  mainSheet['!cols'] = [
    { wch: 10 }, // 工區
    { wch: 12 }, // 施工類別
    { wch: 12 }, // 材料類別
    { wch: 16 }, // 材料名稱
    { wch: 14 }, // 材料規格
    { wch: 7 },  // 單位
    { wch: 8 },  // 數量
    { wch: 30 }  // 備註（包含圖片和連結）
  ];

  // Set row heights - optimized for A4 one page
  const rowHeights: any[] = [
    { hpt: 24 }, // Company name row
    { hpt: 20 }, // Tax ID row
    { hpt: 8 },  // Empty row
    { hpt: 16 }, // Request info rows
    { hpt: 16 },
    { hpt: 16 },
    { hpt: 16 },
    { hpt: 16 },
    { hpt: 16 },
    { hpt: 16 },
    { hpt: 8 },  // Empty row
    { hpt: 20 }  // Header row
  ];
  
  // Add row heights for data rows
  for (let i = 0; i < request.items.length * 2; i++) {
    rowHeights.push({ hpt: 15 });
  }
  
  mainSheet['!rows'] = rowHeights;

  // Apply styles to cells
  // Company name - Large, bold, centered
  const companyStyle = {
    font: { name: '標楷體', sz: 24, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(mainSheet, 'A1', companyStyle);

  // Tax ID - Large, bold, centered
  const taxIdStyle = {
    font: { name: '標楷體', sz: 18, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(mainSheet, 'A2', taxIdStyle);

  // Request info labels - Bold
  const labelStyle = {
    font: { name: '微軟正黑體', sz: 10, bold: true },
    alignment: { vertical: 'center' },
    fill: { fgColor: { rgb: 'F0F0F0' } }
  };
  for (let i = 3; i <= 10; i++) {
    applyCellStyle(mainSheet, `A${i + 1}`, labelStyle);
  }

  // Table header - Bold, centered, with background
  const headerStyle = {
    font: { name: '微軟正黑體', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: '4472C4' } },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  };
  const headerRow = 12; // Row index 11 (0-based) = row 12
  const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  headerCols.forEach((col, idx) => {
    applyCellStyle(mainSheet, `${col}${headerRow}`, headerStyle);
  });

  // Data rows - Normal style with borders
  const dataStyle = {
    font: { name: '微軟正黑體', sz: 9 },
    alignment: { vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };
  const numRows = mainData.length;
  for (let r = headerRow + 1; r <= numRows; r++) {
    headerCols.forEach((col) => {
      applyCellStyle(mainSheet, `${col}${r}`, dataStyle);
    });
  }

  // Center align quantity column
  const quantityStyle = {
    ...dataStyle,
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
  };
  for (let r = headerRow + 1; r <= numRows; r++) {
    applyCellStyle(mainSheet, `G${r}`, quantityStyle);
  }

  // Merge cells for company header
  if (!mainSheet['!merges']) mainSheet['!merges'] = [];
  mainSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }); // Company name (span all 8 columns)
  mainSheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }); // Tax ID (span all 8 columns)

  // Set A4 page setup (portrait)
  mainSheet['!margins'] = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
  };
  mainSheet['!pageSetup'] = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    scale: 100
  };

  XLSX.utils.book_append_sheet(workbook, mainSheet, '叫料單');
  
  // Add monthly statistics sheet
  const now = new Date(request.created_at);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  
  // Get monthly statistics (this would need to be passed from the route)
  // For now, we'll add a placeholder statistics sheet
  const statsData = [
    ['月統計'],
    ['統計月份', `${year}年${month}月`],
    [],
    ['材料類別', '材料名稱', '材料規格', '總數量', '單位']
  ];
  
  // Group items by material and sum quantities
  const materialStats: { [key: string]: { name: string; spec: string; unit: string; total: number } } = {};
  for (const item of request.items) {
    const key = `${item.material_category_name || ''}_${item.material_name || ''}`;
    if (!materialStats[key]) {
      materialStats[key] = {
        name: item.material_name || '',
        spec: item.material_specification || '',
        unit: item.unit || item.material_unit || '',
        total: 0
      };
    }
    materialStats[key].total += parseFloat(item.quantity) || 0;
  }
  
  for (const key in materialStats) {
    const stat = materialStats[key];
    const categoryName = key.split('_')[0];
    statsData.push([
      categoryName,
      stat.name,
      stat.spec,
      String(stat.total), // Convert number to string for Excel
      stat.unit
    ]);
  }
  
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  statsSheet['!cols'] = [
    { wch: 15 }, // 材料類別
    { wch: 20 }, // 材料名稱
    { wch: 20 }, // 材料規格
    { wch: 12 }, // 總數量
    { wch: 10 }  // 單位
  ];
  
  // Apply styles to report statistics sheet
  const reportStatsTitleStyle = {
    font: { name: '標楷體', sz: 18, bold: true },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: 'D9E1F2' } }
  };
  applyCellStyle(statsSheet, 'A1', reportStatsTitleStyle);
  
  const reportStatsHeaderStyle = {
    font: { name: '微軟正黑體', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: '4472C4' } },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  };
  const reportStatsHeaderRow = 4;
  ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
    applyCellStyle(statsSheet, `${col}${reportStatsHeaderRow}`, reportStatsHeaderStyle);
  });
  
  const reportStatsDataStyle = {
    font: { name: '微軟正黑體', sz: 10 },
    alignment: { vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };
  for (let r = reportStatsHeaderRow + 1; r <= statsData.length; r++) {
    ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
      applyCellStyle(statsSheet, `${col}${r}`, reportStatsDataStyle);
    });
  }
  
  // Center align quantity column
  for (let r = reportStatsHeaderRow + 1; r <= statsData.length; r++) {
    const quantityStyle = {
      ...reportStatsDataStyle,
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    };
    applyCellStyle(statsSheet, `D${r}`, quantityStyle);
  }
  
  if (!statsSheet['!merges']) statsSheet['!merges'] = [];
  statsSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }); // Title
  
  // Set A4 page setup for report statistics sheet
  statsSheet['!margins'] = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
  };
  statsSheet['!pageSetup'] = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    scale: 100
  };
  
  XLSX.utils.book_append_sheet(workbook, statsSheet, '月統計');

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

// Generate report Excel (monthly or date range)
export async function generateReportExcel(requests: any[], startDate?: string, endDate?: string, companyName?: string, taxId?: string): Promise<Buffer> {
  const workbook = XLSX.utils.book_new();
  
  const company = companyName || process.env.COMPANY_NAME || '公司名稱';
  const taxIdNumber = taxId || process.env.COMPANY_TAX_ID || '統編：00000000';
  
  // Report header
  const reportData = [
    [company],
    ['統編：' + taxIdNumber],
    [],
    ['報表期間', startDate && endDate ? `${startDate} 至 ${endDate}` : (startDate ? `自 ${startDate}` : '全部資料')],
    ['報表日期', new Date().toLocaleString('zh-TW')],
    [],
    ['叫料單號', '建立日期', '工區', '施工類別', '材料類別', '材料名稱', '材料規格', '單位', '數量', '備註']
  ];

  // Add all request items
  for (const request of requests) {
    const workArea = request.work_area || request.construction_category_name || '';
    
    if (request.items && request.items.length > 0) {
      for (const item of request.items) {
        reportData.push([
          request.request_number,
          new Date(request.created_at).toLocaleDateString('zh-TW'),
          workArea,
          request.construction_category_name || '',
          item.material_category_name || '',
          item.material_name || '',
          item.material_specification || '',
          item.unit || item.material_unit || '',
          item.quantity,
          item.notes || ''
        ]);
      }
    } else {
      // If no items, still show request info
      reportData.push([
        request.request_number,
        new Date(request.created_at).toLocaleDateString('zh-TW'),
        workArea,
        request.construction_category_name || '',
        '',
        '',
        '',
        '',
        '',
        request.notes || ''
      ]);
    }
  }

  const reportSheet = XLSX.utils.aoa_to_sheet(reportData);

  // Set column widths optimized for A4
  reportSheet['!cols'] = [
    { wch: 18 }, // 叫料單號
    { wch: 12 }, // 建立日期
    { wch: 10 }, // 工區
    { wch: 12 }, // 施工類別
    { wch: 12 }, // 材料類別
    { wch: 16 }, // 材料名稱
    { wch: 14 }, // 材料規格
    { wch: 8 },  // 單位
    { wch: 10 }, // 數量
    { wch: 20 }  // 備註
  ];

  // Apply styles
  const reportCompanyStyle = {
    font: { name: '標楷體', sz: 24, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(reportSheet, 'A1', reportCompanyStyle);

  const reportTaxIdStyle = {
    font: { name: '標楷體', sz: 18, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(reportSheet, 'A2', reportTaxIdStyle);

  const reportHeaderStyle = {
    font: { name: '微軟正黑體', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: '4472C4' } },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  };
  const reportHeaderRow = 7;
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach((col) => {
    applyCellStyle(reportSheet, `${col}${reportHeaderRow}`, reportHeaderStyle);
  });

  const reportDataStyle = {
    font: { name: '微軟正黑體', sz: 9 },
    alignment: { vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };
  const numReportRows = reportData.length;
  for (let r = reportHeaderRow + 1; r <= numReportRows; r++) {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach((col) => {
      applyCellStyle(reportSheet, `${col}${r}`, reportDataStyle);
    });
  }

  // Merge cells for header
  if (!reportSheet['!merges']) reportSheet['!merges'] = [];
  reportSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }); // Company name
  reportSheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }); // Tax ID

  // Set A4 page setup
  reportSheet['!margins'] = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
  };
  reportSheet['!pageSetup'] = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    scale: 100
  };

  XLSX.utils.book_append_sheet(workbook, reportSheet, '報表');
  
  // Add monthly statistics sheet
  const statsData = [
    ['月統計'],
    ['統計期間', startDate && endDate ? `${startDate} 至 ${endDate}` : (startDate ? `自 ${startDate}` : '全部資料')],
    [],
    ['材料類別', '材料名稱', '材料規格', '總數量', '單位']
  ];
  
  // Group items by material and sum quantities
  const materialStats: { [key: string]: { name: string; spec: string; unit: string; total: number } } = {};
  for (const request of requests) {
    if (request.items && request.items.length > 0) {
      for (const item of request.items) {
        const key = `${item.material_category_name || ''}_${item.material_name || ''}_${item.material_specification || ''}`;
        if (!materialStats[key]) {
          materialStats[key] = {
            name: item.material_name || '',
            spec: item.material_specification || '',
            unit: item.unit || item.material_unit || '',
            total: 0
          };
        }
        materialStats[key].total += parseFloat(item.quantity) || 0;
      }
    }
  }
  
  for (const key in materialStats) {
    const stat = materialStats[key];
    const parts = key.split('_');
    const categoryName = parts[0];
    statsData.push([
      categoryName,
      stat.name,
      stat.spec,
      String(stat.total), // Convert number to string for Excel
      stat.unit
    ]);
  }
  
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  statsSheet['!cols'] = [
    { wch: 15 }, // 材料類別
    { wch: 20 }, // 材料名稱
    { wch: 20 }, // 材料規格
    { wch: 12 }, // 總數量
    { wch: 10 }  // 單位
  ];
  
  // Apply styles to report statistics sheet
  const reportStatsTitleStyle = {
    font: { name: '標楷體', sz: 18, bold: true },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: 'D9E1F2' } }
  };
  applyCellStyle(statsSheet, 'A1', reportStatsTitleStyle);
  
  const reportStatsHeaderStyle = {
    font: { name: '微軟正黑體', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    fill: { fgColor: { rgb: '4472C4' } },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  };
  const reportStatsHeaderRow = 4;
  ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
    applyCellStyle(statsSheet, `${col}${reportStatsHeaderRow}`, reportStatsHeaderStyle);
  });
  
  const reportStatsDataStyle = {
    font: { name: '微軟正黑體', sz: 10 },
    alignment: { vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    }
  };
  for (let r = reportStatsHeaderRow + 1; r <= statsData.length; r++) {
    ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
      applyCellStyle(statsSheet, `${col}${r}`, reportStatsDataStyle);
    });
  }
  
  // Center align quantity column
  for (let r = reportStatsHeaderRow + 1; r <= statsData.length; r++) {
    const quantityStyle = {
      ...reportStatsDataStyle,
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    };
    applyCellStyle(statsSheet, `D${r}`, quantityStyle);
  }
  
  if (!statsSheet['!merges']) statsSheet['!merges'] = [];
  statsSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }); // Title
  
  // Set A4 page setup for report statistics sheet
  statsSheet['!margins'] = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
  };
  statsSheet['!pageSetup'] = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    scale: 100
  };
  
  XLSX.utils.book_append_sheet(workbook, statsSheet, '月統計');

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
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

// Send email to multiple recipients
export async function sendEmail(options: {
  to: string | string[];
  subject?: string;
  request: any;
  excelBuffer?: Buffer;
  filename?: string;
}): Promise<void> {
  try {
    // Check required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      const missingVars = [];
      if (!process.env.SMTP_HOST) missingVars.push('SMTP_HOST');
      if (!process.env.SMTP_USER) missingVars.push('SMTP_USER');
      const errorMsg = `郵件服務未配置：缺少環境變數 ${missingVars.join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!process.env.SMTP_PASS) {
      console.warn('警告：SMTP_PASS 未設定，郵件發送可能會失敗');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Add timeout and connection options
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
    
    // Verify connection
    try {
      await transporter.verify();
      console.log('SMTP 連線驗證成功');
    } catch (verifyError: any) {
      console.error('SMTP 連線驗證失敗:', verifyError);
      
      // Provide specific error messages for common issues
      if (verifyError.code === 'EAUTH' || verifyError.responseCode === 535) {
        const isGmail = process.env.SMTP_HOST?.includes('gmail.com');
        if (isGmail) {
          throw new Error(
            'Gmail 認證失敗：\n' +
            '1. 請確認已啟用兩步驟驗證\n' +
            '2. 請使用「應用程式密碼」而非 Gmail 帳號密碼\n' +
            '3. 產生應用程式密碼：https://myaccount.google.com/apppasswords\n' +
            '4. 在 Render 環境變數中設定 SMTP_PASS 為 16 位應用程式密碼（不含空格）\n' +
            `原始錯誤：${verifyError.message || '未知錯誤'}`
          );
        } else {
          throw new Error(
            `SMTP 認證失敗：請檢查 SMTP_USER 和 SMTP_PASS 是否正確\n` +
            `原始錯誤：${verifyError.message || '未知錯誤'}`
          );
        }
      }
      
      throw new Error(`SMTP 連線失敗: ${verifyError.message || '無法連接到郵件伺服器'}`);
    }

    // Get material names for subject
    const materialNames = options.request.items
      .map((item: any) => item.material_name || '')
      .filter((name: string) => name)
      .join('、');
    
    // Generate subject: 材料申購＋物料名稱
    const subject = options.subject || `材料申購${materialNames ? ' - ' + materialNames : ''}`;

    // Email content
    let html = `
      <div style="font-family: 微軟正黑體, Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>感謝您的收信，以下是採購清單，如有疑問，請儘速與我聯繫。</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #4472C4;">叫料單資訊</h3>
      <p><strong>叫料單號：</strong>${options.request.request_number}</p>
      <p><strong>建立日期：</strong>${new Date(options.request.created_at).toLocaleString('zh-TW')}</p>
          <p><strong>工區：</strong>${options.request.work_area || '未指定'}</p>
          <p><strong>施工類別：</strong>${options.request.construction_category_name || '未指定'}</p>
      ${options.request.notes ? `<p><strong>備註：</strong>${options.request.notes}</p>` : ''}
        </div>
        
        <h3 style="color: #4472C4;">採購清單</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <thead>
            <tr style="background-color: #4472C4; color: white;">
              <th style="padding: 10px; text-align: left;">材料類別</th>
              <th style="padding: 10px; text-align: left;">材料名稱</th>
              <th style="padding: 10px; text-align: left;">材料規格</th>
              <th style="padding: 10px; text-align: right;">數量</th>
              <th style="padding: 10px; text-align: left;">單位</th>
              <th style="padding: 10px; text-align: left;">備註</th>
        </tr>
          </thead>
          <tbody>
    `;

    for (const item of options.request.items) {
      html += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;">${item.material_category_name || '-'}</td>
          <td style="padding: 8px;"><strong>${item.material_name || '-'}</strong></td>
          <td style="padding: 8px;">${item.material_specification || '-'}</td>
          <td style="padding: 8px; text-align: right;">${item.quantity}</td>
          <td style="padding: 8px;">${item.unit || item.material_unit || '-'}</td>
          <td style="padding: 8px;">${item.notes || '-'}</td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
        
        <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
          此郵件由叫料系統自動發送，請勿直接回覆。
        </p>
      </div>
    `;

    // Convert to array if single email
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    // Send email to all recipients
    for (const recipient of recipients) {
      // Format from address with display name (optional)
      let fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
      const displayName = process.env.SMTP_FROM_NAME; // Optional display name
      if (displayName) {
        fromAddress = `"${displayName}" <${fromAddress}>`;
      }

    const mailOptions: any = {
        from: fromAddress,
        to: recipient,
        subject: subject,
      html: html
    };

    if (options.excelBuffer) {
      mailOptions.attachments = [{
          filename: options.filename || `${options.request.request_number}.xlsx`,
        content: options.excelBuffer
      }];
    }

    await transporter.sendMail(mailOptions);
      console.log('郵件發送成功:', recipient);
    }
  } catch (error: any) {
    console.error('發送郵件失敗:', error);
    const errorMessage = error.message || '未知錯誤';
    const errorCode = error.code || 'UNKNOWN';
    console.error('錯誤詳情:', {
      code: errorCode,
      message: errorMessage,
      response: error.response?.data || '無回應資料',
      command: error.command || '無命令',
      responseCode: error.responseCode || '無回應碼'
    });
    throw new Error(`發送郵件失敗: ${errorMessage} (錯誤代碼: ${errorCode})`);
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

