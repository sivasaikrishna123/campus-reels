export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  add(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now()
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Auto remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Convenience methods
  success(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({ type: 'success', title, message, ...options });
  }

  error(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({ type: 'error', title, message, duration: 7000, ...options });
  }

  warning(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({ type: 'warning', title, message, ...options });
  }

  info(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({ type: 'info', title, message, ...options });
  }
}

export const notifications = new NotificationManager();

