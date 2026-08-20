const CONFIG = {
  deviceId: 3,
  hasHardwareTable: true,

  // --- MQTT (HiveMQ) settings, replaces the old local-IP tableWiFiIP approach ---
  // Old approach (fetch to tableWiFiIP over plain HTTP) breaks once this is hosted
  // on Firebase, since Firebase serves HTTPS and browsers block HTTPS pages from
  // calling http:// addresses (mixed content), and it also requires the tablet
  // and ESP32 to be on the exact same local network.
  mqttBrokerUrl: "wss://broker.hivemq.com:8884/mqtt", // public HiveMQ broker over secure websocket
  mqttTopicPrefix: "sltc-agripulse-kiosk", // change this to something unique to your project
  // Final topics used: {prefix}/control, {prefix}/seek, {prefix}/status
  // Update your ESP32 sketch to subscribe/publish to these exact same topic strings.

  products: [
    {
      id: "01",
      name: "Cassava Ice Cream Cone",
      subtitle: "Rotating Showcase Item 1",
      descFile: "assets/descriptions/dev3-p01.txt",
      highlights: ["Cassava flour", "Corn starch", "Sugar & milk", "Egg", "Butter &Vanilla", "Xanthan gum"],
      videoUrl: "assets/videos/sample.mp4"
    },
    {
      id: "02",
      name: "Gluten free Colocasia Muffins ",
      subtitle: "Rotating Showcase Item 2",
      descFile: "assets/descriptions/dev3-p02.txt",
      highlights: ["Colocasia flour", "Rice flour (For Colocasia & Rice Muffin)", "Butter", "Sugar & Milk", "Eggs", "Baking powder"],
      videoUrl: "assets/videos/sample.mp4"
    },
    {
      id: "03",
      name: "JACKVANA -Jack Seed Sausage",
      subtitle: "Rotating Showcase Item 3",
      descFile: "assets/descriptions/dev3-p03.txt",
      highlights: ["Jackseed flour", "Rice flour", "Corn flour"],
      videoUrl: "assets/videos/sample.mp4"
    },
    {
      id: "04",
      name: "Kehipiththan Functional Boba Pearls ",
      subtitle: "Rotating Showcase Item 4",
      descFile: "assets/descriptions/dev3-p04.txt",
      highlights: ["Kehipiththan leaf extract", "Lemon", "Sugar"],
      videoUrl: "assets/videos/sample.mp4"
    },
    {
      id: "05",
      name: "Functional Sesame Seed Spreads",
      subtitle: "Rotating Showcase Item 5",
      descFile: "assets/descriptions/dev3-p05.txt",
      highlights: ["Sesame", "coconut oil", "spices(garlic/ garlic and pepper/chili)"],
      videoUrl: "assets/videos/sample.mp4"
    },
    {
      id: "06",
      name: "Choco Kurakkan Kithul Crunch Bar",
      subtitle: "Rotating Showcase Item 6",
      descFile: "assets/descriptions/dev3-p06.txt",
      highlights: ["Kurakkan flour", "Kithul flour", "Kithul treacle", "Peanuts & Soya beans"],
      videoUrl: "assets/videos/sample.mp4"
    }
  ]
};