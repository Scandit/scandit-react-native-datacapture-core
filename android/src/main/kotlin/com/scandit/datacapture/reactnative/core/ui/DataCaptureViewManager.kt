/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import android.view.Choreographer
import android.view.View
import android.view.View.MeasureSpec.makeMeasureSpec
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.annotation.VisibleForTesting
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.reactnative.core.handler.DataCaptureViewHandler

class DataCaptureViewManager :
    ViewGroupManager<FrameLayout>(),
    DataCaptureViewHandler.ViewListener {

    @get:VisibleForTesting
    var container: FrameLayout? = null

    val frameCallback: Choreographer.FrameCallback = object : Choreographer.FrameCallback {
        override fun doFrame(frameTimeNanos: Long) {
            manuallyLayoutChildren()
            container?.viewTreeObserver?.dispatchOnGlobalLayout()
            Choreographer.getInstance().postFrameCallback(this)
        }
    }

    override fun getName(): String = "RNTDataCaptureView"

    init {
        DataCaptureViewHandler.setViewListener(this)
    }

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        container = FrameLayout(reactContext)
        DataCaptureViewHandler.dataCaptureView?.let { view ->
            /*
            During hot reloading, DataCaptureViewManager recreates the view instance with
            a createViewInstance() call, without destroying the previous instance (with
            onDropViewInstance() callback). As a result, the DataCaptureViewHandler.dataCaptureView
            still has a parent - we have to remove the reference to the old parent before adding
            DataCaptureViewHandler.dataCaptureView to the newly created container.
            */
            view.parent?.let {
                removeView(it as FrameLayout, view)
            }
            container?.removeAllViews()
            container?.addView(view, MATCH_PARENT, MATCH_PARENT)
        }

        scheduleMeasureAndLayout()
        return container!!
    }

    /**
     * XXX RN is not calling measure() and layout() methods on dynamically added native Android
     * Views. That's why we need to call those methods on our container (and it's children)
     * ourselves - otherwise the views added by the BarcodeTrackingAdvancedOverlay won't be visible.
     * The hack has been taken from: https://github.com/facebook/react-native/issues/17968
     */
    private fun scheduleMeasureAndLayout() {
        Choreographer.getInstance().postFrameCallback(frameCallback)
    }

    private fun cancelMeasureAndLayout() {
        Choreographer.getInstance().removeFrameCallback(frameCallback)
    }

    private fun manuallyLayoutChildren() {
        container?.let { container ->
            for (i in 0 until container.childCount) {
                val child = container.getChildAt(i)
                child.measure(
                    makeMeasureSpec(container.measuredWidth, View.MeasureSpec.EXACTLY),
                    makeMeasureSpec(container.measuredHeight, View.MeasureSpec.EXACTLY)
                )
                child.layout(0, 0, child.measuredWidth, child.measuredHeight)
            }
        }
    }

    override fun onDropViewInstance(view: FrameLayout) {
        cancelMeasureAndLayout()
        container?.removeView(view)
    }

    override fun onViewDeserialized(view: DataCaptureView) {
        view.post {
            // If the view has a parent it means that the view is already added to the container.
            // In this scenario we should not remove and add it again because with trial licenses
            // it's going to show the license popup over and over again.
            if (view.parent != null) return@post
            container?.addView(view, MATCH_PARENT, MATCH_PARENT)
        }
    }
}
