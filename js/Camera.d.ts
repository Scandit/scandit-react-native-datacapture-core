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
    static get default(): Camera | null;
    static atPosition(cameraPosition: CameraPosition): Camera | null;
    get desiredState(): FrameSourceState;
    set desiredTorchState(desiredTorchState: TorchState);
    get desiredTorchState(): TorchState;
    private constructor();
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    addListener(listener: FrameSourceListener | null): void;
    removeListener(listener: FrameSourceListener | null): void;
    applySettings(settings: CameraSettings): Promise<void>;
    private didChange;
}
