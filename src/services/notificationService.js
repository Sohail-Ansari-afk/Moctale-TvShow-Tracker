import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  /**
   * Request permissions for notifications
   */
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    return true;
  },

  /**
   * Schedule a notification for a movie/show
   * @param {string} title - Show title
   * @param {string} body - Notification message
   * @param {string} releaseDate - ISO String of release time
   */
  async scheduleNotification(title, body, releaseDate) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return false;

    const triggerDate = new Date(releaseDate);
    
    // Subtract 10 minutes
    triggerDate.setMinutes(triggerDate.getMinutes() - 10);

    const now = new Date();
    if (triggerDate <= now) {
      // If time has passed (or is very close), schedule for 5 seconds from now for testing/fallback?
      // Or just fail? Let's return specific code.
      // But user requirement says "10 min left". If < 10 min, we can't notify "10 min left".
      // Maybe notify "Starting soon!" immediately?
      // Let's go with immediate trigger if within window, else fail.
      if (new Date(releaseDate) > now) {
         // Show is in future, but < 10 mins away. Notify now.
         await Notifications.scheduleNotificationAsync({
            content: { title, body },
            trigger: null, // immediate
         });
         return true;
      }
      return false; // Already aired
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎥 Coming up: ${title}`,
          body: body || `This show airs in 10 minutes! Grab your popcorn. 🍿`,
        },
        trigger: triggerDate,
      });
      return true;
    } catch (e) {
      console.log("Error scheduling notification:", e);
      return false;
    }
  }
};
