/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import android.widget.FrameLayout
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNTDataCaptureViewManagerDelegate
import com.facebook.react.viewmanagers.RNTDataCaptureViewManagerInterface
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator

/**
 * New architecture (Fabric) view manager for DataCaptureView.
 * Implements the Codegen-generated interface and uses the delegate pattern.
 */
class DataCaptureViewManager(
    serviceLocator: ServiceLocator<FrameworkModule>,
) : DataCaptureViewManagerBase(serviceLocator),
    RNTDataCaptureViewManagerInterface<FrameLayout> {

    private val delegate = RNTDataCaptureViewManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<FrameLayout> = delegate

    // RNTDataCaptureViewManagerInterface methods
    // Currently no custom props defined in the spec, but the interface must be implemented
}
