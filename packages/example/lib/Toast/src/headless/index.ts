import { toast } from '../core/toast';

export { useStore as useToasterStore } from '../core/store';
export { resolveValue } from '../core/types';
export type {
  DefaultToastOptions,
  IconTheme,
  Renderable,
  Toast,
  ToastOptions,
  ToastPosition,
  ToastType,
  ToasterProps,
  ValueFunction,
  ValueOrFunction,
} from '../core/types';
export { useToaster } from '../core/use-toaster';
export { toast };

export default toast;
