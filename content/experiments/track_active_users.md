+++
date = '2025-05-26T23:44:59-04:00'
draft = true
title = 'Track_active_users'

summary = ""
description = ""
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = []
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<body>
  <h1>Users currently on this page:</h1>
  <div id="count">0</div>

  <script>
    const apiBase = "https://fojj2q1igl.execute-api.us-east-1.amazonaws.com/";

    window.addEventListener("load", () => {
      fetch(`${apiBase}/enter`, { method: "POST" });

      setInterval(() => {
        fetch(`${apiBase}/count`)
          .then(res => res.json())
          .then(data => {
            document.getElementById("count").textContent = data.count;
          });
      }, 5000);
    });

    window.addEventListener("beforeunload", () => {
      navigator.sendBeacon(`${apiBase}/exit`);
    });
  </script>
</body>