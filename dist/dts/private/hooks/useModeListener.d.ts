export type UseModeListenerProps<TMode, TListener extends object> = {
    mode: TMode | null;
    listenerFns: TListener;
    addListener: (mode: TMode, listener: TListener) => void;
    removeListener: (mode: TMode, listener: TListener) => void;
};
/**
 * Registers a listener on a Scandit mode or view and keeps it up to date.
 *
 * Pass `listenerFns` with the callbacks you care about and leave the rest
 * `undefined`. The hook only registers when `mode` is non-null and at least
 * one callback is set; it unregisters automatically on unmount or when those
 * conditions stop being true.
 *
 * The proxy installed on the target contains methods **only for keys whose
 * values are currently defined**. This matters because some shared
 * controllers do `if (listener.foo)` truthy checks (e.g.
 * `BarcodeBatchBasicOverlayController.handleBrushForTrackedBarcode`) and a
 * proxy method that returns `undefined` is interpreted as a real `null`
 * response by the bridge — which wipes the configured default brush. When
 * the set of defined keys changes (a callback flips between defined and
 * undefined across renders), the proxy is rebuilt and the listener is
 * unregistered + re-registered.
 *
 * Inline functions are fine — within the "defined" set, the registered
 * listener is a stable proxy that always dispatches to the latest version of
 * each callback without re-registering.
 *
 * ```tsx
 * useModeListener<BarcodeCapture, BarcodeCaptureListener>({
 *   mode,
 *   listenerFns: {
 *     didScan: onScan ? async (_c, session, getFD) => onScan(session, getFD) : undefined,
 *   },
 *   addListener: (m, l) => m.addListener(l),
 *   removeListener: (m, l) => m.removeListener(l),
 * });
 * ```
 */
export declare function useModeListener<TMode, TListener extends object>({ mode, listenerFns, addListener, removeListener, }: UseModeListenerProps<TMode, TListener>): void;
