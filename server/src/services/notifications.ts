import XLSX from 'xlsx-js-style';
import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';

// Helper function to format datetime to minute (without seconds)
function formatDateTimeToMinute(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// Helper function to apply cell styles
function applyCellStyle(sheet: any, cellAddress: string, style: any) {
  if (!sheet[cellAddress]) {
    sheet[cellAddress] = { t: 's', v: '' };
  }
  sheet[cellAddress].s = style;
}

// Generate Excel file with company header and A4 formatting
export async function generateExcel(request: any, companyName?: string, taxId?: string, monthlyRequests?: any[]): Promise<Buffer> {
  try {
    // Validate request data
    if (!request) {
      throw new Error('請求資料為空');
    }
    if (!request.items || !Array.isArray(request.items) || request.items.length === 0) {
      throw new Error('請求項目為空或無效');
    }

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
    ['建立日期', formatDateTimeToMinute(request.created_at)],
    ['申請人', request.applicant_name || ''],
    ['聯繫電話', request.contact_phone || ''],
    ['送貨地址', request.delivery_address_name ? `${request.delivery_address_name} - ${request.delivery_address || ''}` : ''],
    ['狀態', request.status],
    [],
    // Table header (without image and link columns - they will be added vertically)
    ['工區', '施工類別', '材料類別', '材料名稱', '材料規格', '單位', '數量', '備註']
  ];

  // Add material items (images and links will be in separate worksheet ONLY)
  // IMPORTANT: Main sheet should NEVER contain image_url or link_url data
  // Helper function to sanitize and limit text length
  const sanitizeText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    // Remove any URLs
    let cleaned = String(text)
      .replace(/http[s]?:\/\/[^\s]+/gi, '')
      .replace(/www\.[^\s]+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    // Limit length
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength - 3) + '...';
    }
    return cleaned;
  };
  
  for (const item of request.items) {
    // Main item row - only include basic material info, NO image/link data at all
    // If item has image_url or link_url, completely ignore notes in main sheet
    // All image/link info will be in separate "圖片與連結" worksheet only
    const cleanNotes = (item.image_url || item.link_url) ? '' : sanitizeText(item.notes, 80);
    
    // Sanitize all text fields to prevent format issues
    // Main sheet data - ONLY 8 columns: 工區, 施工類別, 材料類別, 材料名稱, 材料規格, 單位, 數量, 備註
    // NO image_url, NO link_url columns - they are in separate worksheet
    mainData.push([
      sanitizeText(workArea, 20) || '',
      sanitizeText(request.construction_category_name, 30) || '',
      sanitizeText(item.material_category_name, 30) || '',
      sanitizeText(item.material_name, 40) || '',
      sanitizeText(item.material_specification, 30) || '',
      sanitizeText(item.unit || item.material_unit, 10) || '',
      Math.floor(parseFloat(String(item.quantity)) || 0),
      cleanNotes // Clean notes only, no image/link references, max 80 chars
    ]);
  }

  const mainSheet = XLSX.utils.aoa_to_sheet(mainData);

  // Set column widths optimized for A4 (portrait) - balanced for readability
  mainSheet['!cols'] = [
    { wch: 12 }, // 工區 (increased)
    { wch: 14 }, // 施工類別 (increased)
    { wch: 14 }, // 材料類別 (increased)
    { wch: 20 }, // 材料名稱 (increased)
    { wch: 16 }, // 材料規格 (increased)
    { wch: 9 },  // 單位 (increased)
    { wch: 10 }, // 數量 (increased)
    { wch: 24 }  // 備註
  ];

  // Set row heights - optimized for A4 one page, larger for readability
  const rowHeights: any[] = [
    { hpt: 32 }, // Company name row
    { hpt: 26 }, // Tax ID row
    { hpt: 6 },  // Empty row
    { hpt: 22 }, // 叫料單號 row
    { hpt: 22 }, // 建立日期 row
    { hpt: 22 }, // 申請人 row
    { hpt: 22 }, // 聯繫電話 row
    { hpt: 24 }, // 送貨地址 row (same height as other info rows, slightly taller for address)
    { hpt: 22 }, // 狀態 row
    { hpt: 6 },  // Empty row
    { hpt: 26 }  // Header row
  ];
  
  // Add row heights for data rows - larger for readability
  // Each item has only 1 main row (images/links are in separate worksheet)
  for (let i = 0; i < request.items.length; i++) {
    rowHeights.push({ hpt: 20 }); // Main item row
  }
  
  mainSheet['!rows'] = rowHeights;

  // Apply styles to cells - optimized for A4 printing with larger, clearer text
  // Company name - Large, bold, centered (適中偏大)
  const companyStyle = {
    font: { name: '標楷體', sz: 28, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(mainSheet, 'A1', companyStyle);

  // Tax ID - Large, bold, centered (適中偏大)
  const taxIdStyle = {
    font: { name: '標楷體', sz: 20, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(mainSheet, 'A2', taxIdStyle);

  // Request info labels - Bold, larger font (適中偏大)
  const labelStyle = {
    font: { name: '微軟正黑體', sz: 12, bold: true },
    alignment: { vertical: 'center', wrapText: false },
    fill: { fgColor: { rgb: 'F0F0F0' } }
  };
  const valueStyle = {
    font: { name: '微軟正黑體', sz: 12 },
    alignment: { vertical: 'center', wrapText: false }
  };
  
  // Apply styles to all info rows (including delivery address - same as phone)
  for (let i = 3; i <= 8; i++) {
    applyCellStyle(mainSheet, `A${i + 1}`, labelStyle);
    if (i === 6) {
      // Merge B7 to H7 for delivery address value to show full address
      if (!mainSheet['!merges']) mainSheet['!merges'] = [];
      mainSheet['!merges'].push({ s: { r: 6, c: 1 }, e: { r: 6, c: 7 } }); // Merge B7:H7
      applyCellStyle(mainSheet, 'B7', valueStyle);
    } else {
      applyCellStyle(mainSheet, `B${i + 1}`, valueStyle);
    }
  }

  // Table header - Bold, centered, with background (適中偏大)
  const headerStyle = {
    font: { name: '微軟正黑體', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { fgColor: { rgb: '4472C4' } },
    border: {
      top: { style: 'medium', color: { rgb: '000000' } },
      bottom: { style: 'medium', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  };
  const headerRow = 10; // Row index 9 (0-based) = row 10
  const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  headerCols.forEach((col, idx) => {
    applyCellStyle(mainSheet, `${col}${headerRow}`, headerStyle);
  });

  // Data rows - Normal style with borders (適中偏大)
  // CRITICAL: wrapText MUST be false for ALL cells to prevent format issues
  const dataStyle = {
    font: { name: '微軟正黑體', sz: 11 },
    alignment: { vertical: 'center', horizontal: 'left', wrapText: false },
    border: {
      top: { style: 'thin', color: { rgb: '666666' } },
      bottom: { style: 'thin', color: { rgb: '666666' } },
      left: { style: 'thin', color: { rgb: '666666' } },
      right: { style: 'thin', color: { rgb: '666666' } }
    }
  };
  
  // Special style for notes column - ensure no wrapping
  const notesStyle = {
    font: { name: '微軟正黑體', sz: 11 },
    alignment: { vertical: 'center', horizontal: 'left', wrapText: false },
    border: {
      top: { style: 'thin', color: { rgb: '666666' } },
      bottom: { style: 'thin', color: { rgb: '666666' } },
      left: { style: 'thin', color: { rgb: '666666' } },
      right: { style: 'thin', color: { rgb: '666666' } }
    }
  };
  
  const numRows = mainData.length;
  let currentRow = headerRow + 1;
  
  // Apply styles to all data rows - ensure NO wrapping for ANY cell
  for (let i = headerRow + 1; i < mainData.length; i++) {
    // Regular data row - apply styles to each column
    headerCols.forEach((col, colIndex) => {
      if (colIndex === headerCols.length - 1) {
        // Last column (備註) - use notesStyle
        applyCellStyle(mainSheet, `${col}${currentRow}`, notesStyle);
      } else if (col === 'F' || col === 'G') {
        // Unit and Quantity columns - center aligned
        const centerStyle = {
          ...dataStyle,
          alignment: { horizontal: 'center', vertical: 'center', wrapText: false }
        };
        applyCellStyle(mainSheet, `${col}${currentRow}`, centerStyle);
      } else {
        // Other columns - use dataStyle
        applyCellStyle(mainSheet, `${col}${currentRow}`, dataStyle);
      }
    });
    currentRow++;
  }
  
  // Double-check: Ensure ALL cells in data rows have wrapText: false
  // This is a critical step to prevent any format issues
  for (let r = headerRow + 1; r <= numRows; r++) {
    headerCols.forEach((col) => {
      const cellAddress = `${col}${r}`;
      const cell = mainSheet[cellAddress];
      if (cell) {
        // Force wrapText to false at the cell level
        if (!cell.s) cell.s = {};
        if (!cell.s.alignment) cell.s.alignment = {};
        cell.s.alignment.wrapText = false;
        cell.s.alignment.vertical = 'center';
        if (col === 'F' || col === 'G') {
          cell.s.alignment.horizontal = 'center';
        } else {
          cell.s.alignment.horizontal = 'left';
        }
      }
    });
  }

  // Merge cells for company header
  if (!mainSheet['!merges']) mainSheet['!merges'] = [];
  mainSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }); // Company name (span all 8 columns)
  mainSheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }); // Tax ID (span all 8 columns)

  // Set A4 page setup (portrait) - optimized for printing
  mainSheet['!margins'] = {
    left: 0.5,    // Reduced margins for more content space
    right: 0.5,
    top: 0.5,
    bottom: 0.5,
    header: 0.3,
    footer: 0.3
  };
  mainSheet['!pageSetup'] = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,  // Fit to 1 page wide
    fitToHeight: 0, // Auto height (fit all content)
    scale: 100,     // 100% scale for clear printing
    horizontalDpi: 600,
    verticalDpi: 600
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
  
  // Group items by material name and quantity - only accumulate items with same material name AND quantity
  const materialStats: { [key: string]: { name: string; spec: string; unit: string; quantity: number; count: number } } = {};
  
  // Use monthlyRequests if provided, otherwise fall back to current request only
  const requestsToProcess = monthlyRequests && monthlyRequests.length > 0 ? monthlyRequests : [request];
  
  for (const req of requestsToProcess) {
    if (req.items && req.items.length > 0) {
      for (const item of req.items) {
        // Use material_name and quantity as key - only items with same name AND quantity will be grouped
        const quantity = parseFloat(item.quantity) || 0;
        const key = `${item.material_name || ''}_${quantity}`;
        
        if (!materialStats[key]) {
          materialStats[key] = {
            name: item.material_name || '',
            spec: item.material_specification || '',
            unit: item.unit || item.material_unit || '',
            quantity: quantity,
            count: 0
          };
        }
        // Count how many times this material with this quantity appears
        materialStats[key].count += 1;
      }
    }
  }
  
  for (const key in materialStats) {
    const stat = materialStats[key];
    // Calculate total quantity: quantity per item * number of occurrences
    const totalQuantity = stat.quantity * stat.count;
    
    // Get material category from the first matching item
    // We need to find the category from the original items
    let categoryName = '';
    for (const req of requestsToProcess) {
      if (req.items && req.items.length > 0) {
        for (const item of req.items) {
          const itemQuantity = parseFloat(item.quantity) || 0;
          if (item.material_name === stat.name && itemQuantity === stat.quantity) {
            categoryName = item.material_category_name || '';
            break;
          }
        }
        if (categoryName) break;
      }
    }
    
    statsData.push([
      categoryName,
      stat.name,
      stat.spec,
      String(Math.floor(totalQuantity)), // Total quantity: quantity per item * count (integer only)
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
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
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
    alignment: { vertical: 'center', wrapText: false },
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
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false }
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
  let buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  // Add images and links to a new worksheet using ExcelJS
  buffer = await addImagesToExcel(buffer, request);
  
  return buffer;
}

// Helper function to download image from URL or local path
async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  try {
    // If it's a local path (starts with /api/uploads/)
    if (imageUrl.startsWith('/api/uploads/')) {
      const filename = imageUrl.replace('/api/uploads/', '');
      const uploadsDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(uploadsDir, filename);
      
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath);
      }
    }
    
    // If it's a full URL, download it with timeout
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const response = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        timeout: 10000, // 10 second timeout
        maxContentLength: 10 * 1024 * 1024, // 10MB max
        validateStatus: (status) => status === 200
      });
      return Buffer.from(response.data);
    }
    
    return null;
  } catch (error: any) {
    console.error('下載圖片失敗:', imageUrl, error.message || error);
    return null;
  }
}

