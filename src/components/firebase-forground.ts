'use client'
import useFcmToken from "@/hooks/use-fcmtoken";
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '../../firebase';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from "@tanstack/react-query";

export default function FcmTokenComp() {
  const { token, notificationPermissionStatus } = useFcmToken();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.log("permission grandted")
      if (notificationPermissionStatus === 'granted') {
        console.log("permission grandted")
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground push notification received:', payload);

          if (payload?.data?.type === 'comment') {
            queryClient.invalidateQueries({
              queryKey: ['comments', payload?.data?.taskId],
            })
          }
          queryClient.invalidateQueries({
            queryKey: ['notifications'],
          });

          toast.message(payload?.data?.title || "📩 New Notification", {
            description: payload?.data?.body || "You have a new message.",
            duration: 5000,
            action: {
              label: "View",
              onClick: () => {
                // You can navigate or perform some action here
                // console.log("View clicked");
                const url = payload?.data?.url;
                if (url) {
                  window.location.href = url;
                } else {
                  console.log("No URL provided in the notification data.");
                }
              },
            },
          });
        });
        return () => {
          unsubscribe();
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null;
}