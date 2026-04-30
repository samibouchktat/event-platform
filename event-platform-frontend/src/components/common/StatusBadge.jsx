function StatusBadge({ type = "default", value }) {
  const config = getBadgeConfig(type, value);

  return <span className={`badge ${config.className}`}>{config.label}</span>;
}

function getBadgeConfig(type, value) {
  if (type === "quote") {
    return getQuoteStatusConfig(value);
  }

  if (type === "booking") {
    return getBookingStatusConfig(value);
  }

  if (type === "deposit") {
    return getDepositStatusConfig(value);
  }

  if (type === "providerValidation") {
    return getProviderValidationConfig(value);
  }

  if (type === "account") {
    return getAccountStatusConfig(value);
  }

  if (type === "notification") {
    return getNotificationStatusConfig(value);
  }

  return {
    label: value || "Non défini",
    className: "badge-muted",
  };
}

function getQuoteStatusConfig(value) {
  const configs = {
    PENDING: {
      label: "En attente",
      className: "badge-warning",
    },
    IN_DISCUSSION: {
      label: "En discussion",
      className: "badge-info",
    },
    ACCEPTED: {
      label: "Acceptée",
      className: "badge-success",
    },
    REJECTED: {
      label: "Refusée",
      className: "badge-danger",
    },
    CANCELLED: {
      label: "Annulée",
      className: "badge-muted",
    },
  };

  return configs[value] || {
    label: value || "Statut inconnu",
    className: "badge-muted",
  };
}

function getBookingStatusConfig(value) {
  const configs = {
    PENDING_DEPOSIT: {
      label: "En attente d’acompte",
      className: "badge-warning",
    },
    CONFIRMED: {
      label: "Confirmée",
      className: "badge-success",
    },
    CANCELLED: {
      label: "Annulée",
      className: "badge-danger",
    },
    COMPLETED: {
      label: "Terminée",
      className: "badge-info",
    },
  };

  return configs[value] || {
    label: value || "Statut inconnu",
    className: "badge-muted",
  };
}

function getDepositStatusConfig(value) {
  if (value === true) {
    return {
      label: "Acompte payé",
      className: "badge-success",
    };
  }

  return {
    label: "Acompte non payé",
    className: "badge-warning",
  };
}

function getProviderValidationConfig(value) {
  if (value === true) {
    return {
      label: "Prestataire validé",
      className: "badge-success",
    };
  }

  return {
    label: "En attente validation",
    className: "badge-warning",
  };
}

function getAccountStatusConfig(value) {
  if (value === true) {
    return {
      label: "Compte actif",
      className: "badge-success",
    };
  }

  return {
    label: "Compte désactivé",
    className: "badge-danger",
  };
}

function getNotificationStatusConfig(value) {
  if (value === true) {
    return {
      label: "Lue",
      className: "badge-muted",
    };
  }

  return {
    label: "Non lue",
    className: "badge-warning",
  };
}

export default StatusBadge;