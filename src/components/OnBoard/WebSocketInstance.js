class WebSocketInstance {
  static allInstances = [];
  static maxReconnectAttempts = 5;
  static reconnectDelayBase = 3000; // 3 seconds

  constructor(organization, chatId = null, type = 'message') {
    this.organization = organization;
    this.chatId = chatId;
    this.type = type;
    this.key = `${organization}_${chatId || 'none'}_${type}`;
    this.eventHandlers = {};
    this.websocket = null;
    this.pingInterval = null;
    this.heartbeatTimeout = null;
    this.reconnectAttempts = 0;
    this.isClosedManually = false;
    this.reconnectTimeout = null;

    // ✅ Check if instance already exists
    const existing = WebSocketInstance.allInstances.find(inst => inst.key === this.key);
    if (existing && (existing.websocket?.readyState === WebSocket.CONNECTING || existing.websocket?.readyState === WebSocket.OPEN)) {
      console.warn(`⚠️ [WebSocket] Instance already exists and is active: ${this.key}`);
      return existing;
    }

    if (existing) {
      console.log(`🔄 [WebSocket] Reusing existing instance: ${this.key}`);
      existing.close();
      const index = WebSocketInstance.allInstances.indexOf(existing);
      WebSocketInstance.allInstances.splice(index, 1);
    }

    WebSocketInstance.allInstances.push(this); // ✅ Register instance
    this.initWebSocket();
  }

  static closeSocketsByOrganization(orgId) {
    WebSocketInstance.allInstances = WebSocketInstance.allInstances.filter((instance) => {
      if (instance.organization === orgId) {
        instance.close();
        return false; // remove from array
      }
      return true;
    });
  }

  static closeAllSockets() {
    console.log(`🛑 [WebSocket] Closing all ${WebSocketInstance.allInstances.length} sockets`);
    WebSocketInstance.allInstances.forEach(instance => instance.close());
    WebSocketInstance.allInstances = [];
  }

  initWebSocket() {
    const token = JSON.parse(localStorage.getItem("user"))?.authToken;
    if (!token) return;

    const params = new URLSearchParams({
      organization: this.organization,
      listenerType: this.type,
      token,
    });

    if (this.chatId && this.type !== 'contacts') {
      params.set("chatId", this.chatId);
    }

    const url = `wss://gambot.azurewebsites.net/FirebaseWebsocketHandler.ashx?${params.toString()}`;
    this.websocket = new WebSocket(url);

    this.websocket.onopen = () => {
      console.log(`✅ [WebSocket] OPENED: ${this.key}`);
      this.reconnectAttempts = 0; // Reset on successful connection
      this.startPing();
      
      // Notify handlers
      if (this.eventHandlers['open']) {
        this.eventHandlers['open']({ type: 'open' });
      }
    };

    this.websocket.onmessage = (event) => {
      if (event.data === "__pong__") {
        this.resetHeartbeat();
        return;
      }

      try {
        const parsed = JSON.parse(event.data);
        const type = parsed?.type;
        
        // Handle error messages
        if (type === 'error') {
          console.error(`❌ [WebSocket] Error from server: ${parsed.message}`);
          if (this.eventHandlers['error']) {
            this.eventHandlers['error'](parsed);
          }
          // Don't reconnect on server errors - let user refresh
          return;
        }
        
        if (type && this.eventHandlers[type]) {
          this.eventHandlers[type](event);
        }
      } catch (e) {
        console.error(`❌ [WebSocket] Failed to parse message:`, e);
      }
    };

    this.websocket.onerror = (error) => {
      console.error(`❌ [WebSocket] Error: ${this.key}`, error);
      if (this.eventHandlers['error']) {
        this.eventHandlers['error']({ type: 'error', error });
      }
    };

    this.websocket.onclose = (event) => {
      console.warn(`⚠️ [WebSocket] CLOSED: ${this.key} (code: ${event.code}, reason: ${event.reason || 'none'})`);
      this.stopPing();
      
      // ✅ Auto-reconnect logic (unless manually closed or server error)
      if (!this.isClosedManually && event.code !== 1008 && this.reconnectAttempts < WebSocketInstance.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = WebSocketInstance.reconnectDelayBase * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
        console.log(`🔄 [WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${WebSocketInstance.maxReconnectAttempts})`);
        
        this.reconnectTimeout = setTimeout(() => {
          if (!this.isClosedManually) {
            this.initWebSocket();
          }
        }, delay);
      } else if (this.reconnectAttempts >= WebSocketInstance.maxReconnectAttempts) {
        console.error(`❌ [WebSocket] Max reconnect attempts reached for ${this.key}`);
        if (this.eventHandlers['maxReconnectReached']) {
          this.eventHandlers['maxReconnectReached']({ type: 'maxReconnectReached' });
        }
      }
    };
  }

  startPing() {
    this.pingInterval = setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send("__ping__");
        this.resetHeartbeat();
      }
    }, 20000);
  }

  resetHeartbeat() {
    clearTimeout(this.heartbeatTimeout);
    this.heartbeatTimeout = setTimeout(() => {
      this.websocket?.close();
    }, 30000);
  }

  stopPing() {
    clearInterval(this.pingInterval);
    clearTimeout(this.heartbeatTimeout);
  }

  close() {
    this.isClosedManually = true;
    this.stopPing();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.websocket) {
      try {
        this.websocket.close();
      } catch (e) {
        console.warn(`⚠️ [WebSocket] Error closing socket:`, e);
      }
      this.websocket = null;
    }
    
    // Remove from instances array
    const index = WebSocketInstance.allInstances.indexOf(this);
    if (index > -1) {
      WebSocketInstance.allInstances.splice(index, 1);
    }
    
    console.log(`🛑 [WebSocket] Closed: ${this.key}`);
  }

  addEventListener(type, handler) {
    this.eventHandlers[type] = handler;
  }

  removeEventListener(type) {
    delete this.eventHandlers[type];
  }
}

