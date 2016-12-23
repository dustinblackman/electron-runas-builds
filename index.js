'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const electronRebuild = require('electron-rebuild');
const spawn = require('child_process').spawn;


function spawnAsync(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    proc.stdout.on('data', data => console.log(data.toString()));
    proc.stderr.on('data', data => console.log(data.toString()));
    proc.on('close', code => {
      if (code !== 0) return reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}}`));
      resolve();
    });
  });
}


const electron_version = process.argv[2];
const arch = process.argv[3];
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

fs.removeAsync('./build')
  .then(() => fs.mkdirsSync('./build'))
  .then(() => spawnAsync(npm, ['i', '--prefix', './build', `--arch=${arch}`, 'runas', `electron@${electron_version}`]))
  .then(() => electronRebuild.shouldRebuildNativeModules(require('./build/node_modules/electron')))
  .then(should_build => {
    if (!should_build) return;
    return electronRebuild.installNodeHeaders(electron_version, null, null, arch)
      .then(() => electronRebuild.rebuildNativeModules(electron_version, './build/node_modules', null, null, arch));
  })
  .then(() => fs.mkdirsAsync(`./compiled/${electron_version}/${process.platform}/${arch}`))
  .then(() => fs.copyAsync('./build/node_modules/runas/build/Release/runas.node', `./compiled/${electron_version}/${process.platform}/${arch}/runas.node`))
  .then(() => fs.removeAsync('./build'))
  .then(() => console.log(`Finished creating runas.node for Electron ${electron_version} on ${process.platform}.`));

