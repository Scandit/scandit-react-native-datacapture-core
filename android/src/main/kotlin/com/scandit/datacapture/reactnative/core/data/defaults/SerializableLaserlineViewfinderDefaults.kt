/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableLaserlineViewfinderDefaults(
    private val width: String,
    private val enabledColor: String,
    private val disabledColor: String
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_WIDTH, width)
        putString(FIELD_ENABLED_COLOR, enabledColor)
        putString(FIELD_DISABLED_COLOR, disabledColor)
    }

    companion object {
        private const val FIELD_WIDTH = "width"
        private const val FIELD_ENABLED_COLOR = "enabledColor"
        private const val FIELD_DISABLED_COLOR = "disabledColor"
    }
}