export default WebSocketInstance;


// const allWebSocketInstances = new Map();

// function getInstanceKey(org, chatId, type) {
//   return `${org}__${chatId || 'none'}__${type}`;
// }

// class WebSocketInstance {
//   constructor(organization, chatId = null, type = 'message') {
//     throw new Error('❌ Use WebSocketInstance.getOrCreate(...) instead of constructor');
//   }

//   static getOrCreate(organization, chatId = null, type = 'message') {
//     const key = getInstanceKey(organization, chatId, type);
//     const existing = allWebSocketInstances.get(key);

//     if (existing) {
//       const readyState = existing.websocket?.readyState;
//       // 0 = CONNECTING, 1 = OPEN
//       if (readyState === WebSocket.CONNECTING || readyState === WebSocket.OPEN) {
//         console.warn(`⚠️ WebSocket already exists and is connecting/open (${key})`);
//         return existing;
//       }

//       // If CLOSED or CLOSING, close manually and remove from map
//       console.warn(`🔄 WebSocket exists but is CLOSED/CLOSING. Re-initializing (${key})`);
//       existing.close();
//       allWebSocketInstances.delete(key);
//     }

//     const instance = Object.create(WebSocketInstance.prototype);
//     instance.organization = organization;
//     instance.chatId = chatId;
//     instance.type = type;
//     instance.eventHandlers = {};
//     instance.reconnectDelay = 3000;
//     instance.maxReconnectAttempts = 5;
//     instance.reconnectAttempts = 0;
//     instance.pingInterval = null;
//     instance.heartbeatTimeout = null;
//     instance.websocket = null;
//     instance.isClosedManually = false;
//     instance.key = key;

//     allWebSocketInstances.set(key, instance);
//     instance.initWebSocket();

//     return instance;
//   }

//   static closeSocketsByOrganization(orgId) {
//     for (const [key, instance] of allWebSocketInstances.entries()) {
//       if (instance.organization === orgId) {
//         instance.close();
//       }
//     }
//   }

//   static closeAllSockets() {
//     for (const instance of allWebSocketInstances.values()) {
//       instance.close();
//     }
//     allWebSocketInstances.clear();
//   }

//   initWebSocket() {
//     const token = JSON.parse(localStorage.getItem("user"))?.authToken;
//     if (!token) {
//       console.error("❌ Missing authToken for WebSocket");
//       return;
//     }

//     const baseUrl = `wss://gambot.azurewebsites.net/FirebaseWebsocketHandler.ashx`;
//     const params = new URLSearchParams({
//       organization: this.organization,
//       listenerType: this.type,
//       token,
//     });

//     if (this.chatId && this.type !== 'contact') {
//       params.set('chatId', this.chatId);
//     }

//     const url = `${baseUrl}?${params.toString()}`;
//     this.websocket = new WebSocket(url);

//     console.log(`🔌 [${this.type}] Connecting WebSocket (${this.key})`);

//     this.websocket.onopen = () => {
//       console.log(`✅ WebSocket OPENED (${this.key})`);
//       this.reconnectAttempts = 0;
//       this.startPing();
//     };

//     this.websocket.onmessage = (event) => {
//       if (event.data === '__pong__') {
//         this.resetHeartbeat();
//         return;
//       }

//       try {
//         const parsed = JSON.parse(event.data);
//         const type = parsed?.type;
//         if (type && this.eventHandlers[type]) {
//           this.eventHandlers[type](event);
//         } else {
//           console.warn(`⚠️ Unhandled WebSocket message type: ${type}`);
//         }
//       } catch (err) {
//         console.error('❌ WebSocket parse error:', err);
//       }
//     };

//     this.websocket.onerror = (event) => {
//       console.error(`❌ WebSocket error (${this.key})`, event);
//     };

