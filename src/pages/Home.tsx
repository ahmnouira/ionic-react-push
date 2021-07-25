import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonText,
} from '@ionic/react'
import React from 'react'

import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications'
import { Notification } from '../models/notification'
import { requestBadgePermission, setBadge } from '../services/badge.servcie'
import { Badge } from '@ionic-native/badge'

const Home = (props: any) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const [token, setToken] = React.useState('')

  React.useEffect(() => {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting

    const setInitBadge = async () => {
      const permitted = await requestBadgePermission()
      if (permitted) {
        setBadge(notifications.length + 10)
      }
    }
    setInitBadge()
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register().catch(console.error)
      } else {
        // Show some error
        alert('Please allow to receive notifications')
      }
    })

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error))
    })

    PushNotifications.addListener('registration', (token: Token) => {
      setToken(token.value)
    })

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {

      const newNotification: Notification = {
        id: notification.id,
        title: notification.title || `title:${notification.id}`,
        body: notification.body || `body:${notification.body}`,
        unread: true,
        isBackground: false,
      }
      Badge.increase(1)
      setNotifications([newNotification, ...notifications])
    })

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {

      const { notification: notif } = notification
      const newNotification: Notification = {
        id: notif.id,
        title: notif.title || `title:${notif.id}`,
        body: notif.body || `body:${notif.body}`,
        unread: true,
        isBackground: true,
      }
      /*
      const permitted = await requestBadgePermission()
      if (permitted) {
        setBadge(notifications.length + 1)
      }
      */
      Badge.increase(1)

      setNotifications([newNotification, ...notifications])
    })

    return () => {
      PushNotifications.removeAllListeners()
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonTitle>Ionic React Push Example</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList>
          <IonListHeader>
            <IonLabel contentEditable>DeviceToken: {token}</IonLabel>
            <IonLabel>Notifications</IonLabel>
          </IonListHeader>
          {notifications &&
            notifications.map((notif: any, key) => (
              <IonItem key={key}>
                <IonLabel>
                  <IonText>
                    <h3>{notif.title}</h3>
                  </IonText>
                  <p>{notif.body}</p>

                  <p>{notifications.length}</p>
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}
export default Home
