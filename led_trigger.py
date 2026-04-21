#!/usr/bin/env python3
"""
BlinkKart IoT LED Trigger Script
=================================
Triggered by the Node.js backend when an order is placed.
Supports three modes:
  1. SIMULATION  – prints LED activity to console (default)
  2. RASPBERRY PI – uses RPi.GPIO to toggle a real GPIO pin
  3. ESP32/Arduino – sends serial command to connected microcontroller

Usage:
  python3 led_trigger.py '{"order_id":"BK-1001","item_count":3,"total":245}'

Hardware wiring (Raspberry Pi):
  GPIO pin 18 (BCM) → 220Ω resistor → LED anode (+)
  LED cathode (−)   → GND

Hardware wiring (ESP32 / Arduino):
  Connect via USB serial; the script sends "LED_ON\n" over UART.
"""

import sys
import json
import time
import os

# ── Configuration ────────────────────────────────────────────────
GPIO_PIN       = 18          # BCM pin number for LED
LED_ON_SECONDS = 3.0         # How long to keep the LED on
SERIAL_PORT    = "/dev/ttyUSB0"   # Change to COM3, etc. on Windows
SERIAL_BAUD    = 9600

# Auto-detect hardware mode
def detect_mode():
    # Check for Raspberry Pi
    try:
        with open("/proc/cpuinfo") as f:
            if "Raspberry Pi" in f.read():
                return "rpi"
    except FileNotFoundError:
        pass

    # Check for serial device (ESP32 / Arduino)
    if os.path.exists(SERIAL_PORT):
        return "serial"

    # Default: simulation
    return "simulation"


# ── LED Drivers ──────────────────────────────────────────────────

def led_simulation(order):
    """Simulate LED behaviour with console output."""
    border = "═" * 50
    print(f"\n{border}")
    print(f"  💡 ORDER RECEIVED – LED SIGNAL TRIGGERED")
    print(f"{border}")
    print(f"  Order ID   : {order.get('order_id', 'N/A')}")
    print(f"  Items      : {order.get('item_count', 0)} item(s)")
    print(f"  Total      : ₹{order.get('total', 0)}")
    print(f"{border}")

    # Simulate LED blinking
    for i in range(3):
        print(f"  🟢 GPIO {GPIO_PIN}  → HIGH  (LED ON  – pulse {i+1}/3)")
        time.sleep(0.4)
        print(f"  ⚫ GPIO {GPIO_PIN}  → LOW   (LED OFF)")
        time.sleep(0.2)

    print(f"\n  ✅ Signal complete. Delivery dispatched!")
    print(f"{border}\n")


def led_raspberry_pi(order):
    """Control a real LED via Raspberry Pi GPIO."""
    try:
        import RPi.GPIO as GPIO
    except ImportError:
        print("⚠  RPi.GPIO not installed. Run: pip install RPi.GPIO")
        print("   Falling back to simulation mode.\n")
        led_simulation(order)
        return

    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(GPIO_PIN, GPIO.OUT)

    print(f"🔌 [RPi] GPIO mode set. Pin {GPIO_PIN} configured as OUTPUT")
    print(f"📦 [RPi] Order {order.get('order_id')} received!")

    try:
        # Flash LED 3 times to signal order received
        for i in range(3):
            GPIO.output(GPIO_PIN, GPIO.HIGH)
            print(f"🟢 [RPi] GPIO {GPIO_PIN} HIGH – LED ON  (pulse {i+1}/3)")
            time.sleep(0.5)
            GPIO.output(GPIO_PIN, GPIO.LOW)
            print(f"⚫ [RPi] GPIO {GPIO_PIN} LOW  – LED OFF")
            time.sleep(0.3)

        # Final steady glow
        GPIO.output(GPIO_PIN, GPIO.HIGH)
        print(f"🟢 [RPi] GPIO {GPIO_PIN} HIGH – steady glow ({LED_ON_SECONDS}s)")
        time.sleep(LED_ON_SECONDS)
        GPIO.output(GPIO_PIN, GPIO.LOW)
        print(f"✅ [RPi] Order confirmed. LED off.")

    finally:
        GPIO.cleanup()
        print(f"🔌 [RPi] GPIO cleaned up.")


def led_serial_esp32(order):
    """Send LED command to ESP32/Arduino over serial."""
    try:
        import serial
    except ImportError:
        print("⚠  pyserial not installed. Run: pip install pyserial")
        print("   Falling back to simulation mode.\n")
        led_simulation(order)
        return

    try:
        ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=2)
        time.sleep(1.5)  # wait for device to initialise

        print(f"🔌 [Serial] Connected to {SERIAL_PORT} @ {SERIAL_BAUD} baud")
        print(f"📦 [Serial] Sending LED_ON command for order {order.get('order_id')}")

        # Send command with order metadata
        payload = f"LED_ON:{order.get('order_id', 'unknown')}:{order.get('total', 0)}\n"
        ser.write(payload.encode("utf-8"))
        print(f"📤 [Serial] Sent: {payload.strip()}")

        # Wait and then turn off
        time.sleep(LED_ON_SECONDS)
        ser.write(b"LED_OFF\n")
        print(f"📤 [Serial] Sent: LED_OFF")

        ser.close()
        print(f"✅ [Serial] Signal complete. Connection closed.")

    except Exception as e:
        print(f"❌ [Serial] Error: {e}")
        print("   Falling back to simulation mode.\n")
        led_simulation(order)


# ── Arduino / ESP32 sketch (reference) ──────────────────────────
ARDUINO_SKETCH_COMMENT = """
/* Corresponding Arduino/ESP32 sketch for this script:

const int LED_PIN = 2;  // Built-in LED on most ESP32 boards

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\\n');
    cmd.trim();
    if (cmd.startsWith("LED_ON")) {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("ACK:LED_ON");
    } else if (cmd == "LED_OFF") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("ACK:LED_OFF");
    }
  }
}
*/
"""


# ── Main ─────────────────────────────────────────────────────────
def main():
    # Parse order data from command-line argument
    order = {}
    if len(sys.argv) > 1:
        try:
            order = json.loads(sys.argv[1])
        except json.JSONDecodeError:
            print("⚠  Could not parse order JSON. Using empty order.")

    # Detect and run the appropriate mode
    mode = detect_mode()
    print(f"🔍 Hardware mode detected: {mode.upper()}")

    if mode == "rpi":
        led_raspberry_pi(order)
    elif mode == "serial":
        led_serial_esp32(order)
    else:
        led_simulation(order)

    sys.exit(0)


if __name__ == "__main__":
    main()
