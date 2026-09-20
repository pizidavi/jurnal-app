import notifee, { AndroidImportance } from 'react-native-notify-kit';
import Permissions, { type PermissionStatus } from 'react-native-permissions';

import i18n from '../locale';
import { NOTIFICATION_CHANNEL } from '../type/enum';
import { showAlert } from './alert';
import { appLog } from './logger';

const ACCEPTED_STATUSES: PermissionStatus[] = [
  Permissions.RESULTS.GRANTED,
  Permissions.RESULTS.UNAVAILABLE,
];

const requestPermission = async (
  check: () => Promise<PermissionStatus>,
  request: () => Promise<PermissionStatus>,
) => {
  let status = await check();
  if (!ACCEPTED_STATUSES.includes(status)) status = await request();
  return ACCEPTED_STATUSES.includes(status);
};

export const requestRecordingPermissions = async () => {
  const microphoneGranted = await requestPermission(
    () => Permissions.check(Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO),
    () => Permissions.request(Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO),
  );

  const notificationsGranted = await requestPermission(
    async () => (await Permissions.checkNotifications()).status,
    async () => (await Permissions.requestNotifications()).status,
  );

  if (!microphoneGranted || !notificationsGranted) {
    showAlert('permission:denied', 'permission:deniedBody', [
      { text: 'general:cancel', style: 'cancel' },
      {
        text: 'general:openSettings',
        onPress: () => {
          Permissions.openSettings().catch(e => {
            appLog.error('Failed to open app settings', e);
          });
        },
      },
    ]);
    return false;
  }

  notifee
    .createChannel({
      id: NOTIFICATION_CHANNEL.NOTE_PROCESSING,
      name: i18n.t('notification:noteProcessingChannelName'),
      description: i18n.t('notification:noteProcessingChannelDescription'),
      importance: AndroidImportance.DEFAULT,
      vibration: false,
      lights: false,
    })
    .catch(e => {
      appLog.error('Failed to create notification channel', e);
    });

  return true;
};
