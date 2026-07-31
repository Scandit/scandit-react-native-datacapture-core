export type ViewHandle<T> = {
    /**
     * Ref callback to pass to the view. Updates both the internal mutable ref
     * and the reactive state so effects can depend on the view being mounted.
     */
    ref: (v: T | null) => void;
    /** Latest view instance for use inside effects/deps. */
    current: T | null;
    /** Same value as `current`, exposed as the mutable ref consumers also rely on. */
    mutableRef: React.MutableRefObject<T | null>;
    /** Stable, process-unique id used by views that need a parent-id linkage to native serialization. */
    id: number;
    /**
     * `onLayout` handler to pass to the native component. Fires when the view is
     * laid out (committed to the native tree), at which point `findNodeHandle`
     * returns a valid handle. This is the signal `whenReady` resolves on.
     */
    onLayout: () => void;
    /**
     * Resolves the first time the native view is laid out. Use this to gate
     * native-view creation instead of `InteractionManager.runAfterInteractions`:
     * layout is not starvable by a blocked JS interaction queue (e.g. a looping
     * animation with `useNativeDriver: false`), which would otherwise leave the
     * preview view never created. See SDC-32208.
     *
     * Callers that await `whenReady()` MUST also wire `onLayout` onto the mounted
     * native component — otherwise the promise never resolves.
     */
    whenReady: () => Promise<void>;
};
/**
 * Bundles the `ref + viewState + viewId` pattern that AIO views share.
 *
 * - The returned `ref` is stable across renders.
 * - `current` is a reactive snapshot — effects keyed on it re-run when the
 *   view mounts/unmounts. `mutableRef` exposes the same value for imperative
 *   reads that must not trigger re-renders.
 * - `id` is generated once per hook instance and stays stable for the lifetime
 *   of the component, suitable for `parentId` serialization.
 */
export declare function useViewHandle<T>(): ViewHandle<T>;
