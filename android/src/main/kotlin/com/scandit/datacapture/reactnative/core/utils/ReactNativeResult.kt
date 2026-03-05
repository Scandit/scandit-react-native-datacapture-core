/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */
package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.scandit.datacapture.frameworks.core.result.FrameworksResult
import org.json.JSONObject
import kotlin.Error

class ReactNativeResult(private val promise: Promise) : FrameworksResult {
    override fun success(result: Any?) {
        if (result == null) {
            promise.resolve(null)
            return
        }

        val resultData = if (result is Map<*, *>) {
            JSONObject(result).toString()
        } else {
            result.toString()
        }

        val reactPayload = Arguments.createMap()
        reactPayload.putString("data", resultData)
        promise.resolve(reactPayload)
    }

    override fun error(errorCode: String, errorMessage: String?, errorDetails: Any?) {
        promise.reject(Error("Code:$errorCode;Message:$errorMessage;Details:$errorDetails"))
    }
}
