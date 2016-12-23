# electron-runas-builds

This project holds precompiled `runas.node` files to allow building cross platform electron apps on a single OS that use the [runas](https://github.com/atom/node-runas) module. It works by replacing `runas.node` in your `node_modules` directory with a prebuilt from this repo depending on the arch you're compiling for.

## Usage

A wget example on how to replace `runas.node`.

```sh
wget -O ./node_modules/runas/build/Release/runas.node https://raw.githubusercontent.com/dustinblackman/node-runas/master/compiled/1.4.13/win32/ia32/runas.node
```

## Add new electron version

Example of building for Electron 1.4.13 and arch ia32.

```sh
node index.js 1.4.13 ia32
```
