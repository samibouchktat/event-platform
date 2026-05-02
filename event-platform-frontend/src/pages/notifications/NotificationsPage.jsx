import { useEffect, useState } from "react";
import {
  getMyNotifications,

  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/api/notificationApi";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
const loadNotifications = async () => {
  setLoading(true);
  setErrorMessage("");

  try {
    const notificationsData = await getMyNotifications();

    const safeNotifications = Array.isArray(notificationsData)
      ? notificationsData
      : [];

    setNotifications(safeNotifications);

    const unreadTotal = safeNotifications.filter((notification) => {
      return notification.read === false || notification.read === null;
    }).length;

    setUnreadCount(unreadTotal);
  } catch (error) {
    console.error("Load notifications error:", error.response?.data || error);

    setErrorMessage(
      error.response?.data?.message ||
        "Impossible de charger vos notifications."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    setActionLoading(true);
    setErrorMessage("");

    try {
      await markNotificationAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error("Mark notification as read error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de marquer cette notification comme lue."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading(true);
    setErrorMessage("");

    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Mark all notifications as read error:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de marquer toutes les notifications comme lues."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="app-container notifications-page">
      <section className="notifications-header">
        <div>
          <span className="page-kicker">Centre de notifications</span>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Suivez les mises à jour importantes liées à vos devis, réservations,
            acomptes et documents.
          </p>
        </div>

        <div className="notifications-summary-card">
          <span className="notifications-summary-label">Non lues</span>
          <strong>{unreadCount}</strong>
        </div>
      </section>

      <section className="notifications-toolbar">
        <div>
          <h2 className="card-title">Activité récente</h2>
          <p className="text-muted">
            {notifications.length} notification
            {notifications.length > 1 ? "s" : ""} au total.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleMarkAllAsRead}
          disabled={actionLoading || unreadCount === 0}
        >
          Tout marquer comme lu
        </button>
      </section>

      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      {loading ? (
        <p className="loading-text">Chargement des notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          Aucune notification pour le moment.
        </div>
      ) : (
        <section className="notification-list">
          {notifications.map((notification) => {
            const isRead = Boolean(notification.read);

            return (
              <article
                key={notification.id}
                className={`notification-card ${
                  isRead ? "notification-card-read" : "notification-card-unread"
                }`}
              >
                <div className="notification-card-main">
                  <div className="notification-card-header">
                    <div>
                      <span
                        className={`notification-status-badge ${
                          isRead
                            ? "notification-status-read"
                            : "notification-status-unread"
                        }`}
                      >
                        {isRead ? "Lue" : "Non lue"}
                      </span>

                      <h3>{notification.title || "Notification"}</h3>
                    </div>

                    {!isRead && (
                      <button
                        type="button"
                        className="btn btn-small btn-secondary"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={actionLoading}
                      >
                        Marquer comme lue
                      </button>
                    )}
                  </div>

                  <p className="notification-message">
                    {notification.message || "Aucun message."}
                  </p>

                  <div className="notification-meta-grid">
                    <InfoItem
                      label="Type"
                      value={formatNotificationType(notification.type)}
                    />
                    <InfoItem
                      label="Statut"
                      value={isRead ? "Lue" : "Non lue"}
                    />
                    <InfoItem
                      label="Date"
                      value={formatDateTime(notification.createdAt)}
                    />
                    <InfoItem
                      label="Ressource"
                      value={buildResourceLabel(notification)}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="notification-meta-item">
      <span>{label}</span>
      <strong>{value || "Non renseigné"}</strong>
    </div>
  );
}

function formatNotificationType(type) {
  if (!type) {
    return "Notification";
  }

  return type
    .toString()
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatDateTime(value) {
  if (!value) {
    return "Non renseignée";
  }

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildResourceLabel(notification) {
  if (!notification.resourceType && !notification.resourceId) {
    return "Non liée";
  }

  if (notification.resourceType && notification.resourceId) {
    return `${notification.resourceType} #${notification.resourceId}`;
  }

  return notification.resourceType || `#${notification.resourceId}`;
}

export default NotificationsPage;