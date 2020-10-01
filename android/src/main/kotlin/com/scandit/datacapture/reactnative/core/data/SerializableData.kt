/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data

import com.facebook.react.bridge.WritableMap

interface SerializableData {
    fun toWritableMap(): WritableMap
}
