import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, IonList, IonItem, IonLabel, IonListHeader, IonText } from '@ionic/react';
import React from 'react';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';


const Home = (props: any) => {


  const [notifications, setNotifications] = React.useState<any[]>([])

  const [token, settoken] = React.useState('')

  React.useEffect(() => {

    

     // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register().catch(console.error);
      } else {
        // Show some error
        alert('Please allow to receive notifications')
      }
    });


    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

  
    PushNotifications.addListener('registration', (token: Token) => {
      settoken(token.value)
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        const newNotifications = [
          ...notifications, 
          {
              id: notification.id,
              title: notification.title || `title:${notification.id}`,
              body: notification.body || `body:${notification.body}`
          }
        ]

        setNotifications(newNotifications)
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      },
    );

      return () => {
        PushNotifications.removeAllListeners()
      } 
  }, []
)

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Ionic React Push Example</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonListHeader>
              <IonLabel contentEditable>DeviceToken: {token}</IonLabel>
              <IonLabel>Notifications</IonLabel>
            </IonListHeader>
            {notifications && notifications.map((notif: any) =>
              <IonItem key={notif.id}>
                <IonLabel>
                  <IonText>
                    <h3>{notif.title}</h3>
                  </IonText>
                  <p>{notif.body}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonContent>
      </IonPage >
      
    );
  };
export default Home;
