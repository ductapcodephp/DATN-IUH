const fs = require('fs');
const path = require('path');

const rootPath = 'C:\\VsCode\\DATN\\backend-api\\resources\\js';
const pagesPath = path.join(rootPath, 'Pages');
const layoutsPath = path.join(rootPath, 'Layouts');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const stat = fs.statSync(filePath);
    
    // Inertia features
    const inertiaFeatures = [];
    if (content.includes('usePage')) inertiaFeatures.push('usePage');
    if (content.includes('useForm')) inertiaFeatures.push('useForm');
    if (content.includes('router.')) inertiaFeatures.push('router');
    if (content.includes('<Head')) inertiaFeatures.push('Head');
    if (content.includes('<Link')) inertiaFeatures.push('Link');
    
    // Props
    let props = [];
    const propsMatch = content.match(/function\s+\w+\s*\(\s*\{\s*([^}]+)\s*\}\s*\)/);
    if (propsMatch) {
        props = propsMatch[1].split(',').map(p => p.trim().split('=')[0].trim()).filter(Boolean);
    }
    const arrowPropsMatch = content.match(/const\s+\w+\s*=\s*\(\s*\{\s*([^}]+)\s*\}\s*\)\s*=>/);
    if (arrowPropsMatch) {
        props = [...new Set([...props, ...arrowPropsMatch[1].split(',').map(p => p.trim().split('=')[0].trim()).filter(Boolean)])];
    }
    
    // State Hooks
    const stateHooks = [];
    const hooks = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer'];
    hooks.forEach(hook => {
        if (content.includes(hook)) stateHooks.push(hook);
    });
    
    // Third party libs
    const thirdPartyLibs = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        if (!match[1].startsWith('.') && !match[1].startsWith('@/')) {
            thirdPartyLibs.push(match[1]);
        }
    }
    
    // Components imported
    const components = [];
    const compRegex = /import\s+(?:\{([^}]+)\}|([^,]+))(?:,\s*\{([^}]+)\})?\s+from\s+['"]@\/Components\/([^'"]+)['"]/g;
    let compMatch;
    while ((compMatch = compRegex.exec(content)) !== null) {
        components.push(compMatch[4]);
    }
    
    // Layout
    let layout = null;
    const layoutMatch = content.match(/\w+\.layout\s*=\s*(?:page\s*=>\s*<([^>]+)>|.* Layout=(?:\{([^}]+)\}|"([^"]+)")|.*<([A-Z]\w+Layout))/);
    if (layoutMatch) {
        layout = layoutMatch[1] || layoutMatch[2] || layoutMatch[3] || layoutMatch[4] || 'CustomLayout';
    } else {
        const layoutCompMatch = content.match(/<(?:Admin|Authenticated|CMS|Dashboard|Frontend|Guest|Seller)Layout/);
        if (layoutCompMatch) {
            layout = layoutCompMatch[0].substring(1);
        }
    }
    
    // API Calls
    const apiCalls = [];
    if (content.includes('axios.')) apiCalls.push('axios');
    if (content.includes('router.post')) apiCalls.push('router.post');
    if (content.includes('router.put')) apiCalls.push('router.put');
    if (content.includes('router.delete')) apiCalls.push('router.delete');
    if (content.includes('router.get')) apiCalls.push('router.get');
    if (content.includes('post(')) apiCalls.push('useForm.post');
    if (content.includes('put(')) apiCalls.push('useForm.put');
    if (content.includes('delete(')) apiCalls.push('useForm.delete');
    
    // Complex Logic
    const complexLogic = [];
    if (content.includes('.filter(')) complexLogic.push('filtering');
    if (content.includes('.sort(')) complexLogic.push('sorting');
    if (content.includes('.reduce(')) complexLogic.push('reducing');
    
    return {
        path: filePath.replace(rootPath, '').replace(/\\/g, '/'),
        size: stat.size,
        layout: layout || 'None',
        inertiaFeatures,
        props,
        stateHooks,
        thirdPartyLibs: [...new Set(thirdPartyLibs)],
        components: [...new Set(components)],
        apiCalls: [...new Set(apiCalls)],
        complexLogic: [...new Set(complexLogic)]
    };
}

const report = {
    pages: {},
    layouts: {},
    statistics: { totalPages: 0, totalLayouts: 0, byDomain: {} }
};

const pageFiles = [];
walkDir(pagesPath, (filePath) => {
    if (filePath.endsWith('.jsx')) pageFiles.push(filePath);
});

pageFiles.forEach(file => {
    const relPath = file.replace(pagesPath + path.sep, '');
    const parts = relPath.split(path.sep);
    const domain = parts.length > 1 ? parts[0] : 'Root';
    const pageName = parts[parts.length - 1].replace('.jsx', '');
    
    if (!report.pages[domain]) report.pages[domain] = {};
    report.pages[domain][pageName] = analyzeFile(file);
    
    report.statistics.totalPages++;
    report.statistics.byDomain[domain] = (report.statistics.byDomain[domain] || 0) + 1;
});

const layoutFiles = [];
walkDir(layoutsPath, (filePath) => {
    if (filePath.endsWith('.jsx')) layoutFiles.push(filePath);
});

layoutFiles.forEach(file => {
    const relPath = file.replace(layoutsPath + path.sep, '');
    const layoutName = relPath.replace('.jsx', '').replace(/\\/g, '/');
    
    report.layouts[layoutName] = analyzeFile(file);
    report.statistics.totalLayouts++;
});

fs.writeFileSync('C:\\VsCode\\DATN\\backend-api\\report.json', JSON.stringify(report, null, 2));
console.log('Report generated at C:\\VsCode\\DATN\\backend-api\\report.json');
