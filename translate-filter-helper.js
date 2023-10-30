  
  // 将待翻译json文件转换为xlsx文件,中文为key,英文/日文为value，方便翻译人员进行校对
  const fs = require('fs');
  const XLSX = require('xlsx');
  
  // 函数：遍历对象，提取叶子节点的值
  function extractLeafValues(obj, path = '') {
    let leafValues = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
  
        // 构建当前路径
        const currentPath = path ? `${path}.${key}` : key;
  
        if (typeof value === 'object' && value !== null) {
          // 递归处理嵌套的对象
          const nestedLeafValues = extractLeafValues(value, currentPath);
          leafValues = leafValues.concat(nestedLeafValues);
        } else {
          // 叶子节点的值作为新对象的键值对
          leafValues.push({ zh: value, ja: currentPath });
        }
      }
    }
    
    return leafValues;
  }
  // 读取 xxx.zh-cn.js 文件
const zhData = require('./2.code-recommand.zh-cn.ts');

// 读取 xxx.ja.js 文件
const jaData = require('./2.code-recommand.ja.ts');
  // 创建一个新的行数据数组
const rows = [];

// 遍历 xxx.zh-cn.js 的数据，并将叶子节点的值作为新对象的键值对
const leafValues = extractLeafValues(zhData);
for (const { zh, ja } of leafValues) {
  // 使用 xxx.ja.js 对应路径的值作为新对象的值
  const cellValue = ja.split('.').reduce((obj, k) => obj[k], jaData);
  rows.push({ zh, ja: cellValue });
}

// 创建工作簿和工作表
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(rows);

// 将工作表添加到工作簿
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// 将工作簿写入 Excel 文件
XLSX.writeFile(workbook, 'output-code-recommand.xlsx');

console.log('转换完成');