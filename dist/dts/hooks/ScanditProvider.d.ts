import React from 'react';
import { CameraPosition, DataCaptureContext, DataCaptureContextCreationOptions, DataCaptureContextSettings, FrameSourceState, TorchState } from 'scandit-datacapture-frameworks-core';
type CameraProps = {
    frameSourceState?: FrameSourceState;
    torchState?: TorchState;
    cameraPosition?: CameraPosition;
};
export type ScanditProviderProps = CameraProps & {
    /** Required on the root provider. Ignored (with a warning) on nested ones. */
    licenseKey?: string;
    /** Only used on the root provider. */
    options?: DataCaptureContextCreationOptions;
    /** Only used on the root provider. */
    settings?: DataCaptureContextSettings;
    children: React.ReactNode;
};
/**
 * Provides a `DataCaptureContext` and a singleton `Camera` to descendant AIO views.
 *
 * - **Root** (no parent `<ScanditProvider>` above): creates the context + camera,
 *   disposes them on unmount.
 * - **Nested**: applies its own `frameSourceState` / `torchState` / `cameraPosition`
 *   props to the same singleton camera. Last writer wins; values are not reverted
 *   when a nested provider unmounts.
 *
 * The camera is recreated only when `cameraPosition` flips; torch and
 * `frameSourceState` are applied directly to the live camera.
 *
 * ```tsx
 * <ScanditProvider licenseKey={KEY}>
 *   <NavigationContainer> ... </NavigationContainer>
 * </ScanditProvider>
 *
 * // Screen-local control:
 * <ScanditProvider
 *   frameSourceState={isFocused ? FrameSourceState.On : FrameSourceState.Off}
 *   torchState={torch}
 *   cameraPosition={position}>
 *   <BarcodeCaptureView state="enabled" ... />
 * </ScanditProvider>
 * ```
 */
export declare function ScanditProvider(props: ScanditProviderProps): React.JSX.Element;
/** Internal — used by AIO views to attach modes to the shared context. */
export declare function useDataCaptureContextInternal(): DataCaptureContext;
export {};
