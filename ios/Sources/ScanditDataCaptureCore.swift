/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditCaptureCore
import ScanditFrameworksCore

public protocol RNTDataCaptureViewListener: class {
    func didUpdate(dataCaptureView: DataCaptureView?)
}

public protocol RNTDataCaptureContextListener: class {
    func didUpdate(dataCaptureContext: DataCaptureContext?)
}

public let sdcSharedMethodQueue = DispatchQueue(label: "com.scandit.reactnative.methodQueue",
                                                qos: .userInteractive)

enum ScanditDataCaptureCoreError: Int, CustomNSError {
    case deserializationError = 1
    case nilDataCaptureView
    case nilFrame

    var domain: String {
        "ScanditDataCaptureCoreErrorDomain"
    }

    var code: Int {
        rawValue
    }

    var message: String {
        switch self {
        case .deserializationError:
            return "Unable to deserialize a valid object."
        case .nilDataCaptureView:
            return "DataCaptureView is null."
        case .nilFrame:
            return "Frame is null, it might've been reused already."
        }
    }

    var errorUserInfo: [String: Any] {
        [NSLocalizedDescriptionKey: message]
    }
}

@objc(ScanditDataCaptureCore)
public class ScanditDataCaptureCore: RCTEventEmitter {

    var coreModule: CoreModule!

    public override init() {
        super.init()
        DeserializationLifeCycleDispatcher.shared.attach(observer: self)
        let emitter = ReactNativeEmitter(emitter: self)
        let frameworksFrameSourceListener = FrameworksFrameSourceListener(eventEmitter: emitter)
        let frameSourceDeserializer = FrameworksFrameSourceDeserializer(frameSourceListener: frameworksFrameSourceListener,
                                                                        torchListener: frameworksFrameSourceListener)
        let contextListener = FrameworksDataCaptureContextListener(eventEmitter: emitter)
        let viewListener = FrameworksDataCaptureViewListener(eventEmitter: emitter)
        coreModule = CoreModule(frameSourceDeserializer: frameSourceDeserializer,
                                frameSourceListener: frameworksFrameSourceListener,
                                dataCaptureContextListener: contextListener,
                                dataCaptureViewListener: viewListener)
        coreModule.didStart()
    }

    var context: DataCaptureContext? {
        didSet {
            pthread_mutex_lock(&dataCaptureContextListenersLock)
            defer { pthread_mutex_unlock(&dataCaptureContextListenersLock) }
            dataCaptureContextListeners
                .compactMap { $0 as? RNTDataCaptureContextListener }
                .forEach { $0.didUpdate(dataCaptureContext: context) }
        }
    }

    public static var lastFrame: FrameData?

    static public func register(modeDeserializer: DataCaptureModeDeserializer) {
        Deserializers.Factory.add(modeDeserializer)
    }

    static public func unregister(modeDeserializer: DataCaptureModeDeserializer) {
        Deserializers.Factory.remove(modeDeserializer)
    }

    static var rntSDCComponentDeserializers = [DataCaptureComponentDeserializer]()
    internal var componentDeserializers: [DataCaptureComponentDeserializer] {
        ScanditDataCaptureCore.rntSDCComponentDeserializers
    }

    internal var components = [DataCaptureComponent]() {
        didSet {
            componentsSet = Set<String>(components.map { $0.componentId })
        }
    }

    fileprivate var componentsSet = Set<String>()
    public func hasComponent(with id: String) -> Bool {
        componentsSet.contains(id)
    }

    private var dataCaptureContextListenersLock = pthread_mutex_t()
    private lazy var dataCaptureContextListeners = NSMutableSet()

    internal var hasListeners = false

    public override class func requiresMainQueueSetup() -> Bool {
        true
    }

    public override var methodQueue: DispatchQueue! {
        sdcSharedMethodQueue
    }

    public override func constantsToExport() -> [AnyHashable: Any]! {
        [
            "Defaults": coreModule.defaults.toEncodable(),
            "Version": DataCaptureVersion.version()
        ]
    }

    public override func supportedEvents() -> [String]! {
        ScanditFrameworksCoreEvent.allCases.map { $0.rawValue }
    }

    public override func startObserving() {
        coreModule.didStart()
    }

    public override func stopObserving() {
        coreModule.didStop()
    }

    public override func invalidate() {
        super.invalidate()
        dispose()
    }

    deinit {
        invalidate()
    }

    @objc(contextFromJSON:resolve:reject:)
    func contextFromJSON(json: String,
                         resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        coreModule.createContextFromJSON(json, result: ReactNativeResult(resolve, reject))
    }

    @objc(updateContextFromJSON:resolve:reject:)
    func updateContextFromJSON(json: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        coreModule.updateContextFromJSON(json, result: ReactNativeResult(resolve, reject))
    }

    @objc
    func dispose() {
        coreModule.didStop()
        DeserializationLifeCycleDispatcher.shared.detach(observer: self)
    }

    @objc(emitFeedback:resolve:reject:)
    func emitFeedback(json: String,
                      resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        coreModule.emitFeedback(json: json, result: ReactNativeResult(resolve, reject))
    }