// Add images and links to a new worksheet in Excel file
async function addImagesToExcel(excelBuffer: Buffer, request: any): Promise<Buffer> {
  try {
    // Check if there are any items with images or links
    const hasImagesOrLinks = request.items && request.items.some((item: any) => item.image_url || item.link_url);
    
    if (!hasImagesOrLinks) {
      // No images or links, return original buffer
      return excelBuffer;
    }
    
    let workbook: ExcelJS.Workbook;
    try {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(Buffer.isBuffer(excelBuffer) ? excelBuffer as Buffer : Buffer.from(excelBuffer as any));
    } catch (loadError: any) {
      console.error('載入 Excel buffer 失敗:', loadError.message || loadError);
      // Return original buffer if load fails
      return excelBuffer;
    }
    
    // Create a new worksheet for images and links
    let imagesSheet: ExcelJS.Worksheet;
    try {
      imagesSheet = workbook.addWorksheet('圖片與連結');
    } catch (sheetError: any) {
      console.error('創建工作表失敗:', sheetError.message || sheetError);
      // Return original buffer if sheet creation fails
      return excelBuffer;
    }
    
    // Set column widths - optimized for image display
    imagesSheet.getColumn(1).width = 20; // 材料名稱
    imagesSheet.getColumn(2).width = 15; // 材料規格
    imagesSheet.getColumn(3).width = 60; // 圖片 (wider for better image display)
    imagesSheet.getColumn(4).width = 50; // 連結
    
    // Add header row
    const headerRow = imagesSheet.getRow(1);
    headerRow.values = ['材料名稱', '材料規格', '圖片', '連結'];
    headerRow.font = { name: '微軟正黑體', size: 12, bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 26;
    
    // Add borders to header
    ['A1', 'B1', 'C1', 'D1'].forEach((cellAddress) => {
      const cell = imagesSheet.getCell(cellAddress);
      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    let currentRow = 2;
    
    // Process each item with individual error handling
    for (const item of request.items || []) {
      try {
        if (item.image_url || item.link_url) {
          const row = imagesSheet.getRow(currentRow);
          
          // Material name
          row.getCell(1).value = item.material_name || '';
          row.getCell(1).font = { name: '微軟正黑體', size: 11 };
          row.getCell(1).alignment = { vertical: 'top', wrapText: true };
          
          // Material specification
          row.getCell(2).value = item.material_specification || '';
          row.getCell(2).font = { name: '微軟正黑體', size: 11 };
          row.getCell(2).alignment = { vertical: 'top', wrapText: true };
          
          // Image - handle errors individually with optimized sizing
          if (item.image_url) {
            try {
              const imageBuffer = await downloadImage(item.image_url);
              
              if (imageBuffer) {
                // Determine image extension
                let imageExtension = 'png';
                if (item.image_url.toLowerCase().endsWith('.jpg') || item.image_url.toLowerCase().endsWith('.jpeg')) {
                  imageExtension = 'jpeg';
                } else if (item.image_url.toLowerCase().endsWith('.gif')) {
                  imageExtension = 'gif';
                }
                
                try {
                  // Calculate optimal image size based on column width
                  // Column width 60 characters ≈ 450 pixels at 96 DPI
                  // We'll use a maximum width of 400 pixels and maintain aspect ratio
                  const maxWidth = 400; // pixels
                  const maxHeight = 300; // pixels
                  
                  // Get image dimensions (basic check - we'll use a reasonable default)
                  // Note: For more accurate sizing, we'd need to parse image headers
                  // For now, we'll use a standard thumbnail size that fits well
                  let imageWidth = maxWidth;
                  let imageHeight = maxHeight;
                  
                  // Try to get actual image dimensions from buffer
                  // This is a simplified approach - for production, use a proper image library
                  try {
                    // Basic PNG header parsing for dimensions
                    if (imageExtension === 'png' && imageBuffer.length >= 24) {
                      const width = imageBuffer.readUInt32BE(16);
                      const height = imageBuffer.readUInt32BE(20);
                      if (width > 0 && height > 0) {
                        const aspectRatio = width / height;
                        if (aspectRatio > 1) {
                          // Landscape
                          imageWidth = Math.min(maxWidth, width);
                          imageHeight = Math.round(imageWidth / aspectRatio);
                        } else {
                          // Portrait or square
                          imageHeight = Math.min(maxHeight, height);
                          imageWidth = Math.round(imageHeight * aspectRatio);
                        }
                      }
                    } else if (imageExtension === 'jpeg' && imageBuffer.length >= 20) {
                      // JPEG dimensions are more complex, use default for now
                      // In production, use a library like 'image-size' or 'sharp'
                      // For now, use standard thumbnail size
                    }
                  } catch (dimError) {
                    // If dimension parsing fails, use defaults
                    console.log('無法解析圖片尺寸，使用預設大小');
                  }
                  
                  // Add image to workbook
                  const imageId = workbook.addImage({
                    buffer: imageBuffer instanceof Buffer ? imageBuffer : Buffer.from(imageBuffer),
                    extension: imageExtension as 'png' | 'jpeg' | 'gif'
                  });
                  
                  // Insert image in column C (index 2) with optimized size
                  // ExcelJS addImage uses pixels directly for ext parameter
                  imagesSheet.addImage(imageId, {
                    tl: { col: 2, row: currentRow - 1 },
                    ext: { width: imageWidth, height: imageHeight }
                  });
                  
                  // Set row height to accommodate image (convert pixels to points)
                  // Excel row height is in points: 1 point = 1/72 inch ≈ 1.33 pixels at 96 DPI
                  // Add padding for better visual appearance
                  const rowHeightPoints = Math.max(120, Math.round(imageHeight / 1.33) + 30);
                  row.height = Math.min(rowHeightPoints, 400); // Cap at 400 points
                  
                  // Center align the image cell
                  row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
                } catch (imageError: any) {
                  console.error('嵌入圖片失敗:', item.image_url, imageError.message || imageError);
                  // Fallback to hyperlink if image embedding fails
                  row.getCell(3).value = {
                    text: item.image_url,
                    hyperlink: item.image_url
                  };
                  row.getCell(3).font = { name: '微軟正黑體', size: 10, color: { argb: 'FF0066CC' }, underline: true };
                  row.getCell(3).alignment = { vertical: 'top', wrapText: true };
                }
              } else {
                // If image download fails, add hyperlink text
                row.getCell(3).value = {
                  text: item.image_url,
                  hyperlink: item.image_url
                };
                row.getCell(3).font = { name: '微軟正黑體', size: 10, color: { argb: 'FF0066CC' }, underline: true };
                row.getCell(3).alignment = { vertical: 'top', wrapText: true };
              }
            } catch (imageError: any) {
              console.error('處理圖片失敗:', item.image_url, imageError.message || imageError);
              // Add hyperlink as fallback
              row.getCell(3).value = {
                text: item.image_url,
                hyperlink: item.image_url
              };
              row.getCell(3).font = { name: '微軟正黑體', size: 10, color: { argb: 'FF0066CC' }, underline: true };
              row.getCell(3).alignment = { vertical: 'top', wrapText: true };
            }
          }
          
          // Link
          if (item.link_url) {
            try {
              row.getCell(4).value = {
                text: item.link_url,
                hyperlink: item.link_url
              };
              row.getCell(4).font = { name: '微軟正黑體', size: 10, color: { argb: 'FF0066CC' }, underline: true };
              row.getCell(4).alignment = { vertical: 'top', wrapText: true };
            } catch (linkError: any) {
              console.error('添加連結失敗:', item.link_url, linkError.message || linkError);
              // Just add text if hyperlink fails
              row.getCell(4).value = item.link_url;
              row.getCell(4).font = { name: '微軟正黑體', size: 10, color: { argb: 'FF0066CC' } };
            }
          }
          
          // Add borders to data row
          ['A', 'B', 'C', 'D'].forEach((col) => {
            const cell = row.getCell(col);
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF666666' } },
              bottom: { style: 'thin', color: { argb: 'FF666666' } },
              left: { style: 'thin', color: { argb: 'FF666666' } },
              right: { style: 'thin', color: { argb: 'FF666666' } }
            };
          });
          
          currentRow++;
        }
      } catch (itemError: any) {
        console.error('處理材料項目失敗:', item.material_name, itemError.message || itemError);
        // Continue with next item
        continue;
      }
    }
    
    // Generate buffer
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
    } catch (writeError: any) {
      console.error('寫入 Excel buffer 失敗:', writeError.message || writeError);
      // Return original buffer if write fails
      return excelBuffer;
    }
  } catch (error: any) {
    console.error('添加圖片到 Excel 失敗:', error.message || error, error.stack);
    // Return original buffer if image addition fails
    return excelBuffer;
  }
}

// Generate HTML template for PDF
function generatePDFHTML(request: any, companyName?: string, taxId?: string): string {
  const company = companyName || process.env.COMPANY_NAME || '公司名稱';
  const taxIdNumber = taxId || process.env.COMPANY_TAX_ID || '統編：00000000';
  const workArea = request.work_area || request.construction_category_name || '';
  
  const now = new Date(request.created_at);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Group items by material for statistics
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

  // Helper function to clean notes (remove image/link references)
  const cleanNotes = (notes: string | null | undefined, item?: any): string => {
    if (!notes) return '';
    let cleaned = notes;
    // Remove image URL from notes if present
    if (item?.image_url && cleaned.includes(item.image_url)) {
      cleaned = cleaned.replace(item.image_url, '').trim();
    }
    // Remove link URL from notes if present
    if (item?.link_url && cleaned.includes(item.link_url)) {
      cleaned = cleaned.replace(item.link_url, '').trim();
    }
    // Remove common image/link text patterns
    cleaned = cleaned.replace(/圖片[:：]?/gi, '').trim();
    cleaned = cleaned.replace(/連結[:：]?/gi, '').trim();
    cleaned = cleaned.replace(/圖片連結[:：]?/gi, '').trim();
    return cleaned;
  };

  let itemsHTML = '';
  request.items.forEach((item: any, index: number) => {
    itemsHTML += `
      <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${workArea}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${request.construction_category_name || ''}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.material_category_name || ''}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.material_name || ''}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.material_specification || ''}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.unit || item.material_unit || ''}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${Math.floor(parseFloat(item.quantity) || 0)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${cleanNotes(item.notes, item)}</td>
      </tr>
      ${(item.image_url || item.link_url) ? `
      <tr style="background-color: #f0f8ff;">
        <td colspan="9" style="padding: 8px; border: 1px solid #ddd; font-size: 9px; color: #0066cc;">
          ${item.image_url ? `圖片：<a href="${item.image_url}" style="color: #0066cc;">${item.image_url}</a>` : ''}
          ${item.image_url && item.link_url ? ' | ' : ''}
          ${item.link_url ? `連結：<a href="${item.link_url}" style="color: #0066cc;">${item.link_url}</a>` : ''}
        </td>
      </tr>
      ` : ''}
    `;
  });

  let statsHTML = '';
  Object.keys(materialStats).forEach((key) => {
    const stat = materialStats[key];
    const categoryName = key.split('_')[0];
    statsHTML += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${categoryName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${stat.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${stat.spec}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${Math.floor(stat.total)}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${stat.unit}</td>
      </tr>
    `;
  });

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>叫料單 - ${request.request_number}</title>
  <style>
    @page {
      size: A4;
      margin: 1cm;
    }
    body {
      font-family: 'Microsoft YaHei', '微軟正黑體', 'SimHei', '黑體', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .tax-id {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 2px solid #4472C4;
      padding-bottom: 5px;
    }
    .info-item {
      margin: 5px 0;
      padding-left: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10px;
    }
    th {
      background-color: #4472C4;
      color: white;
      padding: 10px;
      text-align: center;
      border: 1px solid #000;
      font-weight: bold;
    }
    td {
      padding: 8px;
      border: 1px solid #666;
    }
    .page-break {
      page-break-before: always;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">${company}</div>
    <div class="tax-id">${taxIdNumber}</div>
  </div>

  <div class="section">
    <div class="section-title">叫料單資訊</div>
    <div class="info-item">叫料單號：${request.request_number}</div>
    <div class="info-item">建立日期：${formatDateTimeToMinute(request.created_at)}</div>
    <div class="info-item">申請人：${request.applicant_name || ''}</div>
    <div class="info-item">聯繫電話：${request.contact_phone || ''}</div>
    <div class="info-item">送貨地址：${request.delivery_address_name ? `${request.delivery_address_name} - ${request.delivery_address || ''}` : ''}</div>
    <div class="info-item">狀態：${request.status || 'pending'}</div>
  </div>

  <div class="section">
    <div class="section-title">材料項目</div>
    <table>
      <thead>
        <tr>
          <th style="width: 5%;">序號</th>
          <th style="width: 10%;">工區</th>
          <th style="width: 12%;">施工類別</th>
          <th style="width: 12%;">材料類別</th>
          <th style="width: 15%;">材料名稱</th>
          <th style="width: 12%;">材料規格</th>
          <th style="width: 8%;">單位</th>
          <th style="width: 8%;">數量</th>
          <th style="width: 18%;">備註</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
  </div>

  <div class="section page-break">
    <div class="section-title">月統計</div>
    <div style="text-align: center; margin-bottom: 15px; font-size: 14px;">
      統計月份：${year}年${month}月
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">材料類別</th>
          <th style="width: 25%;">材料名稱</th>
          <th style="width: 25%;">材料規格</th>
          <th style="width: 15%;">總數量</th>
          <th style="width: 15%;">單位</th>
        </tr>
      </thead>
      <tbody>
        ${statsHTML}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
}

// Generate PDF using Puppeteer (preferred method for Chinese support)
async function generatePDFWithPuppeteer(request: any, companyName?: string, taxId?: string): Promise<Buffer> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    const html = generatePDFHTML(request, companyName, taxId);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

// Generate PDF file with same content as Excel
// Try Puppeteer first (supports Chinese), fallback to PDFKit with font registration
export async function generatePDF(request: any, companyName?: string, taxId?: string): Promise<Buffer> {
  // Try Puppeteer first (best Chinese support)
  try {
    console.log('嘗試使用 Puppeteer 生成 PDF...');
    return await generatePDFWithPuppeteer(request, companyName, taxId);
  } catch (puppeteerError) {
    console.warn('Puppeteer 生成 PDF 失敗，嘗試使用 PDFKit:', puppeteerError);
    
    // Fallback to PDFKit with Chinese font registration
    return generatePDFWithPDFKit(request, companyName, taxId);
  }
}

// Generate PDF using PDFKit with Chinese font support
async function generatePDFWithPDFKit(request: any, companyName?: string, taxId?: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        autoFirstPage: true
      });

      // Try to register Chinese font if available
      let chineseFont: string | null = null;
      try {
        // Try to find and register wqy-zenhei font
        const fontPaths = [
          '/usr/share/fonts/wqy-zenhei/wqy-zenhei.ttc',
          '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc',
          '/System/Library/Fonts/STHeiti Light.ttc',
          path.join(__dirname, '../fonts/wqy-zenhei.ttc'),
          path.join(__dirname, '../fonts/wqy-zenhei.ttf')
        ];

        for (const fontPath of fontPaths) {
          if (fs.existsSync(fontPath)) {
            doc.registerFont('ChineseFont', fontPath);
            chineseFont = 'ChineseFont';
            console.log(`已註冊中文字體: ${fontPath}`);
            break;
          }
        }
      } catch (fontError) {
        console.warn('無法註冊中文字體，將使用預設字體:', fontError);
      }

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Get company info
      const company = companyName || process.env.COMPANY_NAME || '公司名稱';
      const taxIdNumber = taxId || process.env.COMPANY_TAX_ID || '統編：00000000';
      const workArea = request.work_area || request.construction_category_name || '';

      // Use Chinese font if available, otherwise use Helvetica
      const fontFamily = chineseFont || 'Helvetica';
      const boldFontFamily = chineseFont || 'Helvetica-Bold';

      // Company header - center aligned
      doc.fontSize(24)
         .font(boldFontFamily)
         .text(company, { align: 'center' });
      
      doc.moveDown(0.5);
      doc.fontSize(18)
         .font(boldFontFamily)
         .text(taxIdNumber, { align: 'center' });
      
      doc.moveDown(1.5);

      // Request info section
      doc.fontSize(12)
         .font(boldFontFamily)
         .text('叫料單資訊', { underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(10)
         .font(fontFamily);

      // Format info items - use Chinese labels but ensure UTF-8 encoding
      const infoItems = [
        ['叫料單號', request.request_number],
        ['建立日期', formatDateTimeToMinute(request.created_at)],
        ['申請人', request.applicant_name || ''],
        ['聯繫電話', request.contact_phone || ''],
        ['送貨地址', request.delivery_address_name ? `${request.delivery_address_name} - ${request.delivery_address || ''}` : ''],
        ['狀態', request.status || 'pending']
      ];

      infoItems.forEach(([label, value]) => {
        // Ensure text is properly encoded
        const text = `${label}：${value}`;
        doc.text(text, { indent: 20 });
      });

      doc.moveDown(1.5);

      // Materials section - simplified list format
      doc.fontSize(12)
         .font(boldFontFamily)
         .text('材料項目', { underline: true });
      
      doc.moveDown(0.5);

      // Display items in a clean list format
      let itemNumber = 1;
      for (const item of request.items) {
        doc.fontSize(10)
           .font(boldFontFamily)
           .text(`項目 ${itemNumber}：`, { indent: 20 });
        
        doc.moveDown(0.3);
        doc.fontSize(9)
           .font(fontFamily)
           .text(`  工區：${workArea}`, { indent: 30 })
           .text(`  施工類別：${request.construction_category_name || ''}`, { indent: 30 })
           .text(`  材料類別：${item.material_category_name || ''}`, { indent: 30 })
           .text(`  材料名稱：${item.material_name || ''}`, { indent: 30 })
           .text(`  材料規格：${item.material_specification || ''}`, { indent: 30 })
           .text(`  數量：${Math.floor(parseFloat(item.quantity) || 0)} ${item.unit || item.material_unit || ''}`, { indent: 30 });
        
        // Clean notes before displaying (remove image/link references)
        if (item.notes) {
          let cleanNotes = item.notes;
          // Remove image URL from notes if present
          if (item.image_url && cleanNotes.includes(item.image_url)) {
            cleanNotes = cleanNotes.replace(item.image_url, '').trim();
          }
          // Remove link URL from notes if present
          if (item.link_url && cleanNotes.includes(item.link_url)) {
            cleanNotes = cleanNotes.replace(item.link_url, '').trim();
          }
          // Remove common image/link text patterns
          cleanNotes = cleanNotes.replace(/圖片[:：]?/gi, '').trim();
          cleanNotes = cleanNotes.replace(/連結[:：]?/gi, '').trim();
          cleanNotes = cleanNotes.replace(/圖片連結[:：]?/gi, '').trim();
          
          if (cleanNotes) {
            doc.text(`  備註：${cleanNotes}`, { indent: 30 });
          }
        }
        
        if (item.image_url) {
          doc.fillColor('#0066CC')
             .text(`  圖片：${item.image_url}`, { indent: 30, link: item.image_url });
          doc.fillColor('#000000');
        }
        
        if (item.link_url) {
          doc.fillColor('#0066CC')
             .text(`  連結：${item.link_url}`, { indent: 30, link: item.link_url });
          doc.fillColor('#000000');
        }
        
        doc.moveDown(0.5);
        itemNumber++;

        // Check if we need a new page
        if (doc.y > 700) {
          doc.addPage();
        }
      }

      // Monthly statistics section
      doc.addPage();
      doc.fontSize(18)
         .font(boldFontFamily)
         .text('月統計', { align: 'center' });
      
      doc.moveDown(1);
      
      const now = new Date(request.created_at);
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      doc.fontSize(12)
         .font(fontFamily)
         .text(`統計月份：${year}年${month}月`, { align: 'center' });
      
      doc.moveDown(1);

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

      // Display statistics
      doc.fontSize(10)
         .font(boldFontFamily)
         .text('統計摘要：', { indent: 20 });
      
      doc.moveDown(0.5);
      doc.fontSize(9)
         .font(fontFamily);

      for (const key in materialStats) {
        const stat = materialStats[key];
        const categoryName = key.split('_')[0];
        const summaryText = `${categoryName} - ${stat.name} (${stat.spec})：${Math.floor(stat.total)} ${stat.unit}`;
        doc.text(`  ${summaryText}`, { indent: 30 });
        doc.moveDown(0.3);
        
        if (doc.y > 750) {
          doc.addPage();
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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

  // Helper function to clean notes (remove image/link references)
  const cleanNotes = (notes: string | null | undefined, item?: any): string => {
    if (!notes) return '';
    let cleaned = notes;
    // Remove image URL from notes if present
    if (item?.image_url && cleaned.includes(item.image_url)) {
      cleaned = cleaned.replace(item.image_url, '').trim();
    }
    // Remove link URL from notes if present
    if (item?.link_url && cleaned.includes(item.link_url)) {
      cleaned = cleaned.replace(item.link_url, '').trim();
    }
    // Remove common image/link text patterns
    cleaned = cleaned.replace(/圖片[:：]?/gi, '').trim();
    cleaned = cleaned.replace(/連結[:：]?/gi, '').trim();
    cleaned = cleaned.replace(/圖片連結[:：]?/gi, '').trim();
    return cleaned;
  };

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
          Math.floor(parseFloat(item.quantity) || 0),
      cleanNotes(item.notes, item) // Clean notes, no image/link text
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
        cleanNotes(request.notes) // Clean notes
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
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(reportSheet, 'A1', reportCompanyStyle);

  const reportTaxIdStyle = {
    font: { name: '標楷體', sz: 18, bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { fgColor: { rgb: 'FFFFFF' } }
  };
  applyCellStyle(reportSheet, 'A2', reportTaxIdStyle);

  const reportHeaderStyle = {
    font: { name: '微軟正黑體', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
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
    alignment: { vertical: 'center', wrapText: false },
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
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
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
    alignment: { vertical: 'center', wrapText: false },
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
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false }
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

    // Helper function to clean notes (remove image/link references)
    const cleanNotes = (notes: string | null | undefined, item?: any): string => {
      if (!notes) return '-';
      let cleaned = notes;
      // Remove image URL from notes if present
      if (item?.image_url && cleaned.includes(item.image_url)) {
        cleaned = cleaned.replace(item.image_url, '').trim();
      }
      // Remove link URL from notes if present
      if (item?.link_url && cleaned.includes(item.link_url)) {
        cleaned = cleaned.replace(item.link_url, '').trim();
      }
      // Remove common image/link text patterns
      cleaned = cleaned.replace(/圖片[:：]?/gi, '').trim();
      cleaned = cleaned.replace(/連結[:：]?/gi, '').trim();
      cleaned = cleaned.replace(/圖片連結[:：]?/gi, '').trim();
      return cleaned || '-';
    };

    for (const item of options.request.items) {
      html += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;">${item.material_category_name || '-'}</td>
          <td style="padding: 8px;"><strong>${item.material_name || '-'}</strong></td>
          <td style="padding: 8px;">${item.material_specification || '-'}</td>
          <td style="padding: 8px; text-align: right;">${Math.floor(parseFloat(item.quantity) || 0)}</td>
          <td style="padding: 8px;">${item.unit || item.material_unit || '-'}</td>
          <td style="padding: 8px;">${cleanNotes(item.notes, item)}</td>
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

    // Add attachments (Excel only)
    const attachments: any[] = [];

    if (options.excelBuffer) {
      const excelFilename = options.filename || `${options.request.request_number}.xlsx`;
      attachments.push({
        filename: excelFilename,
        content: options.excelBuffer
      });
    }
    
    if (attachments.length > 0) {
      mailOptions.attachments = attachments;
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
      message += `- ${item.material_category_name || ''} | ${item.material_name || ''} | 數量：${Math.floor(parseFloat(item.quantity) || 0)} ${item.unit || item.material_unit || ''}\n`;
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

