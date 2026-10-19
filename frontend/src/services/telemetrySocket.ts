import {
  createConsumer,
  type Cable,
  type Subscription,
} from "@rails/actioncable";

const WS_URL =
  "ws://localhost:3000/cable";

let consumer: Cable | null = null;
let subscription:
  | Subscription
  | null = null;

export interface TelemetrySocketCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onRejected?: () => void;
}

export function subscribeToTelemetry(
  onReceived: (
    data: unknown,
  ) => void,
  callbacks: TelemetrySocketCallbacks = {},
): Subscription {
  consumer ??=
    createConsumer(WS_URL);

  subscription =
    consumer.subscriptions.create(
      {
        channel:
          "TelemetryChannel",
      },
      {
        connected() {
          console.log(
            "Telemetry WebSocket connected",
          );

          callbacks.onConnected?.();
        },

        disconnected() {
          console.log(
            "Telemetry WebSocket disconnected",
          );

          callbacks.onDisconnected?.();
        },

        rejected() {
          console.error(
            "Telemetry WebSocket subscription rejected",
          );

          callbacks.onRejected?.();
        },

        received(
          data: unknown,
        ) {
          onReceived(data);
        },
      },
    );

  return subscription;
}

export function unsubscribeFromTelemetry(): void {
  subscription?.unsubscribe();
  subscription = null;
}