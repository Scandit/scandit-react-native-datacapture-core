import { DependencyList, MutableRefObject } from 'react';
import { DataCaptureOverlay } from 'scandit-datacapture-frameworks-core';
import type { DataCaptureView } from '../../DataCaptureView';
export interface UseOverlayOptions<O extends DataCaptureOverlay> {
    /**
     * Ref to the underlying `DataCaptureView`. The overlay is added the first
     * time `attach()` is called with `view.current` non-null.
     */
    view: MutableRefObject<DataCaptureView | null>;
    /**
     * Whether the overlay should be attached. Defaults to `true`. Toggling at
     * runtime triggers a detach/re-attach while the mode is otherwise attached.
     */
    enabled?: boolean;
    /**
     * Build the overlay. Re-invoked whenever `factoryDeps` change while the
     * overlay is attached — the old overlay is removed and the new one added,
     * preserving order with respect to `useMode`'s lifecycle.
     */
    factory: () => O;
    /**
     * Deps that trigger a recreate (`removeOverlay` → `factory()` → `addOverlay`).
     * Use for constructor-time props (e.g. overlay style). Defaults to `[]`.
     */
    factoryDeps?: DependencyList;
    /**
     * Apply mutable state to the overlay (brushes, viewfinder, scan-area guides).
     * Runs once after attach and whenever `updateDeps` change while attached.
     */
    update?: (overlay: O) => void;
    /** Deps that re-trigger `update`. Defaults to `[]`. */
    updateDeps?: DependencyList;
}
export interface UseOverlayApi<O> {
    /**
     * Reactive overlay snapshot. `null` until attached and again after detach
     * (and momentarily during a `factoryDeps`-driven recreate). Pass to
     * `useModeListener` as the `mode` field so listener registration follows
     * the overlay lifecycle.
     */
    overlay: O | null;
    /** Non-reactive accessor for imperative reads. */
    getOverlay: () => O | null;
    /** Add the overlay to the view. Idempotent. Call from `useMode.attachables`. */
    attach: () => Promise<void>;
    /** Remove the overlay from the view. Idempotent. Call from `useMode.attachables`. */
    detach: () => Promise<void>;
}
/**
 * Lifecycle helper for `DataCaptureView` overlays. Pass the returned value into
 * `useMode({ attachables: [...] })` — `useMode` orders `attach()` after the
 * mode is added to the context and `detach()` before it's removed.
 *
 * Listener registration is not handled here; pair with `useModeListener`
 * keyed on the reactive `overlay` snapshot:
 *
 * ```tsx
 * const basicOverlay = useOverlay<BarcodeBatchBasicOverlay>({ ... });
 *
 * useModeListener<BarcodeBatchBasicOverlay, BarcodeBatchBasicOverlayListener>({
 *   mode: basicOverlay.overlay,
 *   listenerFns: { brushForTrackedBarcode, didTapTrackedBarcode },
 *   addListener: (o, l) => { o.listener = l; },
 *   removeListener: o => { o.listener = null; },
 * });
 * ```
 */
export declare function useOverlay<O extends DataCaptureOverlay>(opts: UseOverlayOptions<O>): UseOverlayApi<O>;
