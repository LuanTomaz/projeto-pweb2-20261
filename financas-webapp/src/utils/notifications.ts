export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return Promise.resolve('unsupported')
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(Notification.permission)
  }

  return Notification.requestPermission()
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  new Notification(title, options)
}
