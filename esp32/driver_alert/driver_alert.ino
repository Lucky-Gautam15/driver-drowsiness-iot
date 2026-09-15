/*
 * ======================================================================================
 * Project: IoT-Based Driver Drowsiness Detection System
 * Device:  ESP32 In-Cabin Alert & Safety Module
 * File:    driver_alert.ino
 * Description: Connects to WiFi, polls backend API for driver alertness status, and
 *              triggers loud audible buzzer, strobe warning LED, and vibration alerts.
 * ======================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ==========================================
// 1. NETWORK & BACKEND CONFIGURATION
// ==========================================
// Replace with your local WiFi credentials
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend API IP and Port (e.g., your computer's local IP on the same Wi-Fi network)
const char* BACKEND_HOST  = "http://192.168.1.100:5000";
const char* DEVICE_ID     = "ESP32-001";

// Polling interval in milliseconds
const unsigned long POLL_INTERVAL_MS = 1000;

// ==========================================
// 2. HARDWARE GPIO PIN DEFINITIONS
// ==========================================
const int PIN_BUZZER        = 18;  // Active/Passive Buzzer
const int PIN_RED_LED       = 19;  // Critical Alert Strobe LED
const int PIN_GREEN_LED     = 21;  // System Online / Safe LED
const int PIN_VIBRATION     = 22;  // Vibration Motor (via NPN transistor)
const int PIN_MUTE_BUTTON   = 4;   // Manual Acknowledge / Mute Push Button

// ==========================================
// 3. STATE VARIABLES
// ==========================================
unsigned long lastPollTime = 0;
unsigned long muteUntilTime = 0;
bool isAlertActive = false;
int currentScore = 0;
String currentStatus = "SAFE";

// ==========================================
// 4. SETUP ROUTINE
// ==========================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n==================================================");
  Serial.println("   DRIVER DROWSINESS IoT ALERT MODULE - ESP32     ");
  Serial.println("==================================================");

  // Initialize GPIO Pins
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_RED_LED, OUTPUT);
  pinMode(PIN_GREEN_LED, OUTPUT);
  pinMode(PIN_VIBRATION, OUTPUT);
  pinMode(PIN_MUTE_BUTTON, INPUT_PULLUP);

  // Self-test startup chime
  startupSelfTest();

  // Connect to Wi-Fi
  connectWiFi();
}

// ==========================================
// 5. MAIN LOOP
// ==========================================
void loop() {
  // Ensure Wi-Fi stays connected
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(PIN_GREEN_LED, LOW);
    connectWiFi();
  }

  // Handle hardware manual mute button
  if (digitalRead(PIN_MUTE_BUTTON) == LOW) {
    muteUntilTime = millis() + 10000; // Mute buzzer for 10 seconds
    Serial.println("[BUTTON] Driver pressed Mute. Silenced for 10s.");
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_VIBRATION, LOW);
    delay(300); // Debounce
  }

  // Poll backend status periodically
  if (millis() - lastPollTime >= POLL_INTERVAL_MS) {
    lastPollTime = millis();
    pollBackendAlertStatus();
  }

  // Drive alert hardware indicators
  handleAlertIndicators();
}

// ==========================================
// 6. BACKEND POLLING VIA HTTP
// ==========================================
void pollBackendAlertStatus() {
  HTTPClient http;

  String endpoint = String(BACKEND_HOST) + "/api/devices/esp32/alert-status?deviceId=" + String(DEVICE_ID);
  
  http.begin(endpoint);
  http.setTimeout(2000); // 2 second timeout

  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    
    // Parse JSON values
    isAlertActive = parseJsonBool(payload, "alert");
    currentScore = parseJsonInt(payload, "score");
    currentStatus = parseJsonString(payload, "status");

    Serial.printf("[IOT-SYNC] Status: %-8s | Score: %3d%% | Alert: %s\n",
                  currentStatus.c_str(),
                  currentScore,
                  isAlertActive ? "TRIGGERED (ACTIVE)" : "NORMAL");

    digitalWrite(PIN_GREEN_LED, HIGH); // Steady green when synced
  } else {
    Serial.printf("[HTTP-ERR] Failed to poll status, code: %d\n", httpCode);
    digitalWrite(PIN_GREEN_LED, LOW);
  }

  http.end();
}

// ==========================================
// 7. ALERT ACTUATOR ROUTINES
// ==========================================
void handleAlertIndicators() {
  bool isMuted = millis() < muteUntilTime;

  if (isAlertActive && currentStatus == "DROWSY") {
    // CRITICAL: Rapid alarm pattern
    digitalWrite(PIN_RED_LED, HIGH);
    if (!isMuted) {
      digitalWrite(PIN_BUZZER, HIGH);
      digitalWrite(PIN_VIBRATION, HIGH);
    }
    delay(100);
    digitalWrite(PIN_RED_LED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_VIBRATION, LOW);
    delay(100);
  }
  else if (isAlertActive && currentStatus == "WARNING") {
    // MODERATE WARNING: Slower beep
    digitalWrite(PIN_RED_LED, HIGH);
    if (!isMuted) {
      digitalWrite(PIN_BUZZER, HIGH);
    }
    delay(200);
    digitalWrite(PIN_RED_LED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    delay(300);
  }
  else {
    // SAFE STATE
    digitalWrite(PIN_RED_LED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_VIBRATION, LOW);
    digitalWrite(PIN_GREEN_LED, HIGH);
  }
}

// ==========================================
// 8. WIFI HELPER
// ==========================================
void connectWiFi() {
  Serial.printf("[WIFI] Connecting to %s", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(PIN_GREEN_LED, !digitalRead(PIN_GREEN_LED)); // Blink while connecting
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected successfully!");
    Serial.print("[WIFI] ESP32 Assigned IP: ");
    Serial.println(WiFi.localIP());
    digitalWrite(PIN_GREEN_LED, HIGH);
  } else {
    Serial.println("\n[WIFI] Connection failed. Retrying in background...");
    digitalWrite(PIN_GREEN_LED, LOW);
  }
}

// ==========================================
// 9. STARTUP SELF TEST
// ==========================================
void startupSelfTest() {
  Serial.println("[TEST] Running hardware actuator test...");
  digitalWrite(PIN_GREEN_LED, HIGH);
  digitalWrite(PIN_RED_LED, HIGH);
  digitalWrite(PIN_BUZZER, HIGH);
  digitalWrite(PIN_VIBRATION, HIGH);
  delay(300);
  digitalWrite(PIN_GREEN_LED, LOW);
  digitalWrite(PIN_RED_LED, LOW);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_VIBRATION, LOW);
  delay(200);
  digitalWrite(PIN_GREEN_LED, HIGH);
  Serial.println("[TEST] Hardware ready.");
}

// ==========================================
// 10. LIGHTWEIGHT JSON PARSER HELPERS
// (Eliminates mandatory heavy external libraries)
// ==========================================
bool parseJsonBool(const String& json, const String& key) {
  String searchKey = "\"" + key + "\":";
  int idx = json.indexOf(searchKey);
  if (idx == -1) return false;
  int startIdx = idx + searchKey.length();
  while (startIdx < json.length() && (json[startIdx] == ' ' || json[startIdx] == '\"')) startIdx++;
  return json.substring(startIdx).startsWith("true");
}

int parseJsonInt(const String& json, const String& key) {
  String searchKey = "\"" + key + "\":";
  int idx = json.indexOf(searchKey);
  if (idx == -1) return 0;
  int startIdx = idx + searchKey.length();
  while (startIdx < json.length() && json[startIdx] == ' ') startIdx++;
  return json.substring(startIdx).toInt();
}

String parseJsonString(const String& json, const String& key) {
  String searchKey = "\"" + key + "\":\"";
  int idx = json.indexOf(searchKey);
  if (idx == -1) return "UNKNOWN";
  int startIdx = idx + searchKey.length();
  int endIdx = json.indexOf("\"", startIdx);
  if (endIdx == -1) return "UNKNOWN";
  return json.substring(startIdx, endIdx);
}
