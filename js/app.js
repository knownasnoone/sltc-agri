let idleTimer = null;
const IDLE_TIMEOUT_MS = 30000; // Auto reset after 30 seconds of inactivity

let themeHideTimer = null;
const THEME_HIDE_TIMEOUT_MS = 5000; // 5 seconds auto hide timer for theme button

document.addEventListener("DOMContentLoaded", () => {
  renderProductButtons();
  initTheme();
  initMQTT();
});

// --- MQTT (HiveMQ) SETUP ---
let mqttClient = null;
const MQTT_TOPICS = CONFIG && CONFIG.mqttTopicPrefix
  ? {
      control: `${CONFIG.mqttTopicPrefix}/control`,
      seek: `${CONFIG.mqttTopicPrefix}/seek`,
      status: `${CONFIG.mqttTopicPrefix}/status`
    }
  : null;

function initMQTT() {
  if (!CONFIG.hasHardwareTable || !CONFIG.mqttBrokerUrl) return;

  const clientId = "kiosk-dev" + CONFIG.deviceId + "-" + Math.random().toString(16).substr(2, 8);
  mqttClient = mqtt.connect(CONFIG.mqttBrokerUrl, { clientId: clientId });

  mqttClient.on("connect", () => {
    console.log("[MQTT] Connected to broker.");
    setMqttStatusDot(true);
    mqttClient.subscribe(MQTT_TOPICS.status, (err) => {
      if (!err) console.log("[MQTT] Subscribed to table status:", MQTT_TOPICS.status);
    });
  });

  mqttClient.on("reconnect", () => setMqttStatusDot(false));
  mqttClient.on("offline", () => setMqttStatusDot(false));
  mqttClient.on("error", (err) => {
    console.error("[MQTT] Connection error:", err);
    setMqttStatusDot(false);
  });

  mqttClient.on("message", (topic, message) => {
    if (topic === MQTT_TOPICS.status) {
      console.log("[MQTT] Table status:", message.toString());
      // Hook point: if you want to show "Rotating..." / "Arrived" on screen,
      // update the UI here based on the message content.
    }
  });
}

function setMqttStatusDot(connected) {
  const dot = document.getElementById("mqtt-status-dot");
  if (!dot) return;
  dot.style.background = connected ? "#4CAF50" : "#E53935";
}

// Render Buttons Grid from Config Data
function renderProductButtons() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  if (typeof CONFIG === "undefined" || !CONFIG.products) {
    console.error("Config file not loaded properly!");
    return;
  }

  CONFIG.products.forEach(product => {
    const btn = document.createElement("div");
    btn.className = "card-btn";
    btn.innerHTML = `
      <div class="card-number">${product.id}</div>
      <div class="card-label">${product.name}</div>
    `;
    btn.onclick = () => selectProduct(product);
    grid.appendChild(btn);
  });
}

// Product Selection Flow (With TXT Fetching & Fallback Handling)
async function selectProduct(product) {
  // 1. Populate Basic UI Fields
  document.getElementById("prod-badge").innerText = `PRODUCT ${product.id}`;
  document.getElementById("prod-title").innerHTML = product.name;
  document.getElementById("prod-subtitle").innerHTML = product.subtitle;

  // 2. Fetch Description from External .txt File
  const descElement = document.getElementById("prod-desc");
  descElement.innerText = "Loading details...";

  if (product.descFile) {
    try {
      const response = await fetch(product.descFile);
      if (response.ok) {
        const textContent = await response.text();
        descElement.innerHTML = textContent.trim() || product.desc || "Innovative agro-technology and sustainable solution developed by SLTC Research.";
      } else {
        descElement.innerHTML = product.desc || "Innovative eco-friendly food packaging solution derived from organic agricultural waste materials.";
      }
    } catch (error) {
      console.warn("TXT Fetch error (CORS or local mode):", error);
      descElement.innerHTML = product.desc || "Innovative eco-friendly food packaging solution derived from organic agricultural waste materials.";
    }
  } else {
    descElement.innerHTML = product.desc || "No description available.";
  }

  // Render Highlights
  const highlightsList = document.getElementById("prod-highlights");
  highlightsList.innerHTML = "";
  product.highlights.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = item;
    highlightsList.appendChild(li);
  });

  // 3. Switch Views
  document.getElementById("idle-view").classList.remove("active");
  document.getElementById("idle-view").classList.add("hidden");
  
  document.getElementById("active-view").classList.remove("hidden");
  document.getElementById("active-view").classList.add("active");

  // 4. Trigger ESP32 Wi-Fi Signal ONLY if Device 03 AND accessed via Main Tablet (Not Mobile / QR)
  const isMobileScreen = window.innerWidth <= 768;
  const isQRUser = new URLSearchParams(window.location.search).has("qr");

  if (CONFIG.hasHardwareTable && !isMobileScreen && !isQRUser) {
    sendSeekSignalToTable(product.id);
  } else if (CONFIG.hasHardwareTable) {
    console.log("[Hardware Ignored] Product clicked on Mobile/QR view. Table rotation signal bypassed.");
  }

  // 5. Start Inactivity Reset Counter
  resetInactivityTimer();
}

// Back Button Function
function closeDetails() {
  document.getElementById("active-view").classList.remove("active");
  document.getElementById("active-view").classList.add("hidden");

  document.getElementById("idle-view").classList.remove("hidden");
  document.getElementById("idle-view").classList.add("active");

  if (idleTimer) clearTimeout(idleTimer);
}

// Send Seek Signal to ESP32 Hardware Table over MQTT (HiveMQ)
function sendSeekSignalToTable(productNumber) {
  const colorId = parseInt(productNumber, 10) - 1;

  if (!mqttClient || !mqttClient.connected) {
    console.error("[MQTT] Not connected to broker, cannot send seek signal.");
    return;
  }

  mqttClient.publish(MQTT_TOPICS.seek, colorId.toString());
  console.log(`[MQTT] Sent seek request for Product ${productNumber} (Color ID: ${colorId}) on topic ${MQTT_TOPICS.seek}`);
}

// Auto Reset Timer
function resetInactivityTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    closeDetails();
  }, IDLE_TIMEOUT_MS);
}

// Secret Theme Touch Handler
function handleThemeTouch() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  if (toggleBtn.classList.contains("visible")) {
    toggleTheme();
  } else {
    toggleBtn.classList.add("visible");
  }

  startThemeHideTimer();
}

// Function to Toggle Dark/Light Mode
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("kiosk-theme", isDark ? "dark" : "light");
}

// Auto Hide Timer for Theme Button
function startThemeHideTimer() {
  if (themeHideTimer) clearTimeout(themeHideTimer);

  themeHideTimer = setTimeout(() => {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.classList.remove("visible");
    }
  }, THEME_HIDE_TIMEOUT_MS);
}

// Auto Load Saved Theme on Boot
function initTheme() {
  const savedTheme = localStorage.getItem("kiosk-theme");
  
  if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }
}

// Send Custom Messages (like E-STOP or CONT) to MQTT
window.publishMessage = function(topic, payload) {
  if (!mqttClient || !mqttClient.connected) {
    console.error("[MQTT] Not connected to broker, cannot send message.");
    return;
  }

  mqttClient.publish(topic, payload);
  console.log(`[MQTT] Published: ${payload} to topic: ${topic}`);
};
