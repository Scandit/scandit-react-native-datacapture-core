/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator

/**
 * Legacy architecture (Paper) view manager for DataCaptureView.
 * Extends the shared base class with no additional implementation needed.
 */
class DataCaptureViewManager(
    serviceLocator: ServiceLocator<FrameworkModule>,
) : DataCaptureViewManagerBase(serviceLocator)