//     this.websocket.onclose = () => {
//       console.warn(`⚠️ WebSocket CLOSED (${this.key})`);
//       this.stopPing();

//       if (!this.isClosedManually && this.reconnectAttempts < this.maxReconnectAttempts) {
//         this.reconnectAttempts++;
//         console.log(`🔁 Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
//         setTimeout(() => this.initWebSocket(), this.reconnectDelay);
//       } else if (this.isClosedManually) {
//         console.log(`🛑 Manually closed WebSocket (${this.key})`);
//       } else {
//         console.error('❌ Max reconnect attempts reached');
//         allWebSocketInstances.delete(this.key);
//       }
//     };

//     this.resetHeartbeat();
//   }

//   startPing() {
//     this.pingInterval = setInterval(() => {
//       if (this.websocket?.readyState === WebSocket.OPEN) {
//         this.websocket.send('__ping__');
//         this.resetHeartbeat();
//       }
//     }, 20000);
//   }

//   resetHeartbeat() {
//     clearTimeout(this.heartbeatTimeout);
//     this.heartbeatTimeout = setTimeout(() => {
//       console.warn(`⛔ No pong in 30s. Closing socket (${this.key})`);
//       this.websocket?.close();
//     }, 30000);
//   }

//   stopPing() {
//     clearInterval(this.pingInterval);
//     clearTimeout(this.heartbeatTimeout);
//   }

//   close() {
//     this.isClosedManually = true;
//     this.stopPing();
//     if (this.websocket) {
//       this.websocket.close();
//       this.websocket = null;
//     }
//     allWebSocketInstances.delete(this.key);
//   }

//   send(message) {
//     return new Promise((resolve, reject) => {
//       if (this.websocket?.readyState === WebSocket.OPEN) {
//         this.websocket.send(JSON.stringify(message));
//         resolve();
//       } else {
//         console.warn(`⏳ Socket not open. Retrying send to: ${this.key}`);
//         setTimeout(() => this.send(message).then(resolve).catch(reject), 1000);
//       }
//     });
//   }

//   addEventListener(callbackId, callback) {
//     this.eventHandlers[callbackId] = callback;
//   }

//   removeEventListener(callbackId) {
//     delete this.eventHandlers[callbackId];
//   }
// }

// export default WebSocketInstance;


// class WebSocketInstance {
//     constructor(organization, phoneNumber = null) {
//         let url = `wss://gambot.azurewebsites.net/FirebaseWebsocketHandler.ashx?organization=${organization}`;
//         if (phoneNumber) {
//             url += `&chatId=${phoneNumber}`;
//         }
//         this.websocket = new WebSocket(url);

//         this.websocket.addEventListener('open', (event) => {
//             console.log('WebSocket connection opened:', event);
//         });

//         this.websocket.addEventListener('error', (event) => {
//             console.error('WebSocket error:', event);
//             console.log('WebSocket ready state:', this.websocket.readyState);
//         });
//     }

//     send(message) {
//         return new Promise((resolve, reject) => {
//             if (this.websocket.readyState === WebSocket.OPEN) {
//                 this.websocket.send(JSON.stringify(message));
//                 resolve();
//             } else {
//                 reject(new Error('WebSocket connection is not open.'));
//             }
//         });
//     }

//     close() {
//         this.websocket.close();
//     }

//     addEventListener(eventType, callback) {
//         this.websocket.addEventListener(eventType, callback);
//     }

//     removeEventListener(eventType, callback) {
//         this.websocket.removeEventListener(eventType, callback);
//     }
// }

// export default WebSocketInstance;


// class WebSocketInstance {
//     constructor(organization, phoneNumber = null) {
//         let url = `wss://gambot.azurewebsites.net/FirebaseWebsocketHandler.ashx?organization=${organization}`;
//         if (phoneNumber) {
//             url += `&chatId=${phoneNumber}`;
//         }
//         this.websocket = new WebSocket(url);

//         this.websocket.addEventListener('open', (event) => {
//             console.log('WebSocket connection opened:', event);
//         });

//         this.websocket.addEventListener('error', (event) => {
//             console.error('WebSocket error:', event);
//             console.log('WebSocket ready state:', this.websocket.readyState);
//         });
//     }

//     send(message) {
//         return new Promise((resolve, reject) => {
//             if (this.websocket.readyState === WebSocket.OPEN) {
//                 this.websocket.send(JSON.stringify(message));
//                 resolve();
//             } else {
//                 reject(new Error('WebSocket connection is not open.'));
//             }
//         });
//     }

//     close() {
//         this.websocket.close();
//     }

//     addEventListener(eventType, callback) {
//         this.websocket.addEventListener(eventType, callback);
//     }

//     removeEventListener(eventType, callback) {
//         this.websocket.removeEventListener(eventType, callback);
//     }
// }

// export default WebSocketInstance;
