// 測試 Excel 生成功能
const XLSX = require('xlsx');
const { query } = require('./dist/db/connection');
const { generateExcel } = require('./dist/services/notifications');
const fs = require('fs');
const path = require('path');

async function testExcelGeneration() {
  try {
    console.log('🔍 開始測試 Excel 生成功能...\n');

    // 1. 查詢最新的叫料單
    console.log('📋 查詢最新的叫料單...');
    const requestResult = await query(
      `SELECT 
        mr.*,
        cc.name as construction_category_name,
        u.name as user_name,
        u.email as user_email,
        c.name as company_name,
        c.tax_id as company_tax_id
      FROM material_requests mr
      LEFT JOIN construction_categories cc ON mr.construction_category_id = cc.id
      LEFT JOIN users u ON mr.user_id = u.id
      LEFT JOIN companies c ON mr.company_id = c.id
      ORDER BY mr.created_at DESC
      LIMIT 1`
    );

    if (requestResult.rows.length === 0) {
      console.log('❌ 沒有找到叫料單，請先建立一個叫料單');
      return;
    }

    const request = requestResult.rows[0];
    console.log(`✅ 找到叫料單: ${request.request_number}\n`);

    // 2. 查詢叫料單的材料項目
    console.log('📦 查詢材料項目...');
    const itemsResult = await query(
      `SELECT 
        mri.*,
        m.name as material_name,
        m.unit as material_unit,
        m.specification,
        mc.name as material_category_name
      FROM material_request_items mri
      LEFT JOIN materials m ON mri.material_id = m.id
      LEFT JOIN material_categories mc ON m.material_category_id = mc.id
      WHERE mri.request_id = $1
      ORDER BY mc.name, m.name`,
      [request.id]
    );

    request.items = itemsResult.rows;
    console.log(`✅ 找到 ${itemsResult.rows.length} 個材料項目\n`);

    // 3. 生成 Excel
    console.log('📊 生成 Excel 文件...');
    const excelBuffer = await generateExcel(request);
    console.log('✅ Excel 文件生成成功\n');

    // 4. 保存 Excel 文件
    const outputPath = path.join(__dirname, `test-${request.request_number}.xlsx`);
    fs.writeFileSync(outputPath, excelBuffer);
    console.log(`💾 Excel 文件已保存到: ${outputPath}\n`);

    // 5. 讀取並驗證 Excel 格式
    console.log('🔍 驗證 Excel 格式...');
    const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
    
    console.log(`\n📑 分頁列表: ${workbook.SheetNames.join(', ')}\n`);

    // 檢查第一個分頁（叫料單）
    if (workbook.SheetNames.includes('叫料單')) {
      const sheet = workbook.Sheets['叫料單'];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      
      console.log('📋 分頁1: 叫料單');
      console.log(`   總行數: ${data.length}`);
      
      if (data.length > 0) {
        console.log(`   欄位標題: ${data[0].join(', ')}`);
        console.log(`   欄位數量: ${data[0].length}`);
        
        if (data[0].length === 12) {
          console.log('   ✅ 欄位數量正確 (12欄位)');
        } else {
          console.log(`   ❌ 欄位數量錯誤，應該是12欄位，實際是${data[0].length}欄位`);
        }
        
        if (data.length > 1) {
          console.log(`   數據行數: ${data.length - 1}`);
          console.log(`   第一行數據: ${data[1].join(', ')}`);
        }
      }
      console.log('');
    }

    // 檢查第二個分頁（月份統計）
    const monthSheetName = workbook.SheetNames.find(name => /^\d{6}$/.test(name));
    if (monthSheetName) {
      const sheet = workbook.Sheets[monthSheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      
      console.log(`📊 分頁2: ${monthSheetName} (月份統計)`);
      console.log(`   總行數: ${data.length}`);
      
      if (data.length > 0) {
        console.log(`   欄位標題: ${data[0].join(', ')}`);
        if (data.length > 1) {
          console.log(`   數據行數: ${data.length - 1}`);
        }
      }
      console.log('');
    }

    console.log('✅ 測試完成！');
    console.log(`\n💡 請打開文件檢查: ${outputPath}`);

  } catch (error) {
    console.error('❌ 測試失敗:', error);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

testExcelGeneration();


