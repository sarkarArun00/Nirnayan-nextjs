"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import styles from "./Alert.module.css";

export type AlertType = "success" | "warning" | "error";

export interface AlertOptions {
  type: AlertType;
  title?: string;
  message: string;
  buttonText?: string;
  autoClose?: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  closeAlert: () => void;
}

type DialogState =
  | { kind: "alert"; options: AlertOptions }
  | { kind: "confirm"; options: ConfirmOptions };

const AlertContext = createContext<AlertContextType | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider.");
  }

  return context;
}

const defaultTitles: Record<AlertType, string> = {
  success: "Successful!",
  warning: "Attention Required",
  error: "Something Went Wrong",
};

function AlertIcon({ type }: { type: AlertType }) {
  if (type === "success") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.7 2.7L16.5 9" />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 2 20h20L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

export default function AlertProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  const closeAlert = useCallback(() => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  const showAlert = useCallback((options: AlertOptions) => {
    // If a confirmation is pending, cancel it first.
    resolverRef.current?.(false);
    resolverRef.current = null;

    setDialog({ kind: "alert", options });
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      // Never leave an earlier confirmation unresolved.
      resolverRef.current?.(false);
      resolverRef.current = resolve;

      setDialog({ kind: "confirm", options });
    });
  }, []);

  const finishConfirm = useCallback((accepted: boolean) => {
    resolverRef.current?.(accepted);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  // Auto-close only ordinary alerts, never confirmations.
  useEffect(() => {
    if (
      dialog?.kind !== "alert" ||
      !dialog.options.autoClose ||
      dialog.options.autoClose <= 0
    ) {
      return;
    }

    const timeout = window.setTimeout(closeAlert, dialog.options.autoClose);

    return () => window.clearTimeout(timeout);
  }, [dialog, closeAlert]);

  // Keyboard access and focus management.
  useEffect(() => {
    if (!dialog) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (dialog.kind === "confirm") {
      cancelButtonRef.current?.focus();
    } else {
      closeButtonRef.current?.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAlert();
      }

      if (event.key === "Tab") {
        const buttons =
          dialog.kind === "confirm"
            ? [cancelButtonRef.current, actionButtonRef.current]
            : [closeButtonRef.current, actionButtonRef.current];

        const available = buttons.filter(
          (button): button is HTMLButtonElement => button !== null,
        );

        if (!available.length) return;

        const first = available[0];
        const last = available[available.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      previousFocus?.focus();
    };
  }, [dialog, closeAlert]);

  // Resolve pending confirmations if provider unmounts.
  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
    };
  }, []);

  const isConfirmation = dialog?.kind === "confirm";

  const type: AlertType =
    dialog?.kind === "alert"
      ? dialog.options.type
      : dialog?.kind === "confirm" && dialog.options.destructive
        ? "error"
        : "warning";

  return (
    <AlertContext.Provider value={{ showAlert, confirm, closeAlert }}>
      {children}

      {dialog && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAlert();
            }
          }}
        >
          <div
            className={`${styles.dialog} ${styles[type]}`}
            role={isConfirmation ? "dialog" : "alertdialog"}
            aria-modal="true"
            aria-labelledby="global-alert-title"
            aria-describedby="global-alert-message"
          >
            {!isConfirmation && (
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.closeButton}
                onClick={closeAlert}
                aria-label="Close alert"
              >
                ×
              </button>
            )}

            <div className={styles.brand}>NIRNAYAN HEALTHCARE</div>

            <div className={styles.iconWrapper}>
              <AlertIcon type={type} />
            </div>

            <h2 id="global-alert-title" className={styles.title}>
              {dialog.options.title ||
                (isConfirmation ? "Are you sure?" : defaultTitles[type])}
            </h2>

            <p id="global-alert-message" className={styles.message}>
              {dialog.options.message}
            </p>

            {dialog.kind === "confirm" ? (
              <div className={styles.confirmActions}>
                <button
                  ref={cancelButtonRef}
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => finishConfirm(false)}
                >
                  {dialog.options.cancelText || "Cancel"}
                </button>

                <button
                  ref={actionButtonRef}
                  type="button"
                  className={`${styles.actionButton} ${
                    dialog.options.destructive ? styles.dangerButton : ""
                  }`}
                  onClick={() => finishConfirm(true)}
                >
                  {dialog.options.confirmText || "Yes"}
                </button>
              </div>
            ) : (
              <button
                ref={actionButtonRef}
                type="button"
                className={styles.actionButton}
                onClick={closeAlert}
              >
                {dialog.options.buttonText || "Continue"}
              </button>
            )}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
