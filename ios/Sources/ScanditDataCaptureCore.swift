/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditCaptureCore
import ScanditFrameworksCore

public let sdcSharedMethodQueue = DispatchQueue(
    label: "com.scandit.reactnative.methodQueue",
    qos: .userInteractive
)

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
            return
                "Unable to add the DataCaptureView with the provided json. The json doesn't contain the viewId field."
        case .nilContainerView:
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
        guard
            let manager = bridge.module(for: RNTSDCDataCaptureViewManager.self)
                as? RNTSDCDataCaptureViewManager
        else {
            fatalError("RNTSDCDataCaptureViewManager not registered in bridge")
        }
        return manager
    }()

    public override init() {
        super.init()
        let emitter = ReactNativeEmitter(emitter: self)
        coreModule = CoreModule.create(emitter: emitter)
        coreModule.didStart()
        DefaultServiceLocator.shared.register(module: coreModule)
    }

    static public func register(modeDeserializer: DataCaptureModeDeserializer) {
        Deserializers.Factory.add(modeDeserializer)
    }

    static public func unregister(modeDeserializer: DataCaptureModeDeserializer) {
        Deserializers.Factory.remove(modeDeserializer)
    }

    static var rntSDCComponentDeserializers: [DataCaptureComponentDeserializer] = []
    internal var componentDeserializers: [DataCaptureComponentDeserializer] {
        ScanditDataCaptureCore.rntSDCComponentDeserializers
    }

    internal var components: [DataCaptureComponent] = [] {
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
            "Defaults": coreModule.getDefaults(),
            "Version": DataCaptureVersion.version(),
        ]
    }

    public override func supportedEvents() -> [String]! {
        ScanditFrameworksCoreEvent.allCases.map { $0.rawValue }
    }

    public override func invalidate() {
        super.invalidate()
        coreModule.didStop()
        RNTSDCDataCaptureViewManager.containers.removeAll()
        let className = String(describing: type(of: coreModule))
        DefaultServiceLocator.shared.remove(clazzName: className)
    }

    deinit {
        invalidate()
    }

    @objc(createDataCaptureView:resolve:reject:)
    func createDataCaptureView(
        data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let viewJson = data["viewJson"] as? String else {
            reject(String(ScanditDataCaptureCoreError.nilParameter.code), "Missing viewJson parameter", nil)
            return
        }

        // Id assigned to the RN Component that on iOS is set in the reactTag of the Native View
        let viewId = JSONValue(string: viewJson).integer(forKey: "viewId", default: -1)

        if viewId == -1 {
            reject(
                String(ScanditDataCaptureCoreError.nilViewId.code),
                ScanditDataCaptureCoreError.nilViewId.message,
                nil
            )
            return
        }

        // In case something wrong happens with the creation of the View, the JS part will be notified inside
        // the shared code.
        self.coreModule.createDataCaptureView(
            viewJson: viewJson,
            result: ReactNativeResult(resolve, reject),
            viewId: viewId
        ) { dcView in
            guard let dcView = dcView else { return }

            // If we already have a container created for this view, we just add the view to the container. If not the
            // ScanditDataCaptureViewManager will take care of adding the created view.
            if let container = RNTSDCDataCaptureViewManager.containers.first(where: {
                $0.reactTag == NSNumber(value: viewId)
            }) {
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

    @objc(removeDataCaptureView:resolve:reject:)
    func removeDataCaptureView(
        data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        // handled through the ViewManager
        resolve(nil)
    }

    /// Single entry point for all Core operations.
    /// Routes method calls to the appropriate command via the shared command factory.
    @objc(executeCore:resolve:reject:)
    func executeCore(
        _ data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let result = ReactNativeResult(resolve, reject)
        let handled = coreModule.execute(
            ReactNativeMethodCall(data),
            result: result,
            module: coreModule
        )
        if !handled {
            let methodName = data["methodName"] as? String ?? "unknown"
            reject("METHOD_NOT_FOUND", "Unknown Core method: \(methodName)", nil)
        }
    }
}
