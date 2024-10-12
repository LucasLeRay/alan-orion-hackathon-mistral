// import { urlBase64ToUint8Array } from "../utils/urlBase64ToUint8Array";
// import axios from "axios";
// import { BASE_URL, VAPID_PUBLIC_KEY } from "../contants";
// import { useEffect, useState } from "react";

// export const useNotificationPermission = () => {
//   const [permission, setPermission] = useState<NotificationPermission>(
//     Notification.permission
//   );

//   function requestPermission() {
//     Notification.requestPermission().then((permission) => {
//       setPermission(permission);
//     });
//   }

//   async function suscribeNotification() {
//     const accessToken = localStorage.getItem("accessToken");
//     const swRegistration = await navigator.serviceWorker.ready;
//     const subscription = await swRegistration.pushManager.subscribe({
//       userVisibleOnly: true, // Required to show notifications
//       applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
//     });

//     return axios
//       .post(`${BASE_URL}/api/v1/web-push/subscribe`, subscription, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//       .then(() => {
//         console.log("Subscribed");
//       })
//       .catch((error) => {
//         console.error("Error subscribing", error);
//       });
//   }

//   async function unsuscribeNotification() {
//     const accessToken = localStorage.getItem("accessToken");
//     const swRegistration = await navigator.serviceWorker.ready;
//     const subscription = await swRegistration.pushManager.subscribe({
//       userVisibleOnly: true, // Required to show notifications
//       applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
//     });

//     return axios
//       .post(`${BASE_URL}/api/v1/web-push/unsubscribe`, subscription, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//       .then(() => {
//         console.log("Subscribed");
//       })
//       .catch((error) => {
//         console.error("Error subscribing", error);
//       });
//   }

//   useEffect(() => {
//     if (permission === "default") requestPermission();
//     if (permission === "granted") suscribeNotification();
//   }, [permission]);

//   return { permission, unsuscribeNotification, requestPermission };
// };
