+++
date = '2025-05-26T23:44:59-04:00'
draft = false
title = 'Track Active Users'

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


<h1>Users currently on this page: <span id="counter">loading...</span></h1>
<script>
  async function updateCounter() {
    try {
      const response = await fetch("https://ewbeo5zd9l.execute-api.us-east-1.amazonaws.com/default/activeUsers");
      const count = await response.text();
      document.getElementById("counter").textContent = count;
    } catch (e) {
      document.getElementById("counter").textContent = "Error fetching count" + e.message;
    }
  }
  updateCounter();
  setInterval(updateCounter, 10000); // update every 10 seconds
</script>

