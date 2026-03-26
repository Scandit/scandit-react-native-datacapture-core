import {TurboModule, TurboModuleRegistry} from 'react-native';
import type {EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';

/**
 * Unified event payload for all Scandit events.
 * Events are filtered by name on the JS side.
 */
export type ScanditEventPayload = {
  name: string;
  data: string;
  viewId?: number;
  modeId?: number;
};

export interface Spec extends TurboModule {
  readonly getConstants: () => {
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    Defaults: Object;
  };

  // Events - unified event emitter for all Core events
  readonly onScanditEvent: EventEmitter<ScanditEventPayload>;

  // View methods - use Object so codegen produces NSDictionary on iOS (see Codegen Typings appendix)
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  createDataCaptureView(data: Object): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  removeDataCaptureView(data: Object): Promise<void>;

  // Single entry point for all Core operations - use Object so codegen produces NSDictionary on iOS
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  executeCore(data: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ScanditDataCaptureCore');

