/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableSpotlightViewfinderDefaults(
    private val size: String,
    private val enabledBorderColor: String,
    private val disabledBorderColor: String,
    private val backgroundColor: String
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_SIZE, size)
        putString(FIELD_ENABLED_BORDER_COLOR, enabledBorderColor)
        putString(FIELD_DISABLED_BORDER_COLOR, disabledBorderColor)
        putString(FIELD_BACKGROUND_COLOR, backgroundColor)
    }

    companion object {
        private const val FIELD_SIZE = "size"
        private const val FIELD_ENABLED_BORDER_COLOR = "enabledBorderColor"
        private const val FIELD_DISABLED_BORDER_COLOR = "disabledBorderColor"
        private const val FIELD_BACKGROUND_COLOR = "backgroundColor"
    }
}
