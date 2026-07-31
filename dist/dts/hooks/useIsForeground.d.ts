/**
 * Returns whether the app is currently in the foreground.
 * Useful for composing the `isActive` prop on scanning views:
 *
 * ```tsx
 * const isForeground = useIsForeground();
 * const isFocused = useIsFocused(); // from @react-navigation/native
 * <BarcodeCaptureView isActive={isFocused && isForeground} ... />
 * ```
 */
export declare function useIsForeground(): boolean;
