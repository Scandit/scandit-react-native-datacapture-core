/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.putData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableCoreDefaults(
    private val deviceId: String,
    private val cameraDefaults: SerializableCameraDefaults,
    private val dataCaptureViewDefaults: SerializableDataCaptureViewDefaults,
    private val laserlineViewfinderDefaults: SerializableLaserlineViewfinderDefaults,
    private val rectangularViewfinderDefaults: SerializableRectangularViewfinderDefaults,
    private val spotlightViewfinderDefaults: SerializableSpotlightViewfinderDefaults,
    private val aimerViewfinderDefaults: SerializableAimerViewfinderDefaults,
    private val brushDefaults: SerializableBrushDefaults
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_DEVICE_ID, deviceId)
        putData(FIELD_CAMERA_DEFAULTS, cameraDefaults)
        putData(FIELD_DATA_CAPTURE_VIEW_DEFAULTS, dataCaptureViewDefaults)
        putData(FIELD_LASERLINE_VIEWFINDER_DEFAULTS, laserlineViewfinderDefaults)
        putData(FIELD_RECTANGULAR_VIEWFINDER_DEFAULTS, rectangularViewfinderDefaults)
        putData(FIELD_SPOTLIGHT_VIEWFINDER_DEFAULTS, spotlightViewfinderDefaults)
        putData(FIELD_AIMER_VIEWFINDER_DEFAULTS, aimerViewfinderDefaults)
        putData(FIELD_BRUSH_DEFAULTS, brushDefaults)
    }

    companion object {
        // lowercase, since it's not a nested object.
        private const val FIELD_DEVICE_ID = "deviceID"

        private const val FIELD_CAMERA_DEFAULTS = "Camera"
        private const val FIELD_DATA_CAPTURE_VIEW_DEFAULTS = "DataCaptureView"
        private const val FIELD_LASERLINE_VIEWFINDER_DEFAULTS = "LaserlineViewfinder"
        private const val FIELD_RECTANGULAR_VIEWFINDER_DEFAULTS = "RectangularViewfinder"
        private const val FIELD_SPOTLIGHT_VIEWFINDER_DEFAULTS = "SpotlightViewfinder"
        private const val FIELD_AIMER_VIEWFINDER_DEFAULTS = "AimerViewfinder"
        private const val FIELD_BRUSH_DEFAULTS = "Brush"
    }
}
