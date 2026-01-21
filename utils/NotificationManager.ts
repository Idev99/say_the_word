import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const NotificationManager = {
    initialize: async () => {
        if (Platform.OS === 'web') return;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('buzz', {
                name: 'Buzz Alerts',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    },

    sendImmediateBuzz: async (title: string, body: string) => {
        if (Platform.OS === 'web') return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.MAX,
                categoryIdentifier: 'buzz',
            },
            trigger: null, // null means send immediately
        });
    },

    scheduleFutureBuzz: async (title: string, body: string, secondsFromNow: number, identifier?: string) => {
        if (Platform.OS === 'web' || secondsFromNow <= 0) return;

        await Notifications.scheduleNotificationAsync({
            identifier: identifier,
            content: {
                title: title,
                body: body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.MAX,
                categoryIdentifier: 'buzz',
            },
            trigger: {
                seconds: secondsFromNow,
            },
        });
    },

    cancelAllScheduledNotifications: async () => {
        if (Platform.OS === 'web') return;
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    setupHandlers: () => {
        if (Platform.OS === 'web') return;

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }
};
