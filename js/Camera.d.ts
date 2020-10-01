import { CameraPosition, CameraSettings, TorchState } from './Camera+Related';
import { FrameSource, FrameSourceListener, FrameSourceState } from './FrameSource';
import { DefaultSerializeable } from './private/Serializeable';
export declare class Camera extends DefaultSerializeable implements FrameSource {
    private type;
    private settings;
    private position;
    private _desiredTorchState;
    private _desiredState;
    private listeners;
    private _context;
    private set context(value);
    private get context();
    private proxy;
    static get default(): Optional<Camera>;
    static atPosition(cameraPosition: CameraPosition): Optional<Camera>;
    get desiredState(): FrameSourceState;
    set desiredTorchState(desiredTorchState: TorchState);
    get desiredTorchState(): TorchState;
    private constructor();
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    addListener(listener: Optional<FrameSourceListener>): void;
    removeListener(listener: Optional<FrameSourceListener>): void;
    applySettings(settings: CameraSettings): Promise<void>;
    private didChange;
}
