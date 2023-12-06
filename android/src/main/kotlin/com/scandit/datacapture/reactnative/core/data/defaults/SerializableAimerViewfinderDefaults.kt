/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableAimerViewfinderDefaults(
    private val frameColor: String,
    private val dotColor: String
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_FRAME_COLOR, frameColor)
        putString(FIELD_DOT_COLOR, dotColor)
    }

    companion object {
        private const val FIELD_FRAME_COLOR = "frameColor"
        private const val FIELD_DOT_COLOR = "dotColor"
    }
}
