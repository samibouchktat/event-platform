import { useEffect, useState } from "react";
import {
  getMyNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/api/notificationApi";
import StatusBadge from "../../components/common/StatusBadge";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadNotifications = async () => {
    setErrorMessage("");

    try {
      const [notificationsData, countData] = await Promise.all([
        getMyNotifications(),
        getUnreadNotificationsCount(),
      ]);

      setNotifications(notificationsData);
      setUnreadCount(countData.unreadCount || 0);
    } catch (error) {
      console.error("Notifications error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    setUpdatingId(notificationId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await markNotificationAsRead(notificationId);
      await loadNotifications();
      setSuccessMessage("Notification marquée comme lue.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de marquer la notification comme lue."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
      setSuccessMessage("Toutes les notifications ont été marquées comme lues.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de marquer toutes les notifications comme lues."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      QUOTE_REQUEST_CREATED: "Demande de devis",
      QUOTE_REQUEST_STATUS_UPDATED: "Statut devis",
      BOOKING_CREATED: "Réservation",
      BOOKING_STATUS_UPDATED: "Statut réservation",
      GENERAL: "Général",
    };

    return labels[type] || type;
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement des notifications...</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Notifications</h1>

      <p>
        Notifications non lues : <strong>{unreadCount}</strong>
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={markingAll || unreadCount === 0}
        >
          {markingAll ? "Mise à jour..." : "Tout marquer comme lu"}
        </button>
      </div>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {notifications.length === 0 ? (
        <p>Aucune notification pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {notifications.map((notification) => (
            <article
              key={notification.id}
              style={{
                border: notification.read
                  ? "1px solid #ddd"
                  : "2px solid #333",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: notification.read ? "#fff" : "#f8f8f8",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <h2>{notification.title}</h2>
                  <StatusBadge type="notification" value={notification.read} />

                  <p>
                    <strong>Type :</strong> {getTypeLabel(notification.type)}
                  </p>

                  <p>{notification.message}</p>

                  <p>
                    <strong>Statut :</strong>{" "}
                    {notification.read ? "Lue" : "Non lue"}
                  </p>

                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>

                  {notification.relatedResourceType && (
                    <p>
                      <strong>Ressource :</strong>{" "}
                      {notification.relatedResourceType} #
                      {notification.relatedResourceId}
                    </p>
                  )}
                </div>

                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={updatingId === notification.id}
                  >
                    {updatingId === notification.id
                      ? "Mise à jour..."
                      : "Marquer comme lue"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default NotificationsPage;