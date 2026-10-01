/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */
package com.scandit.datacapture.reactnative.core.utils

import com.scandit.datacapture.frameworks.core.events.Emitter

/**
 * Relays per-view window attach/detach signals to JS (SDC-32484 single-owner
 * camera model): the JS layer claims camera ownership when a scanner view's
 * native container enters the window and releases it when it leaves. The core
 * module registers the emitter at setup; view containers call
 * [notifyWindowChanged] from their attach-state hooks. No-op until an emitter
 * is registered.
 */
object ViewWindowEvents {
    const val WINDOW_ATTACHED_EVENT = "NativeView.onWindowAttached"
    const val WINDOW_DETACHED_EVENT = "NativeView.onWindowDetached"

    @Volatile
    var emitter: Emitter? = null

    fun notifyWindowChanged(viewId: Int, attached: Boolean) {
        if (viewId <= 0) return
        emitter?.emit(
            if (attached) WINDOW_ATTACHED_EVENT else WINDOW_DETACHED_EVENT,
            mutableMapOf("viewId" to viewId)
        )
    }
}
