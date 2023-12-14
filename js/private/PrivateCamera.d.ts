import { CameraPosition, CameraSettings, TorchState } from '../Camera+Related';
import { DataCaptureContext } from '../DataCaptureContext';
import { FrameSourceListener, FrameSourceState } from '../FrameSource';
import { CameraProxy } from '../native/CameraProxy';
export interface PrivateCamera {
    context: DataCaptureContext | null;
    position: CameraPosition;
    _desiredState: FrameSourceState;
    desiredTorchState: TorchState;
    settings: CameraSettings;
    listeners: FrameSourceListener[];
    _proxy: CameraProxy;
    proxy: CameraProxy;
    initialize: () => void;
    didChange: () => Promise<void>;
}
