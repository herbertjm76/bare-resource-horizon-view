
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import * as React from "react";
import { toast as sonnerToast } from "sonner";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const initialState: State = {
  toasts: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        const timeout = toastTimeouts.get(toastId);
        if (timeout) clearTimeout(timeout);

        const dismissTimeout = setTimeout(() => {
          dispatch({
            type: actionTypes.REMOVE_TOAST,
            toastId: toastId,
          });
        }, TOAST_REMOVE_DELAY);

        toastTimeouts.set(toastId, dismissTimeout);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

const listeners: Array<(state: State) => void> = [];

let memoryState: State = initialState;

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

interface ToastFunction {
  (props: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: Toast) => void;
  };
  success: (props: string | Toast) => void;
  error: (props: string | Toast) => void;
  warning: (props: string | Toast) => void;
  info: (props: string | Toast) => void;
}

export function toast(props: Toast) {
  const id = genId();

  const update = (props: Toast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  // Also trigger sonner toast for consistency
  if (props.title || props.description) {
    sonnerToast(props.title as string, {
      description: props.description as string,
    });
  }

  return {
    id,
    dismiss,
    update,
  };
}

// Add convenience methods to toast
(toast as ToastFunction).success = (props) => {
  if (typeof props === "string") {
    sonnerToast.success(props);
  } else {
    sonnerToast.success(props.title as string, {
      description: props.description as string,
    });
  }
};

(toast as ToastFunction).error = (props) => {
  if (typeof props === "string") {
    sonnerToast.error(props);
  } else {
    sonnerToast.error(props.title as string, {
      description: props.description as string,
    });
  }
};

(toast as ToastFunction).warning = (props) => {
  if (typeof props === "string") {
    sonnerToast(props, { className: "bg-yellow-500" });
  } else {
    sonnerToast(props.title as string, {
      description: props.description as string,
      className: "bg-yellow-500",
    });
  }
};

(toast as ToastFunction).info = (props) => {
  if (typeof props === "string") {
    sonnerToast(props, { className: "bg-blue-500" });
  } else {
    sonnerToast(props.title as string, {
      description: props.description as string,
      className: "bg-blue-500",
    });
  }
};

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}
