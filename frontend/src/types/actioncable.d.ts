declare module "@rails/actioncable" {
  export interface Subscription {
    unsubscribe(): void;
  }

  export interface Cable {
    subscriptions: {
      create(
        channel: Record<string, string>,
        callbacks: {
          connected?: () => void;
          disconnected?: () => void;
          rejected?: () => void;
          received?: (data: unknown) => void;
        },
      ): Subscription;
    };
  }

  export function createConsumer(url?: string): Cable;
}