type PermissionStatus = 'granted' | 'denied' | 'not-determined' | 'restricted';
interface CameraPermissionResult {
    hasPermission: boolean;
    permissionStatus: PermissionStatus;
    requestPermission: () => Promise<boolean>;
}
/**
 * Manages camera permission status.
 *
 * **Android**: real status via `PermissionsAndroid`; `requestPermission()` shows the native
 * prompt; status re-checked when the app returns to the foreground (e.g. user flipped it
 * in Settings).
 *
 * **iOS**: limited. Without a platform-specific native module we can't query
 * `AVCaptureDevice.authorizationStatus` or drive the system prompt directly — iOS
 * handles the permission dialog automatically the first time the camera is accessed.
 * On iOS this hook returns `permissionStatus: 'not-determined'` initially and
 * optimistically flips to `'granted'` after `requestPermission()` is called.
 * It cannot detect denials after-the-fact; consumers should treat the iOS camera-start
 * flow as the authoritative signal (surfaced via `<BarcodeCaptureView onError={...} />`).
 *
 * ```tsx
 * const { hasPermission, requestPermission } = useCameraPermission();
 * if (!hasPermission) return <Button onPress={requestPermission} title="Grant Camera Access" />;
 * ```
 */
export declare function useCameraPermission(): CameraPermissionResult;
export {};
