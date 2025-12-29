import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

class FCMHelper {
  constructor() {
    this.unsubscribeOnMessage = null;
    this.unsubscribeOnNotificationOpen = null;
  }

  // Request permission
  async requestPermission() {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('iOS Authorization status:', authStatus);
          return true;
        }
        return false;
      } else {
        // Android - langsung return true aja
        console.log('Android detected, skipping permission request');
        return true;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      return true;
    }
  }

  // Get FCM Token
  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Update FCM Token ke Backend
  async updateFCMTokenToBackend(token, apiUrl, jwtToken) {
    try {
      if (!token) {
        console.log('No token to update');
        return false;
      }

      const response = await fetch(apiUrl + '/user/update-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtToken,
        },
        body: JSON.stringify({ fcm_token: token }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('FCM Token updated successfully:', data);
        return true;
      } else {
        console.error('Failed to update FCM token:', data);
        return false;
      }
    } catch (error) {
      console.error('Error updating FCM token:', error);
      return false;
    }
  }

  // Setup FCM Listeners
  setupListeners(onNotificationReceived, onNotificationOpened) {
    // Handle foreground notifications
    this.unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          [
            {
              text: 'OK',
              onPress: () => {
                if (onNotificationReceived) {
                  onNotificationReceived(remoteMessage);
                }
              },
            },
          ]
        );
      }
    });

    // Handle notification opened app from background
    this.unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);

      if (onNotificationOpened) {
        onNotificationOpened(remoteMessage);
      }
    });

    // Handle notification opened app from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);

          if (onNotificationOpened) {
            onNotificationOpened(remoteMessage);
          }
        }
      });
  }

  // Cleanup listeners
  cleanup() {
    if (this.unsubscribeOnMessage) {
      this.unsubscribeOnMessage();
    }
    if (this.unsubscribeOnNotificationOpen) {
      this.unsubscribeOnNotificationOpen();
    }
  }
}

export default new FCMHelper();
