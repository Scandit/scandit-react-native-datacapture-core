/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import androidx.annotation.VisibleForTesting
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.utils.TestPromise.Status.*
import java.lang.AssertionError

@VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
fun promise(): TestPromise = TestPromise()

class TestPromise : Promise {
    var value: Any? = null
        private set

    var code: String? = null
        private set

    var message: String? = null
        private set

    var throwable: Throwable? = null
        private set

    var userInfo: WritableMap? = null
        private set

    var status: Status = PENDING
        private set

    override fun resolve(value: Any?) {
        if (status == PENDING) {
            this.value = value

            status = RESOLVED
        }
    }

    override fun reject(code: String?, message: String?) {
        reject(code, message, null, null)
    }

    override fun reject(code: String?, throwable: Throwable?) {
        reject(code, null, throwable, null)
    }

    override fun reject(code: String?, message: String?, throwable: Throwable?) {
        reject(code, message, throwable, null)
    }

    override fun reject(throwable: Throwable?) {
        reject(null, null, throwable, null)
    }

    override fun reject(throwable: Throwable?, userInfo: WritableMap?) {
        reject(null, null, throwable, userInfo)
    }

    override fun reject(code: String?, userInfo: WritableMap) {
        reject(code, null, null, userInfo)
    }

    override fun reject(code: String?, throwable: Throwable?, userInfo: WritableMap?) {
        reject(code, null, throwable, userInfo)
    }

    override fun reject(code: String?, message: String?, userInfo: WritableMap) {
        reject(code, message, null, userInfo)
    }

    override fun reject(
        code: String?,
        message: String?,
        throwable: Throwable?,
        userInfo: WritableMap?
    ) {
        if (status == PENDING) {
            this.code = code
            this.message = message
            this.throwable = throwable
            this.userInfo = userInfo

            status = REJECTED
        }
    }

    override fun reject(message: String?) {
        throw UnsupportedOperationException("Deprecated.")
    }

    override fun toString(): String {
        return "TestPromise(value=$value, code=$code, message=$message, throwable=$throwable, " +
                "userInfo=$userInfo, status=$status)"
    }

    enum class Status { PENDING, RESOLVED, REJECTED }
}

inline fun waitTill(conditionDescription: String, forMs: Long = 5000L, condition: () -> Boolean) {
    val iterCount = forMs / 50

    for (i in 0..iterCount) {
        if (condition()) {
            return
        }

        Thread.sleep(50)
    }

    throw AssertionError("Still false after ${forMs}ms: $conditionDescription")
}
