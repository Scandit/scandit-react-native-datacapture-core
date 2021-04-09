import { DataCaptureComponent, DataCaptureContext, DataCaptureMode } from '../DataCaptureContext';
import { ContextStatus, DataCaptureContextListener } from '../DataCaptureContext+Related';
import { DataCaptureContextProxy } from '../native/DataCaptureContextProxy';
import { PrivateDataCaptureView } from './PrivateDataCaptureView';
export interface PrivateDataCaptureContext {
    proxy: DataCaptureContextProxy;
    modes: [DataCaptureMode];
    components: [DataCaptureComponent];
    listeners: [DataCaptureContextListener];
    view: PrivateDataCaptureView | null;
    initialize: () => void;
    update: () => Promise<void>;
    addComponent: (component: DataCaptureComponent) => Promise<void>;
}
export interface PrivateDataCaptureComponent {
    _context: DataCaptureContext;
}
export interface PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
}
export interface ContextStatusJSON {
    code: number;
    isValid: boolean;
    message: string;
}
export interface PrivateContextStatus {
    fromJSON(json: ContextStatusJSON): ContextStatus;
}
