/* eslint-disable */

class RequestHandler {
  static init(eventChannel) {
    console.log('[RequestHandler] Initialized');
    return async (type, data = {}) => {
      console.log('[RequestHandler] Request:', { type, data });

      // 直接使用 flutter_inappwebview bridge
      if (
        !window.flutter_inappwebview ||
        !window.flutter_inappwebview.callHandler
      ) {
        console.error('[RequestHandler] Flutter bridge not available');
        throw new Error('Flutter bridge not available');
      }

      try {
        console.log('[RequestHandler] Calling Flutter bridge...');
        console.log(
          '[RequestHandler] Sending request data:',
          JSON.stringify(data, null, 2)
        );

        const response = await window.flutter_inappwebview.callHandler(
          'tronlink_request',
          {
            type,
            data,
          }
        );

        console.log(
          '[RequestHandler] Flutter response:',
          JSON.stringify(response, null, 2)
        );

        if (!response) {
          console.error('[RequestHandler] Empty response from Flutter');
          return Error('Empty response from Flutter');
        }

        try {
          const parsedResponse =
            typeof response === 'string' ? JSON.parse(response) : response;
          console.log('[RequestHandler] response to dapp:', parsedResponse);
          return parsedResponse;
        } catch (error) {
          console.error('[RequestHandler] Error:', error);
          throw new Error(`Request failed: ${error.message}`);
        }
      } catch (error) {
        console.error('[RequestHandler] Error:', error);
        throw new Error(`Request failed: ${error.message}`);
      }
    };
  }
}

export default RequestHandler;
