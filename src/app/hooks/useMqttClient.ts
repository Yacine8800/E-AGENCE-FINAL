// lib/useMqttClient.ts
import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { API_BOT_CIE_BROKER } from "@/config/constants";

export function useMqttClient(
  topic: string | null,
  onMessage: (payload: any) => void
) {
  const clientRef = useRef<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ne rien faire si pas de topic
    if (!topic) return;

    const client = mqtt.connect(API_BOT_CIE_BROKER, {
      reconnectPeriod: 1000, // Reconnect automatiquement toutes les 1s
    });

    clientRef.current = client;

    client.on("connect", () => {
      console.log("✅ Connected to MQTT");
      setIsConnected(true);

      client.subscribe(topic, (err) => {
        if (err) {
          console.error("❌ Subscription error:", err);
        } else {
          console.log(`📡 Subscribed to ${topic}`);
        }
      });
    });

    client.on("message", (receivedTopic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        onMessage(payload);
        console.log("📩 MQTT message reçu:", receivedTopic, message.toString());
      } catch (err) {
        console.warn("⚠️ Message JSON parse failed:", err);
      }
    });

    client.on("error", (err) => {
      console.error("❌ MQTT client error:", err.message);
    });

    client.on("close", () => {
      console.warn("⚠️ MQTT connection closed");
      setIsConnected(false);
    });

    return () => {
      console.log("👋 Cleaning up MQTT client");
      client.end(true);
    };
  }, [topic]);

  return { 
    client: clientRef.current,
    connected: isConnected 
  };
}
