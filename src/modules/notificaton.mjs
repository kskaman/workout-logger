// ../src/modules/notification.mjs

export function showNotification(message, type = "info") {
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  if (!notificationContainer) {
    console.error("Notification container not found.");
    return;
  }

  const notification = document.createElement("div");
  notification.classList.add("notification", `notification-${type}`);
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notificationContainer.removeChild(notification);
  }, 3000);
}
