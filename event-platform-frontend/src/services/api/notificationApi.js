import axiosClient from "./axiosClient";

export const getMyNotifications = async () => {
  const response = await axiosClient.get("/notifications");
  return response.data;
};

export const getUnreadNotificationsCount = async () => {
  const response = await axiosClient.get("/notifications/unread-count");
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosClient.patch(
    `/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  await axiosClient.patch("/notifications/read-all");
};