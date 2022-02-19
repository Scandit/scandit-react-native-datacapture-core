/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.core.source.CameraPosition
import com.scandit.datacapture.core.source.toJson
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.putData
import com.scandit.datacapture.reactnative.core.utils.writableArray
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableCameraDefaults(
    private val cameraSettingsDefaults: SerializableCameraSettingsDefaults,
    private val defaultPosition: String?,
    private val availablePositions: List<CameraPosition>
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putData(FIELD_CAMERA_SETTINGS_DEFAULTS, cameraSettingsDefaults)
        putString(FIELD_DEFAULT_POSITION, defaultPosition)
        putArray(
            FIELD_AVAILABLE_POSITIONS,
            writableArray {
                availablePositions.forEach { pushString(it.toJson()) }
            }
        )
    }

    companion object {
        private const val FIELD_CAMERA_SETTINGS_DEFAULTS = "Settings"
        private const val FIELD_DEFAULT_POSITION = "defaultPosition"
        private const val FIELD_AVAILABLE_POSITIONS = "availablePositions"
    }
}
