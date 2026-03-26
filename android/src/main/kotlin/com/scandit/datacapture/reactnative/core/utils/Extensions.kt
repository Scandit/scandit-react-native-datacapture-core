/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.*

inline fun writableMap(builder: WritableMap.() -> Unit): WritableMap =
    Arguments.createMap().apply(builder)

inline fun <reified T : JavaScriptModule> ReactApplicationContext.getJSModule(): T =
    getJSModule(T::class.java)

val ReadableMap.viewId: Int
    get() = this.getInt("viewId")

val ReadableMap.modeId: Int
    get() = this.getInt("modeId")
