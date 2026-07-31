export interface ControlHost<C> {
    addControl: (control: C) => Promise<void> | void;
    removeControl: (control: C) => Promise<void> | void;
}
/**
 * Adds `control` to `view` while both are present and the control reference is
 * stable. Removes the control on unmount or when either reference changes.
 *
 * The view is typically a `DataCaptureView` and the control is a Scandit
 * `Control` (e.g. `TorchSwitchControl`, `ZoomSwitchControl`). Pair this with
 * `useStableProp(control)` at the call site so inline `new XControl()`
 * instantiation doesn't churn add/remove.
 */
export declare function useNativeControl<V extends ControlHost<C>, C>(view: V | null, control: C | null | undefined): void;
