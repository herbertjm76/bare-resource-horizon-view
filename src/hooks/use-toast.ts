
import React, { createContext, useContext, useState } from "react";
import { toast as sonnerToast } from "sonner";

// Define our types for Toast
export interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  variant?: "default" | "destructive";
  duration?: number;
}

// Enhanced toast function interface
export interface ToastFunction {
  (props: ToastProps): {
    id: string;
    dismiss: () => void;
    update: (props: ToastProps) => void;
  };
  success: (props: ToastProps | string) => void;
  error: (props: ToastProps | string) => void;
  info: (props: ToastProps | string) => void;
  warning: (props: ToastProps | string) => void;
}

// Type for a single toast with required id and open properties
export type Toast = Required<Pick<ToastProps, "id" | "open">> & ToastProps;

// Type for toast state
type State = {
  toasts: Toast[];
};

// Create initial state
const initialState: State = {
  toasts: [],
};

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a context
export const ToastContext = createContext<{
  state: State;
  toast: ToastFunction;
}>({
  state: initialState,
  toast: ((() => {
    throw new Error("Toast context not initialized");
  }) as unknown) as ToastFunction,
});

// Define the provider
export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = useState<State>(initialState);

  // Create a new toast
  const toast = (((props: ToastProps) => {
    const id = props.id || generateId();
    const newToast: Toast = { ...props, id, open: true };

    setState((prev) => ({
      ...prev,
      toasts: [...prev.toasts, newToast],
    }));

    return {
      id,
      dismiss: () => dismissToast(id),
      update: (props: ToastProps) =>
        setState((prev) => ({
          ...prev,
          toasts: prev.toasts.map((toast) =>
            toast.id === id ? { ...toast, ...props } : toast
          ),
        })),
    };
  }) as unknown) as ToastFunction;

  // Dismiss a toast
  const dismissToast = (id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((toast) => toast.id !== id),
    }));
  };

  // Add helper methods to toast function
  toast.success = (props) => {
    if (typeof props === 'string') {
      sonnerToast.success(props);
    } else {
      sonnerToast.success(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id: props.id,
      });
    }
  };

  toast.error = (props) => {
    if (typeof props === 'string') {
      sonnerToast.error(props);
    } else {
      sonnerToast.error(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id: props.id,
      });
    }
  };

  toast.info = (props) => {
    if (typeof props === 'string') {
      sonnerToast.info(props);
    } else {
      sonnerToast.info(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id: props.id,
      });
    }
  };

  toast.warning = (props) => {
    if (typeof props === 'string') {
      sonnerToast.warning(props);
    } else {
      sonnerToast.warning(props.title || '', {
        description: props.description,
        duration: props.duration || 5000,
        id: props.id,
      });
    }
  };

  // Instead of JSX, create the element using React.createElement
  return React.createElement(
    ToastContext.Provider,
    { value: { state, toast } },
    children
  );
}

// Create a hook for using the toast
export function useToast(): {
  toast: ToastFunction;
  toasts: Toast[];
  dismissToast: (id: string) => void;
} {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    toast: context.toast,
    toasts: context.state.toasts,
    dismissToast: (id: string) => {
      // Create a proper immutable update instead of direct mutation
      context.state.toasts = context.state.toasts.filter(
        (toast) => toast.id !== id
      ) as Toast[];
    },
  };
}

// Export toast as a standalone function
export const toast = (((props: ToastProps) => {
  return sonnerToast(props.title as string, {
    description: props.description,
    duration: props.duration || 5000,
    id: props.id,
  });
}) as unknown) as ToastFunction;

// Add helper methods to toast function
toast.success = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast.success(props);
  }
  return sonnerToast.success(props.title as string, {
    description: props.description,
    duration: props.duration || 5000,
    id: props.id,
  });
};

toast.error = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast.error(props);
  }
  return sonnerToast.error(props.title as string, {
    description: props.description,
    duration: props.duration || 5000,
    id: props.id,
  });
};

toast.info = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast.info(props);
  }
  return sonnerToast.info(props.title as string, {
    description: props.description,
    duration: props.duration || 5000,
    id: props.id,
  });
};

toast.warning = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast.warning(props);
  }
  return sonnerToast.warning(props.title as string, {
    description: props.description,
    duration: props.duration || 5000,
    id: props.id,
  });
};
