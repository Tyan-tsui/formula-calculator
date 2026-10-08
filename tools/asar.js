#!/usr/bin/env node
/**
 * app.asar 解包 / 打包工具（零依赖，只用 Node 内置模块）
 *
 * Electron 打包后把源码封进 resources/app.asar。想查看或修改里面的内容时用它：
 *
 *   解包：node tools/asar.js unpack "<安装目录>/resources/app.asar" ./unpacked
 *   打包：node tools/asar.js pack   ./unpacked "<安装目录>/resources/app.asar"
 *
 * 注意：替换 app.asar 前请先备份，并确保程序已关闭。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function readHeader(buf) {
  const headerSize = buf.readUInt32LE(4);
  const jsonLen = buf.readUInt32LE(12);
  const header = JSON.parse(buf.toString('utf8', 16, 16 + jsonLen));
  return { header, baseOffset: 8 + headerSize };
}

function unpack(asarPath, outDir) {
  const buf = fs.readFileSync(asarPath);
  const { header, baseOffset } = readHeader(buf);

  function walk(entry, rel) {
    if (entry.files) {
      fs.mkdirSync(rel, { recursive: true });
      for (const [name, child] of Object.entries(entry.files)) {
        walk(child, path.join(rel, name));
      }
    } else {
      const off = parseInt(entry.offset, 10);
      fs.mkdirSync(path.dirname(rel), { recursive: true });
      fs.writeFileSync(rel, buf.subarray(baseOffset + off, baseOffset + off + entry.size));
    }
  }

  walk(header, outDir);
  console.log('✅ 解包完成 ->', outDir);
}

function pack(srcDir, outPath) {
  const files = [];
  (function walk(dir, rel) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const r = path.posix.join(rel, name);
      if (fs.statSync(p).isDirectory()) walk(p, r);
      else files.push({ name: r, path: p });
    }
  })(srcDir, '');
  files.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  function integrity(buf) {
    const BLOCK = 4194304;
    const blocks = [];
    for (let i = 0; i < buf.length; i += BLOCK) {
      blocks.push(crypto.createHash('sha256').update(buf.subarray(i, i + BLOCK)).digest('base64'));
    }
    return {
      algorithm: 'SHA256',
      hash: crypto.createHash('sha256').update(buf).digest('hex'),
      blockSize: BLOCK,
      blocks
    };
  }

  let offset = 0;
  const headerFiles = {};
  const bufs = [];
  for (const f of files) {
    const buf = fs.readFileSync(f.path);
    headerFiles[f.name] = { size: buf.length, integrity: integrity(buf), offset: String(offset) };
    offset += buf.length;
    bufs.push(buf);
  }

  const jsonBuf = Buffer.from(JSON.stringify({ files: headerFiles }), 'utf8');
  const paddedInner = Math.ceil((4 + jsonBuf.length) / 4) * 4;
  const headerPickle = Buffer.alloc(4 + paddedInner);
  headerPickle.writeUInt32LE(paddedInner, 0);
  headerPickle.writeUInt32LE(jsonBuf.length, 4);
  jsonBuf.copy(headerPickle, 8);

  const sizePickle = Buffer.alloc(8);
  sizePickle.writeUInt32LE(4, 0);
  sizePickle.writeUInt32LE(headerPickle.length, 4);

  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, Buffer.concat([sizePickle, headerPickle, ...bufs]));
  console.log('✅ 打包完成 ->', outPath, `(${files.length} 个文件)`);
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'unpack' && a && b) unpack(a, b);
else if (cmd === 'pack' && a && b) pack(a, b);
else {
  console.log('用法:');
  console.log('  node tools/asar.js unpack <app.asar> <输出目录>');
  console.log('  node tools/asar.js pack   <源目录>  <app.asar>');
  process.exit(1);
}
