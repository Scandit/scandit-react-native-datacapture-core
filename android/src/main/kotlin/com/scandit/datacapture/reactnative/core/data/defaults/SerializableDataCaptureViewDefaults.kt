/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableDataCaptureViewDefaults(
    private val scanAreaMargins: String,
    private val pointOfInterest: String,
    private val logoAnchor: String,
    private val logoOffset: String,
    private val focusGesture: String?,
    private val zoomGesture: String?
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_MARGINS, scanAreaMargins)
        putString(FIELD_POI, pointOfInterest)
        putString(FIELD_LOGO_ANCHOR, logoAnchor)
        putString(FIELD_LOGO_OFFSET, logoOffset)
        putString(FIELD_FOCUS_GESTURE, focusGesture)
        putString(FIELD_ZOOM_GESTURE, zoomGesture)
    }

    companion object {
        private const val FIELD_MARGINS = "scanAreaMargins"
        private const val FIELD_POI = "pointOfInterest"
        private const val FIELD_LOGO_ANCHOR = "logoAnchor"
        private const val FIELD_LOGO_OFFSET = "logoOffset"
        private const val FIELD_FOCUS_GESTURE = "focusGesture"
        private const val FIELD_ZOOM_GESTURE = "zoomGesture"
    }
}
