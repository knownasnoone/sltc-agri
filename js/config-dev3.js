const CONFIG = {
  deviceId: 3,
  hasHardwareTable: true,

  // MQTT (HiveMQ) settings — must match the topic constants in the ESP32 sketch
  mqttBrokerUrl: "wss://broker.hivemq.com:8884/mqtt", // public HiveMQ broker, secure websocket
  mqttTopicPrefix: "sltc-agripulse-kiosk",
  // Resulting topics: sltc-agripulse-kiosk/control, /seek, /status

  products: [
    {
      id: "01",
      name: "Cassava Ice Cream Cone",
      subtitle: "Rotating Showcase Item 1",
      descFile: "assets/descriptions/dev3-p01.txt",
      highlights: ["Cassava flour", "Corn starch", "Sugar & milk", "Egg", "Butter &Vanilla", "Xanthan gum"],
      videoUrl: "assets/videos/Cassava Ice Cream Cone .mp4"
    },
    {
      id: "02",
      name: "Gluten free Colocasia Muffins ",
      subtitle: "Rotating Showcase Item 2",
      descFile: "assets/descriptions/dev3-p02.txt",
      highlights: ["Colocasia flour", "Rice flour (For Colocasia & Rice Muffin)", "Butter", "Sugar & Milk", "Eggs", "Baking powder"],
      videoUrl: "assets/videos/Gluten free Colocasia Muffins.mp4"
    },
    {
      id: "03",
      name: "JACKVANA -Jack Seed Sausage",
      subtitle: "Rotating Showcase Item 3",
      descFile: "assets/descriptions/dev3-p03.txt",
      highlights: ["Jackseed flour", "Rice flour", "Corn flour"],
      videoUrl: "assets/videos/JackSeed Sausage .mp4"
    },
    {
      id: "04",
      name: "Kehipiththan Functional Boba Pearls ",
      subtitle: "Rotating Showcase Item 4",
      descFile: "assets/descriptions/dev3-p04.txt",
      highlights: ["Kehipiththan leaf extract", "Lemon", "Sugar"],
      videoUrl: "assets/videos/Cyclea Peltata Functional Boba Pearls .mp4"
    },
    {
      id: "05",
      name: "Functional Sesame Seed Spreads",
      subtitle: "Rotating Showcase Item 5",
      descFile: "assets/descriptions/dev3-p05.txt",
      highlights: ["Sesame", "coconut oil", "spices(garlic/ garlic and pepper/chili)"],
      videoUrl: "assets/videos/Functional Sesame Seed Spreads .mp4"
    },
    {
      id: "06",
      name: "Choco Kurakkan Kithul Crunch Bar",
      subtitle: "Rotating Showcase Item 6",
      descFile: "assets/descriptions/dev3-p06.txt",
      highlights: ["Kurakkan flour", "Kithul flour", "Kithul treacle", "Peanuts & Soya beans"],
      videoUrl: "assets/videos/Choco Kurakkan Kithul Crunch Bar .mp4"
    }
  ]
};