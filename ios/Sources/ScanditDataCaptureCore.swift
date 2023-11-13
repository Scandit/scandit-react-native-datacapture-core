/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditCaptureCore

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
    var context: DataCaptureContext? {
        willSet {
            context?.removeListener(self)
        }

        didSet {
            context?.addListener(self)
            pthread_mutex_lock(&dataCaptureContextListenersLock)
            defer { pthread_mutex_unlock(&dataCaptureContextListenersLock) }
            dataCaptureContextListeners
                .compactMap { $0 as? RNTDataCaptureContextListener }
                .forEach { $0.didUpdate(dataCaptureContext: context) }
        }
    }

    var dataCaptureView: DataCaptureView? {
        didSet {
            guard oldValue != dataCaptureView else { return }

            dataCaptureView?.addListener(self)

            pthread_mutex_lock(&dataCaptureViewListenersLock)
            defer {pthread_mutex_unlock(&dataCaptureViewListenersLock)}
            dataCaptureViewListeners
                .compactMap { $0 as? RNTDataCaptureViewListener }
                .forEach { $0.didUpdate(dataCaptureView: dataCaptureView) }
        }
    }
    
    public static var lastFrame: FrameData?

    lazy internal var contextDeserializer: DataCaptureContextDeserializer = {
        let contextDeserializer = DataCaptureContextDeserializer(frameSourceDeserializer: frameSourceDeserializer,
                                       viewDeserializer: dataCaptureViewDeserializer,
                                       modeDeserializers: modeDeserializers,
                                       componentDeserializers: componentDeserializers)
        
        contextDeserializer.avoidThreadDependencies = true
        return contextDeserializer
    }()

    lazy internal var dataCaptureViewDeserializer: DataCaptureViewDeserializer = {
        DataCaptureViewDeserializer(modeDeserializers: modeDeserializers)
    }()

    lazy internal var frameSourceDeserializer: FrameSourceDeserializer = {
        let frameSourceDeserializer = FrameSourceDeserializer(modeDeserializers: modeDeserializers)
        frameSourceDeserializer.delegate = self

        return frameSourceDeserializer
    }()

    static var rntSDCModeDeserializers = [DataCaptureModeDeserializer]()
    internal var modeDeserializers: [DataCaptureModeDeserializer] {
        ScanditDataCaptureCore.rntSDCModeDeserializers
    }

    static public func register(modeDeserializer: DataCaptureModeDeserializer) {

        rntSDCModeDeserializers.removeAll(where: {type(of: $0) == type(of: modeDeserializer)})

        rntSDCModeDeserializers.append(modeDeserializer)
    }

    static var rntSDCComponentDeserializers = [DataCaptureComponentDeserializer]()
    internal var componentDeserializers: [DataCaptureComponentDeserializer] {
        ScanditDataCaptureCore.rntSDCComponentDeserializers
    }

    static public func register(componentDeserializer: DataCaptureComponentDeserializer) {
        rntSDCComponentDeserializers.append(componentDeserializer)
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

    // dataCaptureViewListeners
    private var dataCaptureViewListenersLock = pthread_mutex_t()
    private lazy var dataCaptureViewListeners = NSMutableSet()

    private var dataCaptureContextListenersLock = pthread_mutex_t()
    private lazy var dataCaptureContextListeners = NSMutableSet()

    internal var hasListeners = false

    public override class func requiresMainQueueSetup() -> Bool {
        true
    }

    public override var methodQueue: DispatchQueue! {
        sdcSharedMethodQueue
    }

    deinit {
        dispose()
    }

    @objc(contextFromJSON:resolve:reject:)
    func contextFromJSON(json: String,
                         resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let result = try self.contextDeserializer.context(fromJSONString: json)
                self.context = result.context
                self.dataCaptureView = result.view
                self.components = result.components
                resolve(nil)
            } catch let error as NSError {
                reject("\(error.code)", error.localizedDescription, error)
            }
        }
    }

    @objc(updateContextFromJSON:resolve:reject:)
    func updateContextFromJSON(json: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let context = self.context else {
                self.contextFromJSON(json: json, resolve: resolve, reject: reject)
                return
            }

            do {
                let result = try self.contextDeserializer.update(context,
                                                                 view: self.dataCaptureView,
                                                                 components: self.components,
                                                                 fromJSON: json)

                self.context = result.context
                self.dataCaptureView = result.view
                self.components = result.components
                resolve(nil)
            } catch let error as NSError {
                if (error.localizedDescription.contains("The mode cannot be updated: already initialized but")) {
                    self.contextFromJSON(json: json, resolve: resolve, reject: reject)
                    return
                }
                reject("\(error.code)", error.localizedDescription, error)
            }
        }
    }

    @objc
    func dispose() {
        context?.dispose()
        context = nil
    }

    @objc(emitFeedback:resolve:reject:)
    func emitFeedback(json: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let feedback = try Feedback(fromJSONString: json)
            feedback.emit()
            resolve(nil)
        } catch let error as NSError {
            reject("\(error.code)", error.localizedDescription, error)
        }
    }

    @objc(viewQuadrilateralForFrameQuadrilateral:resolve:reject:)
    func viewQuadrilateralForFrameQuadrilateral(json: String,
                                                resolve: RCTPromiseResolveBlock,
                                                reject: RCTPromiseRejectBlock) {
        var quadrilateral = Quadrilateral()
        guard SDCQuadrilateralFromJSONString(json, &quadrilateral) else {
            let error = ScanditDataCaptureCoreError.deserializationError
            reject(String(error.code), error.message, error)
            return
        }

        guard let dataCaptureView = dataCaptureView else {
            let error = ScanditDataCaptureCoreError.nilDataCaptureView
            reject(String(error.code), error.message, error)
            return
        }
        
        DispatchQueue.main.sync {
            let viewQuadrilateral = dataCaptureView.viewQuadrilateral(forFrameQuadrilateral: quadrilateral)
            let viewQuadrilateralJSON = viewQuadrilateral.jsonString
            
            resolve(viewQuadrilateralJSON)
        }
    }

    @objc(viewPointForFramePoint:resolve:reject:)
    func viewPointForFramePoint(json: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let framePoint = CGPoint(json: json) else {
            let error = ScanditDataCaptureCoreError.deserializationError
            reject(String(error.code), error.message, error)
            return
        }

        guard let dataCaptureView = dataCaptureView else {
            let error = ScanditDataCaptureCoreError.nilDataCaptureView
            reject(String(error.code), error.message, error)
            return
        }

        let viewPoint = dataCaptureView.viewPoint(forFramePoint: framePoint)
        resolve(viewPoint.jsonString)
    }

    @objc(getCurrentCameraState:resolve:reject:)
    func getCurrentCameraState(cameraPosition: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        var position = CameraPosition.unspecified
        SDCCameraPositionFromJSONString(cameraPosition, &position)
        let camera = Camera(position: position)
        let currentState = camera?.currentState ?? .off
        resolve(currentState.jsonString)
    }

    @objc(isTorchAvailable:resolve:reject:)
    func isTorchAvailable(cameraPosition: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        var position = CameraPosition.unspecified
        SDCCameraPositionFromJSONString(cameraPosition, &position)
        let camera = Camera(position: position)
        resolve(camera?.isTorchAvailable ?? false)
    }
    
    @objc(getLastFrame:reject:)
    func getLastFrame(resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
        guard let lastFrame = ScanditDataCaptureCore.lastFrame else {
            let error = ScanditDataCaptureCoreError.nilFrame
            reject(String(error.code), error.message, error)
            return
        }
        resolve(lastFrame.jsonString)
    }

    @objc(getLastFrameOrNull:reject:)
    func getLastFrameOrNull(resolve: @escaping RCTPromiseResolveBlock,
                            reject: @escaping RCTPromiseRejectBlock) {
        resolve(ScanditDataCaptureCore.lastFrame?.jsonString)
    }

    public func addRNTDataCaptureViewListener(_ listener: RNTDataCaptureViewListener) {
        pthread_mutex_lock(&dataCaptureViewListenersLock)
        defer {pthread_mutex_unlock(&dataCaptureViewListenersLock)}
        guard !dataCaptureViewListeners.contains(listener) else { return }
        dataCaptureViewListeners.add(listener)
        listener.didUpdate(dataCaptureView: dataCaptureView)
    }

    public func removeRNTDataCaptureViewListener(_ listener: RNTDataCaptureViewListener) {
        pthread_mutex_lock(&dataCaptureViewListenersLock)
        defer {pthread_mutex_unlock(&dataCaptureViewListenersLock)}
        dataCaptureViewListeners.remove(listener)
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

    // Empty methods to unify the logic on the TS side for supporting functionality automatically provided by RN on iOS,
    // but custom implemented on Android.
    @objc func registerListenerForCameraEvents() {
        // Empty on purpose
    }

    @objc func unregisterListenerForCameraEvents() {
        // Empty on purpose
    }

    @objc func registerListenerForEvents() {
        // Empty on purpose
    }

    @objc func unregisterListenerForEvents() {
        // Empty on purpose
    }

    @objc func registerListenerForViewEvents() {
        // Empty on purpose
    }

    @objc func unregisterListenerForViewEvents() {
        // Empty on purpose
    }
}
