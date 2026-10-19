import { DataCaptureContext, DataCaptureContextCreationOptions, DataCaptureContextSettings } from 'scandit-datacapture-frameworks-core';
interface UseScanditContextOptions {
    /**
     * Applied at first render, then re-applied via `context.applySettings(...)`
     * whenever the reference changes. Memoize this with `useMemo` (or build it
     * once) — passing a fresh instance every render will spam `applySettings`.
     */
    settings?: DataCaptureContextSettings;
    /** Applied once at native initialization. Later changes are ignored. */
    creationOptions?: DataCaptureContextCreationOptions;
}
/**
 * Initializes (or retrieves) the DataCaptureContext singleton.
 *
 * ```tsx
 * const settings = useMemo(() => new DataCaptureContextSettings(), []);
 * const context = useScanditContext('YOUR_LICENSE_KEY', { settings });
 * ```
 */
export declare function useScanditContext(licenseKey: string, options?: UseScanditContextOptions): DataCaptureContext;
export {};
