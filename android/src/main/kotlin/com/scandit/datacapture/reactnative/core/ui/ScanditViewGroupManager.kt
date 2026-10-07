/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager

abstract class ScanditViewGroupManager<T> :
    ViewGroupManager<T>() where T : ViewGroup {
    protected val containers = mutableListOf<T>()

    val currentContainer: T?
        get() = if (containers.size > 0) containers[containers.size - 1] else null

    abstract fun createNewInstance(reactContext: ThemedReactContext): T

    override fun invalidate() {
        super.invalidate()
        containers.clear()
    }

    override fun createViewInstance(reactContext: ThemedReactContext): T {
        val container = createNewInstance(reactContext).also {
            containers.add(it)
        }

        if (containers.size == 1) {
            scheduleMeasureAndLayout()
        }
        return container
    }

    override fun onDropViewInstance(view: T) {
        view.removeAllViews()
        containers.remove(view)
        if (containers.size == 0) {
            cancelMeasureAndLayout()
        }
    }

    protected fun disposeInternal() {
        cancelMeasureAndLayout()
        containers.clear()
    }

    private val frameCallback: Choreographer.FrameCallback = object : Choreographer.FrameCallback {
        override fun doFrame(frameTimeNanos: Long) {
            manuallyLayoutChildren()
            currentContainer?.viewTreeObserver?.dispatchOnGlobalLayout()
            Choreographer.getInstance().postFrameCallback(this)
        }
    }

    /**
     * XXX RN is not calling measure() and layout() methods on dynamically added native Android
     * Views. That's why we need to call those methods on our container (and it's children)
     * ourselves - otherwise the views added by the BarcodeBatchAdvancedOverlay won't be visible.
     * The hack has been taken from: https://github.com/facebook/react-native/issues/17968
     */
    private fun scheduleMeasureAndLayout() {
        Choreographer.getInstance().postFrameCallback(frameCallback)
    }

    private fun cancelMeasureAndLayout() {
        Choreographer.getInstance().removeFrameCallback(frameCallback)
    }

    private fun manuallyLayoutChildren() {
        currentContainer?.let { container ->
            for (i in 0 until container.childCount) {
                try {
                    val child = container.getChildAt(i)
                    child.measure(
                        View.MeasureSpec.makeMeasureSpec(
                            container.measuredWidth,
                            View.MeasureSpec.EXACTLY
                        ),
                        View.MeasureSpec.makeMeasureSpec(
                            container.measuredHeight,
                            View.MeasureSpec.EXACTLY
                        )
                    )
                    child.layout(0, 0, child.measuredWidth, child.measuredHeight)
                } catch (_: NullPointerException) {
                    // Noticed that sometimes it was crashing here with a null pointer exception
                    // most probably because views are added and removed automatically in the
                    // sparkScanView
                }
            }
        }
    }
}
