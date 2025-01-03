/* eslint-disable */

import Logger from '@tronlink/lib/logger';
import TronWeb from 'tronweb';

const { HttpProvider } = TronWeb.providers;
const logger = new Logger('ProxiedProvider');

class ProxiedProvider extends HttpProvider {
  constructor() {
    super('http://127.0.0.1');
    this.ready = true;
    this.queue = [];
  }

  async request(endpoint, payload = {}, method = 'get') {
    // 將所有請求轉發給 Flutter
    console.log('endpoint', endpoint);
    console.log('payload', payload);
    console.log('method', method);
    try {
      const response = await window.flutter_inappwebview.callHandler(
        'tronlink_provider',
        {
          endpoint,
          payload,
          method,
        }
      );

      console.log('response', response);

      // 保持原有的 __payload__ 屬性定義
      if (response) {
        const result = response.transaction || response;
        Object.defineProperty(result, '__payload__', {
          writable: false,
          enumerable: false,
          configurable: false,
          value: payload,
        });
        return response;
      }

      throw new Error('Empty response from provider');
    } catch (error) {
      throw new Error(`Provider request failed: ${error.message}`);
    }
  }

  // 保留 configure 方法但改為通知 Flutter
  configure(url) {
    console.log('Request URL to Flutter:', url);
    window.flutter_inappwebview.callHandler('tronlink_configure', { url });
    this.host = url;
  }
}

export default ProxiedProvider;
