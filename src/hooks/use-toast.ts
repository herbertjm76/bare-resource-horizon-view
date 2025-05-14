
import * as React from "react";
import { toast as sonnerToast, type ToasterProps } from "sonner";

// Type for the toast action element
export type ToastActionElement = React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>;

// Type for our toast
export interface Toast {
  id?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Constants
const TOAST_LIMIT = 5;

// ID generator
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Define the state type explicitly with the correct typing
type State = {
  toasts: Array<Required<Pick<Toast, "id" | "open">> & Toast>;
};

// Initialize memory state
let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];

// Action types
type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Ensure the toast has id and open properties
      const newToast = {
        ...action.toast,
        id: action.toast.id || genId(),
        open: action.toast.open ?? true,
      };

      return {
        ...state,
        toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // If no toast id, dismiss all
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        };
      }

      // Dismiss single toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST": {
      const { toastId } = action;

      // If no toast id, remove all
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      // Remove single toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }
  }
};

// Dispatch function
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Define the type for our toast function with success/error methods
interface ToastFunction {
  (props: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: Toast) => void;
  };
  success: (description: string) => void;
  error: (description: string) => void;
  info: (description: string) => void;
  warning: (description: string) => void;
}

// Our main toast function
const toast = ((props: Toast) => {
  const id = props.id || genId();

  const update = (props: Toast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}) as ToastFunction;

// Add Sonner helper methods to our toast function
toast.success = (description: string) => sonnerToast.success(description);
toast.error = (description: string) => sonnerToast.error(description);
toast.info = (description: string) => sonnerToast.info(description);
toast.warning = (description: string) => sonnerToast.warning(description);

// Hook for using toast
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Export everything needed
export { useToast, toast };