    @objc(viewQuadrilateralForFrameQuadrilateral:resolve:reject:)
    func viewQuadrilateralForFrameQuadrilateral(json: String,
                                                resolve: @escaping RCTPromiseResolveBlock,
                                                reject: @escaping RCTPromiseRejectBlock) {
        coreModule.viewQuadrilateralForFrameQuadrilateral(json: json, result: ReactNativeResult(resolve, reject))
    }

    @objc(viewPointForFramePoint:resolve:reject:)
    func viewPointForFramePoint(json: String,
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        coreModule.viewPointForFramePoint(json: json, result: ReactNativeResult(resolve, reject))
    }

    @objc(getCurrentCameraState:resolve:reject:)
    func getCurrentCameraState(cameraPosition: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        coreModule.getCameraState(cameraPosition: cameraPosition, result: ReactNativeResult(resolve, reject))
    }

    @objc(isTorchAvailable:resolve:reject:)
    func isTorchAvailable(cameraPosition: String,
                          resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        coreModule.isTorchAvailable(cameraPosition: cameraPosition, result: ReactNativeResult(resolve, reject))
    }

    @objc(switchCameraToDesiredState:resolve:reject:)
    func switchCameraToDesiredState(desiredStateJson: String,
                                    resolve: @escaping RCTPromiseResolveBlock,
                                    reject: @escaping RCTPromiseRejectBlock) {
        coreModule.switchCameraToDesiredState(
            stateJson: desiredStateJson,
            result: ReactNativeResult(resolve, reject)
        )
    }

    @objc(getLastFrame:reject:)
    func getLastFrame(resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        LastFrameData.shared.getLastFrameDataJSON { lastFrame in
            guard let lastFrame = lastFrame else {
                let error = ScanditDataCaptureCoreError.nilFrame
                reject(String(error.code), error.message, error)
                return
            }
            resolve(lastFrame)
        }
    }

    @objc(getLastFrameOrNull:reject:)
    func getLastFrameOrNull(resolve: @escaping RCTPromiseResolveBlock,
                            reject: @escaping RCTPromiseRejectBlock) {
        resolve(LastFrameData.shared.frameData?.jsonString)
    }

    public func addRNTDataCaptureContextListener(_ listener: RNTDataCaptureContextListener) {
        pthread_mutex_lock(&dataCaptureContextListenersLock)
        defer { pthread_mutex_unlock(&dataCaptureContextListenersLock) }
        guard !dataCaptureContextListeners.contains(listener) else { return }
        dataCaptureContextListeners.add(listener)
        listener.didUpdate(dataCaptureContext: context)
    }

    public func removeRNTDataCaptureContextListener(_ listener: RNTDataCaptureContextListener) {
        pthread_mutex_lock(&dataCaptureContextListenersLock)
        defer {pthread_mutex_unlock(&dataCaptureContextListenersLock)}
        dataCaptureContextListeners.remove(listener)
    }

    @objc func registerListenerForCameraEvents() {
        coreModule.registerFrameSourceListener()
    }

    @objc func unregisterListenerForCameraEvents() {
        coreModule.unregisterFrameSourceListener()
    }

    @objc func registerListenerForEvents() {
        coreModule.registerDataCaptureContextListener()
    }

    @objc func unregisterListenerForEvents() {
        coreModule.unregisterDataCaptureContextListener()
    }

    @objc func registerListenerForViewEvents() {
        coreModule.registerDataCaptureViewListener()
    }

    @objc func unregisterListenerForViewEvents() {
        coreModule.unregisterDataCaptureViewListener()
    }

    @objc(addModeToContext:resolve:reject:)
    func addModeToContext(modeJson: String,
                          resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        coreModule.addModeToContext(modeJson: modeJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(removeModeFromContext:resolve:reject:)
    func removeModeFromContext(modeJson: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        coreModule.removeModeFromContext(modeJson: modeJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(removeAllModesFromContext:reject:)
    func removeAllModesFromContext(resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
        coreModule.removeAllModes(result: ReactNativeResult(resolve, reject))
    }

    @objc(createDataCaptureView:resolve:reject:)
    func createDataCaptureView(viewJson: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        _ = coreModule.createDataCaptureView(viewJson: viewJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(updateDataCaptureView:resolve:reject:)
    func updateDataCaptureView(viewJson: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        coreModule.updateDataCaptureView(viewJson: viewJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(addOverlay:resolve:reject:)
    func addOverlay(overlayJson: String,
                    resolve: @escaping RCTPromiseResolveBlock,
                    reject: @escaping RCTPromiseRejectBlock) {
        coreModule.addOverlayToView(overlayJson: overlayJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(removeOverlay:resolve:reject:)
    func removeOverlay(overlayJson: String,
                    resolve: @escaping RCTPromiseResolveBlock,
                    reject: @escaping RCTPromiseRejectBlock) {
        coreModule.removeOverlayFromView(overlayJson: overlayJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(removeAllOverlays:reject:)
    func removeAllOverlays(resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        coreModule.removeAllOverlays(result: ReactNativeResult(resolve, reject))
    }
}

extension ScanditDataCaptureCore: DeserializationLifeCycleObserver {
    public func dataCaptureContext(deserialized context: DataCaptureContext?) {
        self.context = context
    }
}
