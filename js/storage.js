function getUsers() {
  return JSON.parse(localStorage.getItem("mindlink_users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("mindlink_users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("mindlink_current", JSON.stringify(user));
}

function getCurrentUser() {
  const u = localStorage.getItem("mindlink_current");
  return u ? JSON.parse(u) : null;
}
