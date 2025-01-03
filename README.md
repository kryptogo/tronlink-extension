# TronLink  

TronLink is firstly launched at TRON’s official website and backed by TRON foundation, TronLink is the TRON wallet with the most users, coming in three versions (Chrome Wallet Extension/iOS/Android), and you're looking at the Chrome Wallet Extension for TRON.   

Main functions:    

Sending and receiving TRX, TRC10 and TRC20 tokens;  
Smart contract calls integrated;    

## KG Compile

如果遇到 node 版本问题，可以设置 NODE_OPTIONS 为 --openssl-legacy-provider
```sh
export NODE_OPTIONS=--openssl-legacy-provider
```

compile
```sh
$ yarn build:core
```

override in flutter 
```sh
$ cp dist/pageHook.js path/to/kg-wallet-app/assets/js/tron_link/pageHook.js
```

## Downloads
**Chrome** &ndash; [Download](https://chrome.google.com/webstore/detail/ibnejdfjmmkpcnlpebklmnkoeoihofec) &nbsp; [![Chrome Web Store](https://img.shields.io/chrome-web-store/d/ogffaloegjglncjfehdfplabnoondfjo.svg?style=flat-square)](https://chrome.google.com/webstore/detail/ibnejdfjmmkpcnlpebklmnkoeoihofec) &nbsp; [![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/ogffaloegjglncjfehdfplabnoondfjo.svg?style=flat-square)](https://chrome.google.com/webstore/detail/ibnejdfjmmkpcnlpebklmnkoeoihofec)


## Installation

#### Install yarn
**https://yarnpkg.com/en/docs/install**

#### Install dependencies
```sh
$ yarn install
```

## Building
```sh
# Build all sources
$ yarn build
```

```sh
# Build the backend, along with the injected page script
$ yarn build:core
```

```sh
# Build only the popup component
$ yarn build:popup
```

## Linting
```sh
# Run linter over the ./packages folder
$ yarn lint
```

## Links
+ [Website](https://www.tronlink.org/)
+ [Support](https://t.me/tronlink)
+ [Twitter](https://twitter.com/TronLinkWallet)