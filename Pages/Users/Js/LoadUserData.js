  const userName = localStorage.getItem("userName");

  if (userName) {
    document.getElementById("welcome").textContent = `مرحبًا بك ${userName} 👋`;
  }
