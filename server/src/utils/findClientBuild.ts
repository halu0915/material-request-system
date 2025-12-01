import path from 'path';
import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}


import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}

import fs from 'fs';

/**
 * Find client build directory by checking multiple possible paths
 */
export function findClientBuild(): string | null {
  // Calculate project root (assuming we're in server/dist/)
  const serverDistPath = __dirname; // server/dist/
  const serverPath = path.join(serverDistPath, '..'); // server/
  const projectRoot = path.join(serverPath, '..'); // project root
  
  // Possible paths to check
  const possiblePaths = [
    path.join(projectRoot, 'client', 'dist'), // project root/client/dist
    path.join(__dirname, '../../client/dist'), // server/dist/../../client/dist
    path.join(process.cwd(), 'client', 'dist'), // cwd/client/dist
    path.join(process.cwd(), '../client/dist'), // cwd/../client/dist
    path.resolve(__dirname, '../../client/dist'), // absolute path
    path.resolve(process.cwd(), 'client/dist'), // absolute from cwd
  ];
  
  console.log('🔍 尋找前端構建文件...');
  console.log('📁 服務器目錄 (__dirname):', __dirname);
  console.log('📁 服務器目錄 (server/):', serverPath);
  console.log('📁 項目根目錄 (計算):', projectRoot);
  console.log('📁 當前工作目錄 (process.cwd()):', process.cwd());
  console.log('');
  
  for (const possiblePath of possiblePaths) {
    const absPath = path.resolve(possiblePath);
    const indexPath = path.join(possiblePath, 'index.html');
    
    console.log(`🔍 檢查: ${absPath}`);
    
    try {
      if (fs.existsSync(possiblePath)) {
        const stats = fs.statSync(possiblePath);
        if (stats.isDirectory()) {
          console.log(`  ✓ 目錄存在`);
          
          if (fs.existsSync(indexPath)) {
            console.log(`  ✓ index.html 存在`);
            
            // Verify it's actually a frontend build
            try {
              const files = fs.readdirSync(possiblePath);
              const hasAssets = files.some(f => f === 'assets' || f === 'index.html');
              
              if (hasAssets) {
                console.log(`  ✅ ✅ ✅ 找到前端構建文件！`);
                console.log(`  📍 位置: ${absPath}`);
                console.log(`  📋 目錄內容:`, files.slice(0, 5));
                return possiblePath;
              }
            } catch (err: any) {
              console.log(`  ⚠️ 無法讀取目錄: ${err.message}`);
            }
          } else {
            console.log(`  ✗ index.html 不存在`);
            try {
              const files = fs.readdirSync(possiblePath).slice(0, 3);
              console.log(`  📋 目錄內容:`, files);
            } catch {}
          }
        } else {
          console.log(`  ✗ 不是目錄`);
        }
      } else {
        console.log(`  ✗ 不存在`);
      }
    } catch (error: any) {
      console.log(`  ❌ 檢查錯誤: ${error.message}`);
    }
    console.log('');
  }
  
  console.warn('⚠️  未找到前端構建文件！');
  return null;
}




