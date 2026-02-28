import { getCurrentInstance } from 'vue';
import type { OriginRef } from './types';

export function useForwardRef<E extends Record<string, any>>(
  ext?: E
): { forwardRef: (originRef: OriginRef) => void } {
  const instance = getCurrentInstance()!;
  function forwardRef(originRef: OriginRef) {
    instance.exposed = Object.assign(originRef || {}, ext);
    instance.exposeProxy = Object.assign(originRef || {}, ext);
  }
  return { forwardRef };
}
