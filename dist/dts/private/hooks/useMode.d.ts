import { DependencyList, MutableRefObject } from 'react';
export type ModeLifecycleState = 'enabled' | 'disabled' | 'detached';
/**
 * Minimal shape of an overlay (or any resource) `useMode` can orchestrate.
 * Matches `UseOverlayApi` — `useOverlay` returns objects assignable to this.
 */
export interface ModeAttachable {
    attach: () => void | Promise<void>;
    detach: () => void | Promise<void>;
}
export interface UseModeOptions<TMode> {
    state: ModeLifecycleState;
    createMode: () => TMode;
    applySettings: (mode: TMode) => void | Promise<void>;
    setEnabled: (mode: TMode, enabled: boolean) => void;
    attach: (mode: TMode) => void | Promise<void>;
    detach: (mode: TMode) => void | Promise<void>;
    /**
     * Resources attached/detached in lockstep with the mode. Each is `attach()`-ed
     * after the consumer's `attach(mode)` resolves (in declaration order), and
     * `detach()`-ed before the consumer's `detach(mode)` is called (in reverse
     * order). Designed for the `UseOverlayApi` returned by `useOverlay`.
     */
    attachables?: ReadonlyArray<ModeAttachable>;
    /** Gate attach on external readiness (e.g. native view node mounted). Defaults to true. */
    canAttach?: boolean;
    /** Re-apply settings when any of these change (and the mode is attached). */
    settingsDeps: DependencyList;
}
export interface UseModeApi<TMode> {
    /** Lazy accessor. Creates the mode on first call; nulled out after detach. */
    getMode: () => TMode;
    /** Read-only view of the underlying ref. Null when no mode currently exists. */
    modeRef: MutableRefObject<TMode | null>;
    /** True while the mode is currently attached. */
    isAttached: () => boolean;
}
/**
 * Mode-lifetime state machine shared by SDK view components.
 *
 * Owns: lazy mode creation, attach/detach transitions driven by `state`,
 * `isEnabled` flips on `enabled`↔`disabled`, settings reapply on dep change,
 * and detach-on-unmount.
 *
 * Side-effecting callbacks (`attach`, `detach`, `applySettings`, `setEnabled`,
 * `createMode`) are read through a ref, so callers can pass closures without
 * memoizing — only `state`, `canAttach`, and `settingsDeps` drive effects.
 */
export declare function useMode<TMode>(options: UseModeOptions<TMode>): UseModeApi<TMode>;
