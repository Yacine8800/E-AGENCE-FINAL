// lib/mqttClient.ts

import { API_BOT_CIE_BROKER } from "@/config/constants";
import mqtt from "mqtt";

let client: mqtt.MqttClient | null = null;

export function initMqttClient(
  onMessage: (topic: string, payload: string) => void,
  userId: number | null
) {
  // Assurer que le userId est défini, sinon utiliser une valeur par défaut
  const userIdValue = userId;

  console.log(userIdValue, "userIdService");
  const TOPIC = `user-${userIdValue}-messages`;
  if (client) return;

  client = mqtt.connect(API_BOT_CIE_BROKER);

  client.on("connect", () => {
    console.log(`Subscribed to topic: ${TOPIC}`);
    client!.subscribe(TOPIC, (err) => {
      if (err) console.error("❌ Failed to subscribe:", err);
      else console.log(`📡 Subscribed to topic: ${TOPIC}`);
    });
  });

  client.on("message", (topic, message) => {
    const payload = message.toString();
    onMessage(topic, payload);
  });

  client.on("error", (err) => {
    console.error("❌ MQTT error:", err);
  });

  client.on("close", () => {
    console.warn("⚠️ MQTT connection closed");
  });
}
