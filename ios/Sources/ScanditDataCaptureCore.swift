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
        }
    }

    var errorUserInfo: [String: Any] {
        [NSLocalizedDescriptionKey: message]
    }
}

@objc(ScanditDataCaptureCore)
public class ScanditDataCaptureCore: RCTEventEmitter {

    var coreModule: CoreModule!

    lazy var dataCaptureViewManager: RNTSDCDataCaptureViewManager = {
        bridge.module(for: RNTSDCDataCaptureViewManager.self) as! RNTSDCDataCaptureViewManager
    }()

    public override init() {
        super.init()
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
        coreModule.disposeContext()
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

    @objc(getFrame:resolve:reject:)
    func getFrame(frameId: String,
                      resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        coreModule.getLastFrameAsJson(frameId: frameId, result: ReactNativeResult(resolve, reject))
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
