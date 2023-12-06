/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core

import com.facebook.react.bridge.UiThreadUtil
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.core.ui.overlay.DataCaptureOverlay
import com.scandit.datacapture.reactnative.core.deserializers.TreeLifecycleObserver
import com.scandit.datacapture.reactnative.core.handler.DataCaptureViewHandler
import org.json.JSONObject

typealias JsonString = String

internal inline fun withRnViewsRemovedOnUiThread(json: JsonString, update: (JsonString) -> Unit) {
    if (Barcode.inClasspath) {
        val jsonObject = JSONObject(json)
        val view = DataCaptureViewHandler.dataCaptureView
        val barcodeTrackingAdvancedOverlay =
            view?.getOverlay(Barcode.barcodeTrackingAdvancedOverlayClass)

        if (barcodeTrackingAdvancedOverlay != null) {
            withBarcodeTrackingAdvancedOverlayViewsRemovedOnUiThread(
                view,
                barcodeTrackingAdvancedOverlay,
                jsonObject,
                update
            )

            return
        }
    }

    update(json)
}

private inline fun withBarcodeTrackingAdvancedOverlayViewsRemovedOnUiThread(
    view: DataCaptureView,
    overlay: DataCaptureOverlay,
    json: JSONObject,
    update: (JsonString) -> Unit
) {
    val removesOverlay = !json.hasBarcodeTrackingAdvancedOverlay
    val removesMode = !json.hasBarcodeTracking

    if (removesOverlay) {
        json.putDummyBarcodeTrackingAdvancedOverlay()
    }

    if (removesMode) {
        json.putDummyBarcodeTracking()
    }

    update(json.toString())

    if (removesOverlay) {
        TreeLifecycleObserver.dispatchBarcodeTrackingAdvancedOverlayRemoved()

        UiThreadUtil.runOnUiThread {
            view.removeOverlay(overlay)
        }
    }

    if (removesMode) {
        TreeLifecycleObserver.dispatchBarcodeTrackingRemoved()
    }
}

internal object Barcode {
    private const val BARCODE_TRACKING_ADVANCED_OVERLAY_CLASS_NAME =
        "com.scandit.datacapture.barcode.tracking.ui.overlay.BarcodeTrackingAdvancedOverlay"

    lateinit var barcodeTrackingAdvancedOverlayClass: Class<*>
        private set

    val inClasspath: Boolean
        get() {
            if (!classpathChecked) {
                checkClasspath()
            }

            return isInClasspath
        }

    private var classpathChecked = false
    private var isInClasspath = false

    private fun checkClasspath() {
        try {
            barcodeTrackingAdvancedOverlayClass =
                Class.forName(BARCODE_TRACKING_ADVANCED_OVERLAY_CLASS_NAME)
            isInClasspath = true
        } catch (e: ClassNotFoundException) {
            // Barcode not in classpath.
            println(e)
        }

        classpathChecked = true
    }
}

private fun DataCaptureView.getOverlay(clazz: Class<*>): DataCaptureOverlay? {
    for (i in 0 until childCount) {
        val childView = getChildAt(i)

        if (clazz.isInstance(childView)) {
            return childView as DataCaptureOverlay
        }
    }

    return null
}

private val JSONObject.hasBarcodeTracking: Boolean
    get() {
        optJSONArray("modes")?.let { modes ->
            for (i in 0 until modes.length()) {
                val overlay = modes.getJSONObject(i)

                if (overlay.getString("type") == "barcodeTracking") {
                    return true
                }
            }
        }

        return false
    }

private val JSONObject.hasBarcodeTrackingAdvancedOverlay: Boolean
    get() {
        optJSONObject("view")?.optJSONArray("overlays")?.let { overlays ->
            for (i in 0 until overlays.length()) {
                val overlay = overlays.getJSONObject(i)

                if (overlay.getString("type") == "barcodeTrackingAdvanced") {
                    return true
                }
            }
        }

        return false
    }

private fun JSONObject.putDummyBarcodeTrackingAdvancedOverlay() {
    val dummyOverlay = JSONObject().apply {
        put("type", "barcodeTrackingAdvanced")
    }

    optJSONObject("view")?.optJSONArray("overlays")?.put(dummyOverlay)
}

private fun JSONObject.putDummyBarcodeTracking() {
    val dummyMode = JSONObject().apply {
        put("type", "barcodeTracking")
    }

    optJSONArray("modes")?.put(dummyMode)
}
