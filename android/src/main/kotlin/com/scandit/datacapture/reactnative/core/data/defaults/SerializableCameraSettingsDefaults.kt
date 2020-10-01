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
    private val maxFrameRate: Float,
    private val zoomFactor: Float,
    private val focusRange: String
) : SerializableData {

    constructor(settings: CameraSettings) : this(
            prefResolution = settings.preferredResolution.toJson(),
            maxFrameRate = settings.maxFrameRate,
            zoomFactor = settings.zoomFactor,
            focusRange = "full"
    )

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_PREFERRED_RESOLUTION, prefResolution)
        putDouble(FIELD_MAX_FRAME_RATE, maxFrameRate.toDouble())
        putDouble(FIELD_ZOOM_FACTOR, zoomFactor.toDouble())
        putString(FIELD_FOCUS_RANGE, focusRange)
    }

    companion object {
        private const val FIELD_PREFERRED_RESOLUTION = "preferredResolution"
        private const val FIELD_MAX_FRAME_RATE = "maxFrameRate"
        private const val FIELD_ZOOM_FACTOR = "zoomFactor"
        private const val FIELD_FOCUS_RANGE = "focusRange"
    }
}
