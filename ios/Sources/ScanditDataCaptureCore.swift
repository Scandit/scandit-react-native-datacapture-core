/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditCaptureCore
import ScanditCaptureCoreDeserializer
import ScanditFrameworksCore

public let sdcSharedMethodQueue = DispatchQueue(
    label: "com.scandit.reactnative.methodQueue",
    qos: .userInteractive
)

/// Helper class to expose the shared method queue to Objective-C.
@objc(SDCSharedMethodQueue)
public class SDCSharedMethodQueue: NSObject {
    @objc public static var queue: DispatchQueue {
        sdcSharedMethodQueue
    }
}

/// Factory class for creating ReactNativeEmitter instances.
/// This is needed because the ReactNativeEmitter initializer isn't properly exported
/// across Swift module boundaries due to the RCTEventEmitter parameter type.
@objcMembers
public class ReactNativeEmitterFactory: NSObject {
    /// Creates a new ReactNativeEmitter with the given emitter.
    /// - Parameter emitter: An RCTEventEmitter instance (passed as Any to work around module visibility issues).
    /// - Returns: A new ReactNativeEmitter, or nil if the emitter is not an RCTEventEmitter.
    public static func create(emitter: Any) -> ReactNativeEmitter? {
        guard let rctEmitter = emitter as? RCTEventEmitter else {
            return nil
        }
        return ReactNativeEmitter(emitter: rctEmitter)
    }

    /// Creates a new ReactNativeEmitter with both old and new architecture emitters.
    /// - Parameters:
    ///   - emitter: An RCTEventEmitter instance (passed as Any to work around module visibility issues), can be nil in new arch.
    ///   - turboEmitter: Optional TurboModule emitter block for new architecture.
    /// - Returns: A new ReactNativeEmitter.
    public static func create(emitter: Any?, turboEmitter: SDCEventEmitBlock?) -> ReactNativeEmitter? {
        let rctEmitter = emitter as? RCTEventEmitter
        return ReactNativeEmitter(emitter: rctEmitter, turboEmitter: turboEmitter)
    }
}

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

/// Swift implementation for the Core native module.
/// This class contains all business logic and is used by the Obj-C++ adapter (NativeScanditDataCaptureCore).
/// Following the Adapter Pattern from React Native's TurboModule Swift guide.
@objcMembers
public class ScanditDataCaptureCoreImpl: NSObject {

    var coreModule: CoreModule!

    /// Reference to the RCTEventEmitter (the Obj-C++ adapter).
    /// Set by the adapter after initialization.
    weak var emitter: RCTEventEmitter?

    static var rntSDCComponentDeserializers: [DataCaptureComponentDeserializer] = []
    internal var componentDeserializers: [DataCaptureComponentDeserializer] {
        ScanditDataCaptureCoreImpl.rntSDCComponentDeserializers
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

    public override init() {
        super.init()
    }

    /// Called by the Obj-C++ adapter to set up the emitter reference and initialize the module.
    /// Must be called on the main thread (ensured by requiresMainQueueSetup).
    public func setup(with emitter: RCTEventEmitter) {
        self.emitter = emitter
        let reactEmitter = ReactNativeEmitter(emitter: emitter)
        coreModule = CoreModule.create(emitter: reactEmitter)
        coreModule.didStart()
        DefaultServiceLocator.shared.register(module: coreModule)

        // Eagerly initialize defaults on main thread.
        // This prevents Main Thread Checker errors when getConstants() is called later
        // from a background thread, since CoreDefaults creates UI components.
        _ = coreModule.getDefaults()
    }

    /// Called by the Obj-C++ adapter to set up the emitter reference and initialize the module (new architecture).
    /// Must be called on the main thread (ensured by requiresMainQueueSetup).
    /// - Parameters:
    ///   - emitter: The RCTEventEmitter (nil in new arch since we don't inherit from RCTEventEmitter).
    ///   - turboEmitter: TurboModule emitter block for new architecture.
    @objc(setupWith:turboEmitter:)
    public func setup(with emitter: RCTEventEmitter?, turboEmitter: SDCEventEmitBlock?) {
        self.emitter = emitter
        let reactEmitter = ReactNativeEmitter(emitter: emitter, turboEmitter: turboEmitter)

        coreModule = CoreModule.create(emitter: reactEmitter)
        coreModule.didStart()
        DefaultServiceLocator.shared.register(module: coreModule)

        // Eagerly initialize defaults on main thread.
        // This prevents Main Thread Checker errors when getConstants() is called later
        // from a background thread, since CoreDefaults creates UI components.
        _ = coreModule.getDefaults()
    }

    static public func register(modeDeserializer: DataCaptureModeDeserializer) {
        Deserializers.Factory.add(modeDeserializer)
    }

    static public func unregister(modeDeserializer: DataCaptureModeDeserializer) {
        Deserializers.Factory.remove(modeDeserializer)
    }

    /// Returns module constants (Defaults and Version).
    public func getConstants() -> [AnyHashable: Any] {
        guard let module = coreModule else {
            return [:]
        }
        return [
            "Defaults": module.getDefaults()
        ]
    }

    /// Returns the list of supported events.
    public func supportedEvents() -> [String] {
        ScanditFrameworksCoreEvent.allCases.map { $0.rawValue }
    }

    public func invalidate() {
        if let module = coreModule {
            module.didStop()
            let className = String(describing: type(of: module))
            DefaultServiceLocator.shared.remove(clazzName: className)
        }
        RNTSDCDataCaptureViewManager.containers.removeAll()
    }

    public func createDataCaptureView(
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
            // Check Paper (legacy arch) containers first, then Fabric (new arch) containers.
            let paperContainer = RNTSDCDataCaptureViewManager.containers.first {
                $0.reactTag == NSNumber(value: viewId)
            }
            let fabricContainer = RCTFabricDataCaptureViewContainers.containers().first {
                $0.tag == viewId
            }

            if let container = paperContainer ?? fabricContainer {
                let addViewToContainer = {
                    // Check if container already has a DataCaptureView (e.g., StrictMode calls twice)
                    let hasDataCaptureView = container.subviews.contains { $0 is DataCaptureView }
                    if hasDataCaptureView {
                        return
                    }

                    dcView.frame = container.bounds
                    dcView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                    container.addSubview(dcView)
                }

                dispatchMain {
                    // Use postFrameSetAction for both Paper and Fabric to ensure consistent timing
                    // If frame is already set (not zero), add immediately. Otherwise, wait for layoutSubviews.
                    if !container.frame.equalTo(.zero) {
                        addViewToContainer()
                    } else {
                        container.postFrameSetAction = {
                            addViewToContainer()
                        }
                    }
                }
            }
        }
    }

    public func removeDataCaptureView(
        data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        // handled through the ViewManager
        resolve(nil)
    }

    /// Single entry point for all Core operations.
    /// Routes method calls to the appropriate command via the shared command factory.
    public func executeCore(
        _ data: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let module = coreModule else {
            reject("MODULE_NOT_INITIALIZED", "CoreModule is not initialized. setup() may not have been called.", nil)
            return
        }
        let result = ReactNativeResult(resolve, reject)
        let handled = module.execute(
            ReactNativeMethodCall(data),
            result: result,
            module: module
        )
        if !handled {
            let methodName = data["methodName"] as? String ?? "unknown"
            reject("METHOD_NOT_FOUND", "Unknown Core method: \(methodName)", nil)
        }
    }
}
