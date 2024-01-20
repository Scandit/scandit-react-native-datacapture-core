/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.frameworks.core.utils.DefaultFrameworksLog
import com.scandit.datacapture.frameworks.core.utils.FrameworksLog
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.TimeUnit.MILLISECONDS

class EventWithResult<T>(
    private val name: String,
    private val eventEmitter: RCTDeviceEventEmitter,
    private val timeoutMillis: Long = DEFAULT_TIMEOUT_MILLIS,
    private val logger: FrameworksLog = DefaultFrameworksLog.getInstance()
) {
    companion object {
        private const val DEFAULT_TIMEOUT_MILLIS = 2000L
    }

    private val resultHolder: ArrayBlockingQueue<PendingResult> = ArrayBlockingQueue(1)

    fun emitForResult(timeoutResult: T): T = emitForResult(null, timeoutResult)

    fun emitForResult(data: Any?, timeoutResult: T): T {
        resultHolder.clear()
        eventEmitter.emit(name, data)

        return when (
            val pendingResult: PendingResult? = resultHolder.poll(timeoutMillis, MILLISECONDS)
        ) {
            null -> {
                logger.info(
                    "Callback `$name` not finished after $timeoutMillis milliseconds."
                )
                timeoutResult
            }
            is Cancellation -> {
                logger.info("Callback `$name` not finished, because onCancel was called.")
                timeoutResult
            }
            is Result<*> -> pendingResult.value as T
        }
    }

    fun onResult(value: T) {
        resultHolder.offer(Result(value))
    }

    fun onCancel() {
        resultHolder.offer(Cancellation)
    }
}

private sealed class PendingResult

private data class Result<T>(val value: T) : PendingResult()

private object Cancellation : PendingResult()
