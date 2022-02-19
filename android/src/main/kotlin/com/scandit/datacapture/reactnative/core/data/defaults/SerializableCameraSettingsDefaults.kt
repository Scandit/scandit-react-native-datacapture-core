/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.core.source.CameraSettings
import com.scandit.datacapture.core.source.toJson
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableCameraSettingsDefaults(
    private val prefResolution: String,
    private val zoomFactor: Float,
    private val focusRange: String,
    private val zoomGestureZoomFactor: Float,
    private val focusGestureStrategy: String,
    private val shouldPreferSmoothAutoFocus: Boolean
) : SerializableData {

    constructor(settings: CameraSettings) : this(
        prefResolution = settings.preferredResolution.toJson(),
        zoomFactor = settings.zoomFactor,
        focusRange = "full",
        zoomGestureZoomFactor = settings.zoomGestureZoomFactor,
        focusGestureStrategy = settings.focusGestureStrategy.toJson(),
        shouldPreferSmoothAutoFocus = settings.shouldPreferSmoothAutoFocus
    )

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_PREFERRED_RESOLUTION, prefResolution)
        putDouble(FIELD_ZOOM_FACTOR, zoomFactor.toDouble())
        putString(FIELD_FOCUS_RANGE, focusRange)
        putDouble(FIELD_ZOOM_GESTURE_ZOOM_FACTOR, zoomGestureZoomFactor.toDouble())
        putString(FIELD_FOCUS_GESTURE_STRATEGY, focusGestureStrategy)
        putBoolean(FIELD_FOCUS_SHOULD_PREFER_SMOOTH_AUTOFOCUS, shouldPreferSmoothAutoFocus)
    }

    companion object {
        private const val FIELD_PREFERRED_RESOLUTION = "preferredResolution"
        private const val FIELD_ZOOM_FACTOR = "zoomFactor"
        private const val FIELD_FOCUS_RANGE = "focusRange"
        private const val FIELD_ZOOM_GESTURE_ZOOM_FACTOR = "zoomGestureZoomFactor"
        private const val FIELD_FOCUS_GESTURE_STRATEGY = "focusGestureStrategy"
        private const val FIELD_FOCUS_SHOULD_PREFER_SMOOTH_AUTOFOCUS = "shouldPreferSmoothAutoFocus"
    }
}
