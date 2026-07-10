import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.version, '1.0.1');
assert.ok(manifest.permissions.includes('storage'));
assert.ok(manifest.permissions.includes('downloads'));
assert.ok(manifest.host_permissions.includes('https://api.chzzk.naver.com/*'));

const backgroundSource = fs.readFileSync('background.js', 'utf8');
assert.ok(!backgroundSource.includes('chatData: chatData'));

const context = vm.createContext({
    Blob,
    TextEncoder,
    URL,
    chrome: {
        runtime: {
            onMessage: {
                addListener() {},
            },
        },
    },
    console,
    setTimeout,
});
vm.runInContext(backgroundSource, context);
assert.equal(vm.runInContext('formatElapsedTime(0)', context), '00:00:00.000');
assert.equal(vm.runInContext('formatElapsedTime(5430123)', context), '01:30:30.123');

console.log('extension validation passed');
