import { useState, useEffect, useCallback } from 'react';
import { ReminderSetting, WorkoutDay } from '../types/plan';
import { WORKOUT_DAYS } from '../data/planData';

export function useNotifications(reminders: ReminderSetting[], todayWorkout: WorkoutDay) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!supported) return false;
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        sendLocalNotification(
          '🏃‍♂️ Lefkoşa 10K Maraton Bildirimleri Aktif!',
          `Bugünkü antrenman: ${todayWorkout.title} (${todayWorkout.displayDate})`
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const sendLocalNotification = useCallback((title: string, body: string, icon = '/pwa-192x192.png') => {
    if (!supported || Notification.permission !== 'granted') return;

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon,
            badge: icon,
            vibrate: [200, 100, 200],
            tag: 'marathon-reminder',
            renotify: true,
          } as NotificationOptions);
        });
      } else {
        new Notification(title, {
          body,
          icon,
        });
      }
    } catch (e) {
      console.error('Notification trigger error:', e);
    }
  }, [supported]);

  // Periodic checker every minute to trigger daily reminders when time matches
  useEffect(() => {
    if (permission !== 'granted') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${currentHours}:${currentMinutes}`;

      reminders.forEach((rem) => {
        if (rem.enabled && rem.time === timeStr) {
          // Check if already fired this minute
          const firedKey = `fired_${rem.id}_${now.toDateString()}_${timeStr}`;
          if (!sessionStorage.getItem(firedKey)) {
            sessionStorage.setItem(firedKey, 'true');
            sendLocalNotification(`⏱️ ${rem.title}`, `${rem.description}\n[Bugün: ${todayWorkout.displayDate} - ${todayWorkout.title}]`);
          }
        }
      });
    }, 30000); // Check every 30s

    return () => clearInterval(checkInterval);
  }, [permission, reminders, todayWorkout, sendLocalNotification]);

  // Export all 40 workouts to an iCalendar (.ics) file
  const exportToCalendarICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lefkosa 10K Marathon Prep//TR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Lefkoşa 10K Maraton Hazırlık Planı',
      'X-WR-TIMEZONE:Asia/Nicosia',
    ];

    WORKOUT_DAYS.forEach((w) => {
      const cleanDate = w.dateStr.replace(/-/g, '');
      const startDateTime = `${cleanDate}T070000`;
      const endDateTime = `${cleanDate}T083000`;
      const summary = `🏃‍♂️ [10K Planı] ${w.weekLabel}: ${w.title}`;
      const description = `Parkur: ${w.track}\\nHedef Pace: ${w.targetPace}\\nDetay: ${w.details.replace(/\n/g, '\\n')}`;

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:lefkosa10k-${w.id}@marathonprep`);
      icsContent.push(`DTSTAMP:${cleanDate}T000000Z`);
      icsContent.push(`DTSTART:${startDateTime}`);
      icsContent.push(`DTEND:${endDateTime}`);
      icsContent.push(`SUMMARY:${summary}`);
      icsContent.push(`DESCRIPTION:${description}`);
      icsContent.push(`LOCATION:${w.track}`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('BEGIN:VALARM');
      icsContent.push('TRIGGER:-PT60M');
      icsContent.push('ACTION:DISPLAY');
      icsContent.push(`DESCRIPTION:Antrenman Hatırlatması: ${w.title}`);
      icsContent.push('END:VALARM');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Lefkosa_10K_Maraton_Takvimi.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    supported,
    permission,
    requestPermission,
    sendLocalNotification,
    exportToCalendarICS,
  };
}
