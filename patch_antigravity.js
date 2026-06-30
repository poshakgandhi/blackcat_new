const fs = require('fs');
const path = require('path');

const PATCH_MARKER = '/*BA:autorun*/';

function analyzeFile(content, label) {
    const searchStr = 'setTerminalAutoExecutionPolicy';
    const index = content.indexOf(searchStr);
    if (index === -1) {
        console.log(`  ❌ [${label}] Could not find '${searchStr}' string`);
        return null;
    }
    
    const windowStart = Math.max(0, index - 2000);
    const windowEnd = Math.min(content.length, index + 2000);
    const windowContent = content.substring(windowStart, windowEnd);
    
    let onChangeRe = /(\w+)=(\w+)\((\w+)=>\{(\w+)\?\.setTerminalAutoExecutionPolicy\?\.\(\3\),\3===(\w+)\.EAGER&&(\w+)\(!0\)\},\[/;
    let match = onChangeRe.exec(windowContent);
    
    let isNewVersion = false;
    let enumAlias, confirmFn, handlerAlias;
    let insertAt;
    
    if (!match) {
        onChangeRe = /(\w+)=(\w+)\((\w+)=>\{if\(\3!==(\w+)\.EAGER[^}]*?\{(\w+)\?\.setTerminalAutoExecutionPolicy\?\.\(\3\),\3===\4\.EAGER&&(\w+)\(!0\);return\}/;
        match = onChangeRe.exec(windowContent);
        if (match) {
            isNewVersion = true;
            enumAlias = match[4];
            handlerAlias = match[5];
            confirmFn = match[6];
        }
    } else {
        enumAlias = match[5];
        handlerAlias = match[4];
        confirmFn = match[6];
    }
    
    if (!match) {
        console.log(`  ❌ [${label}] Could not find onChange handler pattern in the search window`);
        return null;
    }
    
    const fullMatch = match[0];
    const matchIndex = windowStart + match.index;
    
    console.log(`  📋 [${label}] Found onChange at offset ${matchIndex} (New format: ${isNewVersion})`);
    console.log(`     enum=${enumAlias}, confirm=${confirmFn}, handler=${handlerAlias}`);
    
    const contextStart = Math.max(0, matchIndex - 600);
    const contextEnd = matchIndex;
    const context = content.substring(contextStart, contextEnd);
    
    let policyVar, secureVar;
    if (isNewVersion) {
        const policyRe = new RegExp(`(\\w+)=[^=]*?\\b${handlerAlias}\\?\\.terminalAutoExecutionPolicy\\b[^=]*?\\b${enumAlias}\\.OFF`);
        const policyMatch = policyRe.exec(context);
        if (!policyMatch) {
            console.log(`  ❌ [${label}] Could not find policy variable (new format)`);
            return null;
        }
        policyVar = policyMatch[1];
        
        const secureRe = new RegExp(`(\\w+)=\\b${handlerAlias}\\?\\.secureModeEnabled\\?\\?!1`);
        const secureMatch = secureRe.exec(context);
        if (!secureMatch) {
            console.log(`  ❌ [${label}] Could not find secureMode variable (new format)`);
            return null;
        }
        secureVar = secureMatch[1];
    } else {
        const policyMatch = /(\w+)=\w+\?\.terminalAutoExecutionPolicy\?\?(\w+)\.OFF/.exec(context);
        if (!policyMatch) {
            console.log(`  ❌ [${label}] Could not find policy variable`);
            return null;
        }
        policyVar = policyMatch[1];
        
        const secureMatch = /(\w+)=\w+\?\.secureModeEnabled\?\?!1/.exec(context);
        if (!secureMatch) {
            console.log(`  ❌ [${label}] Could not find secureMode variable`);
            return null;
        }
        secureVar = secureMatch[1];
    }
    
    console.log(`     policyVar=${policyVar}`);
    console.log(`     secureVar=${secureVar}`);
    
    let useEffectAlias;
    const declMatch = content.match(/useEffect:\(\)=>(\w+)/);
    if (declMatch) {
        useEffectAlias = declMatch[1];
    } else {
        const candidates = {};
        const freqRe = /\b(\w{1,4})\(\(\)=>\{/g;
        let m;
        while ((m = freqRe.exec(context)) !== null) {
            const fn = m[1];
            if (fn !== confirmFn && !/^(var|let|for|new|if)$/.test(fn)) {
                candidates[fn] = (candidates[fn] || 0) + 1;
            }
        }
        const freqBest = Object.entries(candidates).sort((a, b) => b[1] - a[1])[0];
        useEffectAlias = freqBest ? freqBest[0] : null;
    }
    
    if (!useEffectAlias) {
        console.log(`  ❌ [${label}] Could not determine useEffect alias`);
        return null;
    }
    console.log(`     useEffect=${useEffectAlias}`);
    
    const insertPos = matchIndex + fullMatch.length;
    const afterOnChange = content.indexOf('])', insertPos);
    if (afterOnChange === -1) return null;
    const chainSemicolon = content.indexOf(';', afterOnChange);
    if (chainSemicolon === -1) return null;
    insertAt = chainSemicolon + 1;
    
    return { enumAlias, confirmFn, policyVar, secureVar, useEffectAlias, insertAt };
}

function patchFile(filePath, label) {
    if (!fs.existsSync(filePath)) {
        console.log(`  ❌ [${label}] File not found: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(PATCH_MARKER)) {
        console.log(`  ⏭️  [${label}] Already patched`);
        return true;
    }

    const analysis = analyzeFile(content, label);
    if (!analysis) {
        return false;
    }

    const { enumAlias, confirmFn, policyVar, secureVar, useEffectAlias, insertAt } = analysis;
    const patch = `${PATCH_MARKER}${useEffectAlias}(()=>{${policyVar}===${enumAlias}.EAGER&&!${secureVar}&&${confirmFn}(!0)},[]);`;

    const bak = filePath + '.ba-backup';
    if (!fs.existsSync(bak)) {
        fs.copyFileSync(filePath, bak);
        console.log(`  📦 [${label}] Backup created`);
    }

    content = content.substring(0, insertAt) + patch + content.substring(insertAt);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ [${label}] Patched (+${patch.length} bytes)`);
    return true;
}

function revertFile(filePath, label) {
    const bak = filePath + '.ba-backup';
    if (!fs.existsSync(bak)) {
        console.log(`  ⏭️  [${label}] No backup for ${label}, skipping`);
        return;
    }
    fs.copyFileSync(bak, filePath);
    fs.unlinkSync(bak);
    console.log(`  ✅ [${label}] Restored`);
}

function checkFile(filePath, label) {
    if (!fs.existsSync(filePath)) {
        console.log(`  ❌ [${label}] Not found`);
        return false;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const patched = content.includes(PATCH_MARKER);
    const hasBak = fs.existsSync(filePath + '.ba-backup');

    if (patched) {
        console.log(`  ✅ [${label}] PATCHED` + (hasBak ? ' (backup exists)' : ''));
    } else {
        const analysis = analyzeFile(content, label);
        if (analysis) {
            console.log(`  ⬜ [${label}] NOT PATCHED (patchable)`);
        } else {
            console.log(`  ⚠️  [${label}] NOT PATCHED (pattern not found — may be incompatible)`);
        }
    }
    return patched;
}

function main() {
    const args = process.argv.slice(2);
    const action = args.includes('--revert') ? 'revert' : args.includes('--check') ? 'check' : 'apply';
    
    const basePath = '/usr/share/antigravity';
    
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║  Antigravity "Always Proceed" Auto-Run Fix       ║');
    console.log('║  (Custom patch for IDE 1.23.2+ internet warning) ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log(`📍 Path: ${basePath}`);
    console.log(`🎬 Action: ${action.toUpperCase()}\n`);

    const files = [
        { path: path.join(basePath, 'resources', 'app', 'out', 'vs', 'workbench', 'workbench.desktop.main.js'), label: 'workbench' },
        { path: path.join(basePath, 'resources', 'app', 'out', 'jetskiAgent', 'main.js'), label: 'jetskiAgent' }
    ];

    switch (action) {
        case 'check':
            files.forEach(f => checkFile(f.path, f.label));
            break;
        case 'revert':
            files.forEach(f => revertFile(f.path, f.label));
            console.log('\n✨ Restored original files. Restart Antigravity.');
            break;
        case 'apply':
            const ok = files.every(f => patchFile(f.path, f.label));
            console.log(ok
                ? '\n✨ Successfully patched! Restart Antigravity.\n💡 Run with --revert to undo.'
                : '\n⚠️  Some patches failed.');
            break;
    }
}

main();
