// ignore eslint
/* eslint-disable */

import EventChannel from '@tronlink/lib/EventChannel';
import Logger from '@tronlink/lib/logger';
import TronWeb from 'tronweb';
//import SunWeb from 'sunweb';

import { CONTRACT_ADDRESS, NODE, SIDE_CHAIN_ID } from '@tronlink/lib/constants';
import Utils from '@tronlink/lib/utils';
import ProxiedProvider from './handlers/ProxiedProvider';
import RequestHandler from './handlers/RequestHandler';
import SunWeb from './SunWeb';
// import SunWeb from './SunWeb/js-sdk/src/index';

const logger = new Logger('pageHook');

const pageHook = {
  proxiedMethods: {
    setAddress: false,
    sign: false,
  },

  init() {
    console.log('[PageHook] Starting initialization');
    this._bindTronWeb();
    this._bindEventChannel();
    this._bindEvents();

    console.log('[PageHook] Sending init request');
    this.request('init')
      .then((response) => {
        console.log('[PageHook] Init response:', response);
        const { address, node, name, type, phishingList } = response;

        if (address) {
          console.log('[PageHook] Setting address:', { address, name, type });
          this.setAddress({ address, name, type });
        }

        if (node.fullNode) {
          console.log('[PageHook] Setting node:', node);
          this.setNode(node);
        }

        console.log('[PageHook] TronLink initiated');
        const href = window.location.origin;
        const c = phishingList.filter(({ url }) => {
          const reg = new RegExp(url);
          return href.match(reg);
        });
        if (c.length && !c[0].isVisit)
          window.location = `https://www.tronlink.org/phishing.html?href=${href}`;
      })
      .catch((err) => {
        console.error('[PageHook] Init error:', err);
        logger.error('Failed to initialise TronWeb', err);
      });
  },

  _bindTronWeb() {
    if (window.tronWeb !== undefined) {
      logger.warn(
        'TronWeb is already initiated. TronLink will overwrite the current instance'
      );
    }

    if (!window.flutter_inappwebview)
      logger.info('Waiting for Flutter WebView bridge injection...');

    window.tronLink = {
      ready: true,
      request: (request) => {
        console.log('Request to Flutter:', request);
        return new Promise((resolve, reject) => {
          if (
            window.flutter_inappwebview &&
            window.flutter_inappwebview.callHandler
          ) {
            window.flutter_inappwebview
              .callHandler('tronlink_configure', request)
              .then((response) => {
                console.log('Response from Flutter:', response);
                resolve(response);
              })
              .catch((error) => {
                console.error('Error forwarding request to Flutter:', error);
                reject(error);
              });
          } else {
            const error = 'Flutter WebView bridge not available';
            console.warn(error);
            reject(new Error(error));
          }
        });
      },
      tronWeb: null,
    };

    const tronWeb = new TronWeb(
      new ProxiedProvider(),
      new ProxiedProvider(),
      new ProxiedProvider()
    );

    const tronWeb1 = new TronWeb(
      new ProxiedProvider(),
      new ProxiedProvider(),
      new ProxiedProvider()
    );

    const tronWeb2 = new TronWeb(
      new ProxiedProvider(),
      new ProxiedProvider(),
      new ProxiedProvider()
    );
    const sunWeb = new SunWeb(
      tronWeb1,
      tronWeb2,
      //{fullNode:'https://api.trongrid.io',solidityNode:'https://api.trongrid.io',eventServer:'https://api.trongrid.io'},
      //{fullNode:'https://sun.tronex.io',solidityNode:'https://sun.tronex.io',eventServer:'https://sun.tronex.io'},
      //{fullNode:'http://47.252.84.158:8070',solidityNode:'http://47.252.84.158:8071',eventServer:'http://47.252.81.14:8070'},
      //{fullNode:'http://47.252.85.90:8070',solidityNode:'http://47.252.85.90:8071',eventServer:'http://47.252.87.129:8070'},
      CONTRACT_ADDRESS.MAIN,
      CONTRACT_ADDRESS.SIDE,
      SIDE_CHAIN_ID
    );

    tronWeb.extension = {}; //add a extension object for black list
    tronWeb.extension.setVisited = (href) => {
      this.setVisited(href);
    };
    this.proxiedMethods = {
      setAddress: tronWeb.setAddress.bind(tronWeb),
      setMainAddress: sunWeb.mainchain.setAddress.bind(sunWeb.mainchain),
      setSideAddress: sunWeb.sidechain.setAddress.bind(sunWeb.sidechain),
      sign: tronWeb.trx.sign.bind(tronWeb),
    };

    [
      'setPrivateKey',
      'setAddress',
      'setFullNode',
      'setSolidityNode',
      'setEventServer',
    ].forEach((method) => {
      tronWeb[method] = () => new Error('TronLink has disabled this method');
      sunWeb.mainchain[method] = () =>
        new Error('TronLink has disabled this method');
      sunWeb.sidechain[method] = () =>
        new Error('TronLink has disabled this method');
    });

    tronWeb.trx.sign = (...args) => this.sign(...args);

    sunWeb.mainchain.trx.sign = (...args) => this.sign(...args);
    sunWeb.sidechain.trx.sign = (...args) => this.sign(...args);

    //     // Proxy transactionBuilder methods
    //     const originalTrx = tronWeb.transactionBuilder;
    //     tronWeb.transactionBuilder = new Proxy(originalTrx, {
    //       get(target, prop) {
    //         console.log('[Proxy] TransactionBuilder method accessed:', prop);
    //
    //         if (typeof target[prop] === 'function') {
    //           return async (...args) => {
    //             if (
    //               window.flutter_inappwebview &&
    //               window.flutter_inappwebview.callHandler
    //             ) {
    //               try {
    //                 console.log(
    //                   `[Proxy] Forwarding ${prop} to Flutter with args:`,
    //                   args
    //                 );
    //                 const response = await window.flutter_inappwebview.callHandler(
    //                   'tronlink_transaction',
    //                   {
    //                     method: prop,
    //                     params: args,
    //                   }
    //                 );
    //                 console.log(
    //                   `[Proxy] Response from Flutter for ${prop}:`,
    //                   response
    //                 );
    //                 return response;
    //               } catch (error) {
    //                 console.error(
    //                   `[Proxy] Error in transactionBuilder.${prop}:`,
    //                   error
    //                 );
    //                 throw error;
    //               }
    //             }
    //             console.log(
    //               `[Proxy] Flutter bridge not available, using original ${prop}`
    //             );
    //             return target[prop](...args);
    //           };
    //         }
    //         return target[prop];
    //       },
    //     });

    window.tronLink.tronWeb = tronWeb;
    window.tronWeb = tronWeb;
    window.tron = tronWeb;
    window.sunWeb = sunWeb;
  },

  _bindEventChannel() {
    console.log('[PageHook] Binding event channel');
    this.eventChannel = new EventChannel('pageHook');
    this.request = RequestHandler.init(this.eventChannel);
    console.log('[PageHook] Event channel bound');
  },

  _bindEvents() {
    console.log('[PageHook] Binding events');
    this.eventChannel.on('setAccount', (address) => this.setAddress(address));

    this.eventChannel.on('setNode', (node) => this.setNode(node));
  },

  setAddress({ address, name, type }) {
    // logger.info('TronLink: New address configured');
    if (!tronWeb.isAddress(address)) {
      tronWeb.defaultAddress = {
        hex: false,
        base58: false,
      };
      tronWeb.ready = false;
    } else {
      this.proxiedMethods.setAddress(address);
      this.proxiedMethods.setMainAddress(address);
      this.proxiedMethods.setSideAddress(address);
      tronWeb.defaultAddress.name = name;
      tronWeb.defaultAddress.type = type;
      sunWeb.mainchain.defaultAddress.name = name;
      sunWeb.mainchain.defaultAddress.type = type;
      sunWeb.sidechain.defaultAddress.name = name;
      sunWeb.sidechain.defaultAddress.type = type;
      tronWeb.ready = true;
    }
  },

  setNode(node) {
    tronWeb.fullNode.configure(node.fullNode);
    tronWeb.solidityNode.configure(node.solidityNode);
    tronWeb.eventServer.configure(node.eventServer);

    sunWeb.mainchain.fullNode.configure(NODE.MAIN.fullNode);
    sunWeb.mainchain.solidityNode.configure(NODE.MAIN.solidityNode);
    sunWeb.mainchain.eventServer.configure(NODE.MAIN.eventServer);

    sunWeb.sidechain.fullNode.configure(NODE.SIDE.fullNode);
    sunWeb.sidechain.solidityNode.configure(NODE.SIDE.solidityNode);
    sunWeb.sidechain.eventServer.configure(NODE.SIDE.eventServer);
  },

  setVisited(href) {
    this.request('setVisited', {
      href,
    })
      .then((res) => res)
      .catch((err) => {
        logger.error('Failed to set visit:', err);
      });
  },

  sign(
    transaction,
    privateKey = false,
    useTronHeader = true,
    callback = false
  ) {
    if (Utils.isFunction(privateKey)) {
      callback = privateKey;
      privateKey = false;
    }

    if (Utils.isFunction(useTronHeader)) {
      callback = useTronHeader;
      useTronHeader = true;
    }

    if (!callback) {
      return Utils.injectPromise(
        this.sign.bind(this),
        transaction,
        privateKey,
        useTronHeader
      );
    }

    if (privateKey) {
      return this.proxiedMethods.sign(
        transaction,
        privateKey,
        useTronHeader,
        callback
      );
    }

    if (!transaction) return callback('Invalid transaction provided');

    if (!tronWeb.ready) return callback('User has not unlocked wallet');
    this.request('sign', {
      transaction,
      useTronHeader,
      input:
        typeof transaction === 'string'
          ? transaction
          : transaction.__payload__ ||
            transaction.raw_data.contract[0].parameter.value,
    })
      .then((transaction) => callback(null, transaction))
      .catch((err) => {
        logger.error('Failed to sign transaction:', err);
        callback(err);
      });
  },
};

pageHook.init();
