/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.queue.MessageQueueThread
import com.facebook.react.bridge.queue.MessageQueueThreadPerfStats
import com.facebook.react.bridge.queue.ReactQueueConfiguration
import java.util.concurrent.Callable
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit

object TestReactQueueConfiguration : ReactQueueConfiguration {
    override fun getUIQueueThread(): MessageQueueThread = DirectMessageQueueThread

    override fun getNativeModulesQueueThread(): MessageQueueThread = DirectMessageQueueThread

    override fun getJSQueueThread(): MessageQueueThread = DirectMessageQueueThread

    override fun destroy() {
        // Do nothing.
    }
}

object DirectMessageQueueThread : MessageQueueThread {
    override fun runOnQueue(runnable: Runnable) {
        runnable.run()
    }

    override fun <T : Any?> callOnQueue(callable: Callable<T>): Future<T> {
        val result = callable.call()

        return object : Future<T> {
            override fun isDone(): Boolean = true

            override fun get(): T = result

            override fun get(timeout: Long, unit: TimeUnit?): T = result

            override fun cancel(mayInterruptIfRunning: Boolean): Boolean = false

            override fun isCancelled(): Boolean = false
        }
    }

    override fun isOnThread(): Boolean = true

    override fun assertIsOnThread() {
        // Do nothing.
    }

    override fun assertIsOnThread(message: String?) {
        // Do nothing.
    }

    override fun quitSynchronous() {
        // Do nothing.
    }

    override fun getPerfStats(): MessageQueueThreadPerfStats = MessageQueueThreadPerfStats()

    override fun resetPerfStats() {
        // Do nothing.
    }
}
