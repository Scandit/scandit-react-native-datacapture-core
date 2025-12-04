/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditCaptureCore
import ScanditFrameworksCore


public let sdcSharedMethodQueue = DispatchQueue(label: "com.scandit.reactnative.methodQueue",
                                                qos: .userInteractive)

enum ScanditDataCaptureCoreError: Int, CustomNSError {
    case deserializationError = 1
    case nilDataCaptureView
    case nilFrame
    case nilViewId
    case nilContainerView
    case nilParameter

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
        case .nilViewId:
            return "Unable to add the DataCaptureView with the provided json. The json doesn't contain the viewId field."
        case.nilContainerView:
            return "Unable to add the DataCaptureView, the container with the provided tag was not found."
        case .nilParameter:
            return "Missing required parameter."
        }
    }

    var errorUserInfo: [String: Any] {
        [NSLocalizedDescriptionKey: message]
    }
}

@objc(ScanditDataCaptureCore)
class ScanditDataCaptureCore: RCTEventEmitter {

    var coreModule: CoreModule!

    lazy var dataCaptureViewManager: RNTSDCDataCaptureViewManager = {
        bridge.module(for: RNTSDCDataCaptureViewManager.self) as! RNTSDCDataCaptureViewManager
    }()

    public override init() {
        super.init()
        let emitter = ReactNativeEmitter(emitter: self)
        coreModule = CoreModule.create(emitter: emitter)
        coreModule.didStart()
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

    public override func invalidate() {
        super.invalidate()
        coreModule.didStop()
        RNTSDCDataCaptureViewManager.containers.removeAll()
    }

    deinit {
        invalidate()
    }

    @objc(contextFromJSON:resolve:reject:)
    func contextFromJSON(data: [String: Any],
                         resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        guard let contextJson = data["contextJson"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilParameter.code), "Missing contextJson parameter", nil)
            return
        }
        coreModule.createContextFromJSON(contextJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(updateContextFromJSON:resolve:reject:)
    func updateContextFromJSON(data: [String: Any],
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        guard let contextJson = data["contextJson"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilParameter.code), "Missing contextJson parameter", nil)
            return
        }
        coreModule.updateContextFromJSON(contextJson, result: ReactNativeResult(resolve, reject))
    }

    @objc
    func dispose() {
        coreModule.disposeContext()
    }

    @objc(emitFeedback:resolve:reject:)
    func emitFeedback(json: String,
                      resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        coreModule.emitFeedback(json: json, result: ReactNativeResult(resolve, reject))
    }

    @objc(viewQuadrilateralForFrameQuadrilateral:resolve:reject:)
    func viewQuadrilateralForFrameQuadrilateral(_ data: [String: Any],
                                                resolve: @escaping RCTPromiseResolveBlock,
                                                reject: @escaping RCTPromiseRejectBlock) {
        guard let viewId = data["viewId"] as? Int,
              let quadrilateralJson = data["quadrilateral"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilViewId.code), ScanditDataCaptureCoreError.nilViewId.message, nil)
            return
        }
        coreModule.viewQuadrilateralForFrameQuadrilateral(viewId: viewId, json: quadrilateralJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(viewPointForFramePoint:resolve:reject:)
    func viewPointForFramePoint(_ data: [String: Any],
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        guard let viewId = data["viewId"] as? Int,
              let pointJson = data["point"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilViewId.code), ScanditDataCaptureCoreError.nilViewId.message, nil)
            return
        }
        coreModule.viewPointForFramePoint(viewId: viewId, json: pointJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(getCurrentCameraState:resolve:reject:)
    func getCurrentCameraState(data: [String: Any],
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        guard let cameraPosition = data["position"] as? String else {
            ReactNativeResult(resolve, reject).reject(error: ScanditFrameworksCoreError.nilArgument)
            return
        }
        coreModule.getCameraState(cameraPosition: cameraPosition, result: ReactNativeResult(resolve, reject))
    }

    @objc(isTorchAvailable:resolve:reject:)
    func isTorchAvailable(data: [String: Any],
                          resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        guard let cameraPosition = data["position"] as? String else {
            ReactNativeResult(resolve, reject).reject(error: ScanditFrameworksCoreError.nilArgument)
            return
        }
        coreModule.isTorchAvailable(cameraPosition: cameraPosition, result: ReactNativeResult(resolve, reject))
    }

    @objc(switchCameraToDesiredState:resolve:reject:)
    func switchCameraToDesiredState(data: [String: Any],
                                    resolve: @escaping RCTPromiseResolveBlock,
                                    reject: @escaping RCTPromiseRejectBlock) {
        guard let desiredStateJson = data["desiredStateJson"] as? String else {
            ReactNativeResult(resolve, reject).reject(error: ScanditFrameworksCoreError.nilArgument)
            return
        }
        coreModule.switchCameraToDesiredState(
            stateJson: desiredStateJson,
            result: ReactNativeResult(resolve, reject)
        )
    }

    @objc(getFrame:resolve:reject:)
    func getFrame(data: [String: Any],
                  resolve: @escaping RCTPromiseResolveBlock,
                  reject: @escaping RCTPromiseRejectBlock) {
        guard let frameId = data["frameId"] as? String else {
            ReactNativeResult(resolve, reject).reject(error: ScanditFrameworksCoreError.nilArgument)
            return
        }
        coreModule.getLastFrameAsJson(frameId: frameId, result: ReactNativeResult(resolve, reject))
    }

    @objc func registerListenerForCameraEvents() {
        coreModule.registerFrameSourceListener()
    }

    @objc func unregisterListenerForCameraEvents() {
        coreModule.unregisterFrameSourceListener()
    }

    @objc func subscribeContextListener() {
        coreModule.registerDataCaptureContextListener()
    }

    @objc func unsubscribeContextListener() {
        coreModule.unregisterDataCaptureContextListener()
    }

    @objc(registerListenerForViewEvents:resolve:reject:)
    func registerListenerForViewEvents(viewId: Int,
                                             resolve: RCTPromiseResolveBlock,
                                             reject: RCTPromiseRejectBlock) {
        coreModule.registerDataCaptureViewListener(viewId: viewId)
        resolve(nil)
    }

    @objc(unregisterListenerForViewEvents:resolve:reject:)
    func unregisterListenerForViewEvents(viewId: Int,
                                               resolve: RCTPromiseResolveBlock,
                                               reject: RCTPromiseRejectBlock) {
        coreModule.unregisterDataCaptureViewListener(viewId: viewId)
        resolve(nil)
    }

    @objc(addModeToContext:resolve:reject:)
    func addModeToContext(data: [String: Any],
                          resolve: @escaping RCTPromiseResolveBlock,
                          reject: @escaping RCTPromiseRejectBlock) {
        guard let modeJson = data["modeJson"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilParameter.code), "Missing modeJson parameter", nil)
            return
        }
        coreModule.addModeToContext(modeJson: modeJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(removeModeFromContext:resolve:reject:)
    func removeModeFromContext(data: [String: Any],
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        guard let modeJson = data["modeJson"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilParameter.code), "Missing modeJson parameter", nil)
            return
        }
        coreModule.removeModeFromContext(modeJson: modeJson, result: ReactNativeResult(resolve, reject))
    }

    @objc(removeAllModes:reject:)
    func removeAllModes(resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping RCTPromiseRejectBlock) {
        coreModule.removeAllModes(result: ReactNativeResult(resolve, reject))
    }

    @objc(createDataCaptureView:resolve:reject:)
    func createDataCaptureView(viewJson: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {

        // Id assigned to the RN Component that on iOS is set in the reactTag of the Native View
        let viewId = JSONValue(string: viewJson).integer(forKey: "viewId", default: -1)

        if viewId == -1 {
            reject(String(ScanditDataCaptureCoreError.nilViewId.code), ScanditDataCaptureCoreError.nilViewId.message, nil)
            return
        }

        // In case something wrong happens with the creation of the View, the JS part will be notified inside
        // the shared code.
        if let dcView = self.coreModule.createDataCaptureView(viewJson: viewJson, result: ReactNativeResult(resolve, reject), viewId: viewId) {
            // If we already have a container created for this view, we just add the view to the container. If not the
            // ScanditDataCaptureViewManager will take care of adding the created view.
            if let container = RNTSDCDataCaptureViewManager.containers.first(where: { $0.reactTag == NSNumber(value: viewId) }) {
                dispatchMain {
                    if container.findFirstSubview(ofType: DataCaptureView.self) != nil {
                        // In StrictMode the createDataCaptureView function is called twice. If the container has already
                        // a DCView, there is no need to add another one.
                        return
                    }

                    dcView.frame = container.bounds
                    dcView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                    container.addSubview(dcView)
                }
            }
        }
    }

    @objc(updateDataCaptureView:resolve:reject:)
    func updateDataCaptureView(viewJson: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        coreModule.updateDataCaptureView(viewJson: viewJson, result: ReactNativeResult(resolve, reject))
    }


    @objc(getOpenSourceSoftwareLicenseInfo:reject:)
    func getOpenSourceSoftwareLicenseInfo(resolve: @escaping RCTPromiseResolveBlock,
                                          reject: @escaping RCTPromiseRejectBlock) {
        coreModule.getOpenSourceSoftwareLicenseInfo(result: ReactNativeResult(resolve, reject))
    }
}
