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

public let SDCSharedMethodQeueue = DispatchQueue(label: "com.scandit.reactnative.methodQueue",
                                                 qos: .userInteractive)

enum ScanditDataCaptureCoreError: Int, CustomNSError {
    case deserializationError = 1
    case nilDataCaptureView
    case nilFrame

    var domain: String { return "ScanditDataCaptureCoreErrorDomain" }

    var code: Int {
        return rawValue
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
        return [NSLocalizedDescriptionKey: message]
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
        }
    }

    var dataCaptureView: DataCaptureView? {
        didSet {
            guard oldValue != dataCaptureView else { return }

            self.dataCaptureView?.addListener(self)

            pthread_mutex_lock(&dataCaptureViewListenersLock)
            defer {pthread_mutex_unlock(&dataCaptureViewListenersLock)}
            dataCaptureViewListeners
                .compactMap { $0 as? RNTDataCaptureViewListener }
                .forEach { $0.didUpdate(dataCaptureView: dataCaptureView) }
        }
    }
    
    public static var lastFrame: FrameData?

    lazy internal var contextDeserializer: DataCaptureContextDeserializer = {
        return DataCaptureContextDeserializer(frameSourceDeserializer: frameSourceDeserializer,
                                              viewDeserializer: dataCaptureViewDeserializer,
                                              modeDeserializers: modeDeserializers,
                                              componentDeserializers: componentDeserializers)
    }()

    lazy internal var dataCaptureViewDeserializer: DataCaptureViewDeserializer = {
        return DataCaptureViewDeserializer(modeDeserializers: modeDeserializers)
    }()

    lazy internal var frameSourceDeserializer: FrameSourceDeserializer = {
        let frameSourceDeserializer = FrameSourceDeserializer(modeDeserializers: modeDeserializers)
        frameSourceDeserializer.delegate = self

        return frameSourceDeserializer
    }()

    static var RNTSDCModeDeserializers = [DataCaptureModeDeserializer]()
    internal var modeDeserializers: [DataCaptureModeDeserializer] {
        return ScanditDataCaptureCore.RNTSDCModeDeserializers
    }

    static public func register(modeDeserializer: DataCaptureModeDeserializer) {

        RNTSDCModeDeserializers.removeAll(where: {type(of: $0) == type(of: modeDeserializer)})

        RNTSDCModeDeserializers.append(modeDeserializer)
    }

    static var RNTSDCComponentDeserializers = [DataCaptureComponentDeserializer]()
    internal var componentDeserializers: [DataCaptureComponentDeserializer] {
        return ScanditDataCaptureCore.RNTSDCComponentDeserializers
    }

    static public func register(componentDeserializer: DataCaptureComponentDeserializer) {
        RNTSDCComponentDeserializers.append(componentDeserializer)
    }

    internal var components = [DataCaptureComponent]() {
        didSet {
            componentsSet = Set<String>(components.map { $0.componentId })
        }
    }

    fileprivate var componentsSet = Set<String>()
    public func hasComponent(with id: String) -> Bool {
        return componentsSet.contains(id)
    }

    // dataCaptureViewListeners
    private var dataCaptureViewListenersLock = pthread_mutex_t()
    private lazy var dataCaptureViewListeners = NSMutableSet()

    internal var hasListeners = false

    public override class func requiresMainQueueSetup() -> Bool {
        return false
    }

    public override var methodQueue: DispatchQueue! {
        return SDCSharedMethodQeueue
    }

    deinit {
        dispose()
    }

    @objc(contextFromJSON:resolve:reject:)
    func contextFromJSON(JSON: String,
                         resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let result = try self.contextDeserializer.context(fromJSONString: JSON)
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
    func updateContextFromJSON(JSON: String,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let context = self.context else {
                self.contextFromJSON(JSON: JSON, resolve: resolve, reject: reject)
                return
            }

            do {
                let result = try self.contextDeserializer.update(context,
                                                                 view: self.dataCaptureView,
                                                                 components: self.components,
                                                                 fromJSON: JSON)

                self.context = result.context
                self.dataCaptureView = result.view
                self.components = result.components
                resolve(nil)
            } catch let error as NSError {
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
    func emitFeedback(JSON: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let feedback = try Feedback(fromJSONString: JSON)
            feedback.emit()
            resolve(nil)
        } catch let error as NSError {
            reject("\(error.code)", error.localizedDescription, error)
        }
    }

    @objc(viewQuadrilateralForFrameQuadrilateral:resolve:reject:)
    func viewQuadrilateralForFrameQuadrilateral(JSON: String,
                                                resolve: RCTPromiseResolveBlock,
                                                reject: RCTPromiseRejectBlock) {
        var quadrilateral = Quadrilateral()
        guard SDCQuadrilateralFromJSONString(JSON, &quadrilateral) else {
            let error = ScanditDataCaptureCoreError.deserializationError
            reject(String(error.code), error.message, error)
            return
        }

        guard let dataCaptureView = dataCaptureView else {
            let error = ScanditDataCaptureCoreError.nilDataCaptureView
            reject(String(error.code), error.message, error)
            return
        }

        let viewQuadrilateral = dataCaptureView.viewQuadrilateral(forFrameQuadrilateral: quadrilateral)
        let viewQuadrilateralJSON = viewQuadrilateral.jsonString

        resolve(viewQuadrilateralJSON)
    }

    @objc(viewPointForFramePoint:resolve:reject:)
    func viewPointForFramePoint(JSON: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let framePoint = CGPoint(json: JSON) else {
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

    // Empty methods to unify the logic on the TS side for supporting functionality automatically provided by RN on iOS,
    // but custom implemented on Android.

    @objc func registerListenerForCameraEvents() { }
    @objc func unregisterListenerForCameraEvents() { }
    @objc func registerListenerForEvents() { }
    @objc func unregisterListenerForEvents() { }
    @objc func registerListenerForViewEvents() { }
    @objc func unregisterListenerForViewEvents() { }
}
