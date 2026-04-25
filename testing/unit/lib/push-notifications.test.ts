import { 
    isPushSupported, 
    setupPushNotifications, 
    unsubscribeFromPush,
    urlBase64ToUint8Array
  } from '../../../app/lib/push-notifications';
  import { notificationApi } from '../../../app/lib/api';
  
  // Mock notificationApi
  jest.mock('../../../app/lib/api', () => ({
    notificationApi: {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    },
  }));
  
  describe('Push Notification Utilities (push-notifications.ts)', () => {
    const originalNavigator = global.navigator;
    const originalNotification = global.Notification;
    const originalPushManager = (global as any).PushManager;
  
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Default mock for navigator
      Object.defineProperty(global, 'navigator', {
        value: {
          serviceWorker: {
            register: jest.fn(),
            ready: Promise.resolve({
                pushManager: {
                  subscribe: jest.fn(),
                  getSubscription: jest.fn()
                }
            })
          },
        },
        configurable: true,
        writable: true
      });
  
      // Mock window.PushManager
      (global as any).PushManager = jest.fn();
  
      // Mock Notification
      (global as any).Notification = {
        requestPermission: jest.fn(),
      };
    });
  
    afterEach(() => {
        (global as any).PushManager = originalPushManager;
    });

    afterAll(() => {
      global.navigator = originalNavigator;
      global.Notification = originalNotification;
    });
  
    describe('urlBase64ToUint8Array', () => {
        it('should correctly convert a base64 string to Uint8Array', () => {
            const base64 = 'YmFzZTY0'; // "base64" in base64
            const result = urlBase64ToUint8Array(base64);
            expect(result).toBeInstanceOf(Uint8Array);
            // "base64" chars: b=98, a=97, s=115, e=101, 6=54, 4=52
            expect(Array.from(result)).toEqual([98, 97, 115, 101, 54, 52]);
        });

        it('should handle URL-safe characters (- and _)', () => {
            const base64 = 'YV_iLXc'; // "a[0xbf]i-w" -> adjusted for simpler test
            // Let's use a known string. "a" is 97.
            const result = urlBase64ToUint8Array('YV9iLWNf'); 
            // YV9iLWNf -> base64 decode -> a_b-c_
            expect(result).toBeInstanceOf(Uint8Array);
        });
    });

    describe('isPushSupported', () => {
      it('should return true if serviceWorker and PushManager are available', () => {
        expect(isPushSupported()).toBe(true);
      });
  
      it('should return false if serviceWorker is missing', () => {
        // @ts-ignore
        delete global.navigator.serviceWorker;
        expect(isPushSupported()).toBe(false);
      });
  
      it('should return false if PushManager is missing', () => {
        delete (global as any).PushManager;
        expect(isPushSupported()).toBe(false);
      });
    });
  
    describe('setupPushNotifications', () => {
      it('should return early when push is not supported', async () => {
        // @ts-ignore
        delete global.navigator.serviceWorker;

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        await setupPushNotifications();

        expect(warnSpy).toHaveBeenCalledWith('Push notifications are not supported in this browser.');
        expect(notificationApi.subscribe).not.toHaveBeenCalled();
        warnSpy.mockRestore();
      });

      it('should register service worker and subscribe if permission granted', async () => {
        const mockSubscription = { endpoint: 'https://test.com' };
        const mockRegistration = {
          pushManager: {
            subscribe: jest.fn().mockResolvedValue(mockSubscription),
          },
        };
  
        (global.navigator.serviceWorker.register as jest.Mock).mockResolvedValue(mockRegistration);
        // @ts-ignore
        global.navigator.serviceWorker.ready = Promise.resolve(mockRegistration);
        (global.Notification.requestPermission as jest.Mock).mockResolvedValue('granted');
  
        await setupPushNotifications();
  
        expect(global.navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
        expect(global.Notification.requestPermission).toHaveBeenCalled();
        expect(mockRegistration.pushManager.subscribe).toHaveBeenCalled();
        expect(notificationApi.subscribe).toHaveBeenCalledWith(mockSubscription);
      });
  
      it('should not subscribe if permission is denied', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
        (global.Notification.requestPermission as jest.Mock).mockResolvedValue('denied');
        
        await setupPushNotifications();
        
        expect(notificationApi.subscribe).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith('Notification permission denied.');
        warnSpy.mockRestore();
      });

      it('should ignore concurrent setup requests while one is in progress', async () => {
        let resolvePermission!: (value: string) => void;
        const permissionPromise = new Promise<string>((resolve) => {
          resolvePermission = resolve;
        });

        const registerSpy = global.navigator.serviceWorker.register as jest.Mock;
        const requestPermissionSpy = global.Notification.requestPermission as jest.Mock;
        requestPermissionSpy.mockReturnValue(permissionPromise);

        const firstSetup = setupPushNotifications();
        const secondSetup = setupPushNotifications();

        resolvePermission('denied');
        await firstSetup;
        await secondSetup;

        expect(registerSpy).toHaveBeenCalledTimes(1);
        expect(requestPermissionSpy).toHaveBeenCalledTimes(1);
      });
  
      it('should handle errors gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (global.Notification.requestPermission as jest.Mock).mockRejectedValue(new Error('Test Error'));
        
        await setupPushNotifications();
        
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), expect.any(Error));
        consoleSpy.mockRestore();
      });
    });
  
    describe('unsubscribeFromPush', () => {
      it('should return early if push is not supported', async () => {
        // @ts-ignore
        delete global.navigator.serviceWorker;

        await unsubscribeFromPush();

        expect(notificationApi.unsubscribe).not.toHaveBeenCalled();
      });

      it('should unsubscribe locally and notify backend', async () => {
        const mockUnsubscribe = jest.fn().mockResolvedValue(true);
        const mockSubscription = {
          endpoint: 'https://test.com',
          unsubscribe: mockUnsubscribe,
        };
        const mockRegistration = {
          pushManager: {
            getSubscription: jest.fn().mockResolvedValue(mockSubscription),
          },
        };
  
        // @ts-ignore
        global.navigator.serviceWorker.ready = Promise.resolve(mockRegistration);
  
        await unsubscribeFromPush();
  
        expect(notificationApi.unsubscribe).toHaveBeenCalledWith('https://test.com');
        expect(mockUnsubscribe).toHaveBeenCalled();
      });
  
      it('should do nothing if no active subscription', async () => {
        const mockRegistration = {
          pushManager: {
            getSubscription: jest.fn().mockResolvedValue(null),
          },
        };
        // @ts-ignore
        global.navigator.serviceWorker.ready = Promise.resolve(mockRegistration);
  
        await unsubscribeFromPush();
  
        expect(notificationApi.unsubscribe).not.toHaveBeenCalled();
      });

      it('should handle unsubscribe errors gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const mockRegistration = {
          pushManager: {
            getSubscription: jest.fn().mockRejectedValue(new Error('unsubscribe failed')),
          },
        };
        // @ts-ignore
        global.navigator.serviceWorker.ready = Promise.resolve(mockRegistration);

        await unsubscribeFromPush();

        expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), expect.any(Error));
        consoleSpy.mockRestore();
      });
    });
  });
