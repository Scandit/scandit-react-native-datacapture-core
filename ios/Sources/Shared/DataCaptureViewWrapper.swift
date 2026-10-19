/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditFrameworksCore

/// A protocol that allows different architecture implementations to manage containers.
public protocol DataCaptureViewContainerManager: AnyObject {
    static var containers: [DataCaptureViewContainerWrapper] { get set }
}

/// A shared wrapper view that hosts the native DataCaptureView.
/// Used by both legacy (Paper) and new (Fabric) architecture implementations.
@objc
@objcMembers
open class DataCaptureViewContainerWrapper: UIView {

    /// The container manager that handles lifecycle notifications.
    /// Set by the concrete architecture implementation.
    public var containerManager: (any DataCaptureViewContainerManager.Type)?

    /// Action to execute once the frame is set (when layoutSubviews is called with non-zero frame).
    /// This ensures the container is ready before adding subviews.
    /// The action is automatically cleared after execution.
    public var postFrameSetAction: (() -> Void)?

    /// Tracks whether the frame has been set to a non-zero value.
    var isFrameSet: Bool = false

    public override func layoutSubviews() {
        super.layoutSubviews()
        if !frame.equalTo(.zero) && !isFrameSet {
            isFrameSet = true
            if let action = postFrameSetAction {
                postFrameSetAction = nil
                action()
            }
        }
    }

    public override func removeFromSuperview() {
        if let manager = containerManager,
            let index = manager.containers.firstIndex(where: { $0 === self })
        {
            dispatchMain {
                manager.containers.remove(at: index)
            }
        }
        if let droppedView = self.findFirstSubview(ofType: DataCaptureView.self) {
            DeserializationLifeCycleDispatcher.shared.dispatchDataCaptureViewRemoved(view: droppedView)
        }
        super.removeFromSuperview()
    }

    /// Called before a Fabric view is recycled for reuse.
    /// Removes all hosted subviews and resets internal state so the recycled container
    /// is ready to host a new view. If a DataCaptureView is present, notifies the
    /// framework so that the associated FrameworksDataCaptureView is properly disposed.
    @objc open func cleanupForRecycle() {
        if let dcView = self.findFirstSubview(ofType: DataCaptureView.self) {
            DeserializationLifeCycleDispatcher.shared.dispatchDataCaptureViewRemoved(view: dcView)
        }
        for subview in subviews {
            subview.removeFromSuperview()
        }
        isFrameSet = false
        postFrameSetAction = nil
    }

    public func findFirstSubview<T: UIView>(ofType type: T.Type) -> T? {
        self.subviews.first { $0 is T } as? T
    }

    public override func didMoveToSuperview() {
        super.didMoveToSuperview()
        if self.findFirstSubview(ofType: DataCaptureView.self) == nil {
            if !frame.equalTo(.zero) {
                attachDataCaptureViewIfAvailable()
            } else {
                postFrameSetAction = { [weak self] in
                    self?.attachDataCaptureViewIfAvailable()
                }
            }
        }
    }

    /// Attaches the DataCaptureView to this container if one has been created.
    /// Called when the container is added to the superview hierarchy.
    public func attachDataCaptureViewIfAvailable() {
        let viewId = getViewId()
        guard viewId != 0 else { return }

        if let frameworksDataCaptureView = DataCaptureViewHandler.shared.getView(viewId) {
            guard let currentView = frameworksDataCaptureView.view else {
                return
            }
            currentView.frame = self.bounds
            currentView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            self.addSubview(currentView)
        }
    }

    /// Returns the view ID used to look up the DataCaptureView.
    /// Override in subclasses to provide architecture-specific ID retrieval.
    @objc open func getViewId() -> Int {
        0
    }
}

/// Fabric architecture (New Arch) wrapper for DataCaptureView.
/// Uses tag for view identification (Fabric doesn't have reactTag).
@objc(RCTFabricDataCaptureViewWrapper)
open class RCTFabricDataCaptureViewWrapper: DataCaptureViewContainerWrapper {

    @objc open override func getViewId() -> Int {
        self.tag
    }

    public override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let view = super.hitTest(point, with: event)
        if view === self {
            return nil
        }
        return view
    }
}
