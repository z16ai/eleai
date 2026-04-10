const { readFileSync, readdirSync, statSync, existsSync } = require('fs');
const { join, extname, relative } = require('path');

const IGNORE_DIRS = ['node_modules', '.next', '.git', 'supabase', '.claude'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let issues = [];

function scanDirectory(dir, baseDir = dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch (e) {
    return;
  }
  
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry)) continue;
    
    const fullPath = join(dir, entry);
    const relativePath = relative(baseDir, fullPath);
    
    if (statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath, baseDir);
    } else {
      const ext = extname(entry);
      if (SCAN_EXTENSIONS.includes(ext)) {
        analyzeFile(fullPath, relativePath);
      }
    }
  }
}

function analyzeFile(filePath, relativePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  if (filePath.includes('/api/') && filePath.endsWith('/route.ts')) {
    checkApiAuth(content, relativePath);
  }
  
  checkSensitiveData(content, relativePath, lines);
  checkTypeSafety(content, relativePath, lines);
  checkErrorHandling(content, relativePath, lines);
  checkHardcodedValues(content, relativePath, lines);
  checkConsoleLog(content, relativePath, lines);
}

function checkApiAuth(content, file) {
  if (!content.includes('supabase') && !content.includes('auth')) {
    issues.push({
      severity: 'high',
      category: '安全',
      file,
      title: 'API 缺少用户认证检查',
      description: '此 API 路由未验证用户身份，任何人都可以调用',
      suggestion: '添加 Supabase 认证检查'
    });
  }
}

function checkSensitiveData(content, file, lines) {
  const patterns = [
    { pattern: /SERVICE_ROLE_KEY/i, name: 'SERVICE_ROLE_KEY' },
    { pattern: /AKIA[0-9A-Z]{16}/, name: 'AWS Access Key' },
  ];
  
  for (const { pattern, name } of patterns) {
    if (pattern.test(content)) {
      const lineNum = lines.findIndex(line => pattern.test(line)) + 1;
      issues.push({
        severity: 'high',
        category: '安全',
        file,
        line: lineNum,
        title: `可能的 ${name} 暴露`,
        description: '代码中可能包含硬编码的敏感密钥',
        suggestion: '将敏感信息移至环境变量'
      });
    }
  }
}

function checkTypeSafety(content, file, lines) {
  const typePatterns = [
    { pattern: / as any /g, name: 'as any' },
    { pattern: /@ts-ignore/g, name: '@ts-ignore' },
    { pattern: /: any\b/g, name: 'any 类型' },
  ];
  
  for (const { pattern, name } of typePatterns) {
    if (pattern.test(content)) {
      const lineNum = lines.findIndex(line => pattern.test(line)) + 1;
      issues.push({
        severity: 'medium',
        category: '代码质量',
        file,
        line: lineNum,
        title: `类型安全问题: ${name}`,
        description: '降低类型安全',
        suggestion: '定义完整的类型接口'
      });
    }
  }
}

function checkErrorHandling(content, file, lines) {
  if (content.includes('await ') && !content.includes('try') && !content.includes('catch')) {
    issues.push({
      severity: 'medium',
      category: '代码质量',
      file,
      title: '缺少错误处理',
      description: '异步操作没有 try-catch',
      suggestion: '添加 try-catch'
    });
  }
}

function checkHardcodedValues(content, file, lines) {
  const patterns = [
    { pattern: /APP_ID\s*=\s*['"][^'"]+['"]/, name: '硬编码 APP_ID' },
    { pattern: /appId:\s*['"][^'"]+['"]/, name: '硬编码 appId' },
  ];
  
  for (const { pattern, name } of patterns) {
    if (pattern.test(content)) {
      const lineNum = lines.findIndex(line => pattern.test(line)) + 1;
      issues.push({
        severity: 'medium',
        category: '代码质量',
        file,
        line: lineNum,
        title: name,
        description: '使用硬编码值',
        suggestion: '使用环境变量'
      });
    }
  }
}

function checkConsoleLog(content, file, lines) {
  const patterns = [
    { pattern: /console\.log\(/g, name: 'console.log' },
    { pattern: /console\.error\(/g, name: 'console.error' },
  ];
  
  for (const { pattern, name } of patterns) {
    if (pattern.test(content)) {
      const lineNum = lines.findIndex(line => pattern.test(line)) + 1;
      issues.push({
        severity: 'low',
        category: '最佳实践',
        file,
        line: lineNum,
        title: `存在 ${name}`,
        description: '生产代码应移除 console',
        suggestion: '使用日志库'
      });
    }
  }
}

function generateReport() {
  issues.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });
  
  const high = issues.filter(i => i.severity === 'high');
  const medium = issues.filter(i => i.severity === 'medium');
  const low = issues.filter(i => i.severity === 'low');
  
  console.log('\n📋 代码审查报告\n');
  console.log('='.repeat(50));
  
  if (high.length > 0) {
    console.log('\n🔴 高优先级 (' + high.length + ')\n');
    high.forEach(issue => {
      console.log(`  [${issue.category}] ${issue.title}`);
      console.log(`    文件: ${issue.file}`);
      console.log(`    问题: ${issue.description}`);
      if (issue.suggestion) console.log(`    建议: ${issue.suggestion}`);
      console.log('');
    });
  }
  
  if (medium.length > 0) {
    console.log('\n🟡 中优先级 (' + medium.length + ')\n');
    medium.forEach(issue => {
      console.log(`  [${issue.category}] ${issue.title}`);
      console.log(`    文件: ${issue.file}${issue.line ? ':' + issue.line : ''}`);
      console.log(`    问题: ${issue.description}`);
      if (issue.suggestion) console.log(`    建议: ${issue.suggestion}`);
      console.log('');
    });
  }
  
  if (low.length > 0) {
    console.log('\n🟢 低优先级 (' + low.length + ')\n');
    low.forEach(issue => {
      console.log(`  [${issue.category}] ${issue.title}`);
      console.log(`    文件: ${issue.file}${issue.line ? ':' + issue.line : ''}`);
      console.log(`    问题: ${issue.description}`);
      if (issue.suggestion) console.log(`    建议: ${issue.suggestion}`);
      console.log('');
    });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n总计: ${issues.length} 个问题 | 🔴 ${high.length} | 🟡 ${medium.length} | 🟢 ${low.length}\n`);
}

function main() {
  const targetDir = process.argv[2] || 'src';
  
  if (!existsSync(targetDir)) {
    console.error(`❌ 目录不存在: ${targetDir}`);
    process.exit(1);
  }
  
  console.log(`🔍 扫描: ${targetDir}`);
  scanDirectory(targetDir);
  generateReport();
}

main();
