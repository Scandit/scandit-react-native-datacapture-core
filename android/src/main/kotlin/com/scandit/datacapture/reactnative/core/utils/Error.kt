/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.Promise

data class Error(val code: Int, val message: String)

fun Promise.reject(error: Error) {
    reject(error.code.toString(), error.message)
}

fun Promise.reject(error: Error, vararg messageArgs: Any?) {
    reject(error.code.toString(), error.message.format(messageArgs))
}
