import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, IonList, IonItem, IonLabel, IonListHeader, IonText } from '@ionic/react';
import React from 'react';
import { Plugin,registerPlugin,   } from '@capacitor/core';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';


const INITIAL_STATE = {
  notifications: [{ id: 'id', title: "Test Push", body: "This is my first push notification" }],
};

const Home = (props: any) => {


  const [notifications, setNotifications] = React.useState(INITIAL_STATE.notifications)

  React.useEffect(() => {

     // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
        alert('please allow to receive notifications')
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
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
        alert('Push received: ' + JSON.stringify(notification));
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
            <IonTitle>Enappd</IonTitle>
          </IonToolbar>
          <IonToolbar color="medium">
            <IonTitle>Ionic React Push Example</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonListHeader>
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
        <IonFooter>
          <IonToolbar>
            <IonButton expand="full" >Register for Push</IonButton>
          </IonToolbar>
        </IonFooter>
      </IonPage >
    );
  };
export default Home;
