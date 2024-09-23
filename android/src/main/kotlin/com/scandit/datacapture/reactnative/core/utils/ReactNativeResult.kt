package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.Promise
import com.scandit.datacapture.frameworks.core.result.FrameworksResult
import org.json.JSONObject
import kotlin.Error

class ReactNativeResult(private val promise: Promise) : FrameworksResult {
    override fun success(result: Any?) {
        if (result is Map<*, *>) {
            promise.resolve(JSONObject(result).toString())
            return
        }
        promise.resolve(result)
    }

    override fun error(errorCode: String, errorMessage: String?, errorDetails: Any?) {
        promise.reject(Error("Code:$errorCode;Message:$errorMessage;Details:$errorDetails"))
    }
}
