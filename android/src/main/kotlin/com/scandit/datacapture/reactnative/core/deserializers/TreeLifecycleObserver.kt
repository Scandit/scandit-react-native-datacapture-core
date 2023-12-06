/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.deserializers

import com.scandit.datacapture.core.capture.DataCaptureContext

object TreeLifecycleObserver {
    val callbacks = mutableListOf<Callbacks>()

    internal fun dispatchTreeCreated(root: DataCaptureContext) {
        callbacks.forEach { it.onTreeCreated(root) }
    }

    internal fun dispatchTreeDestroyed() {
        callbacks.forEach { it.onTreeDestroyed() }
    }

    internal fun dispatchBarcodeTrackingRemoved() {
        callbacks.forEach { it.onBarcodeTrackingRemoved() }
    }

    internal fun dispatchBarcodeTrackingAdvancedOverlayRemoved() {
        callbacks.forEach { it.onBarcodeTrackingAdvancedOverlayRemoved() }
    }

    internal fun dispatchParsersRemoved() {
        callbacks.forEach { it.onParsersRemoved() }
    }

    interface Callbacks {
        fun onTreeCreated(root: DataCaptureContext) { }

        fun onTreeDestroyed() { }

        fun onBarcodeTrackingRemoved() { }

        fun onBarcodeTrackingAdvancedOverlayRemoved() { }

        fun onParsersRemoved() { }
    }
}
