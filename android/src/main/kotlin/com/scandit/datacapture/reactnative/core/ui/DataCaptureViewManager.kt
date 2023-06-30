/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import android.view.ViewGroup
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.frameworks.core.deserialization.DeserializationLifecycleObserver
import java.lang.ref.WeakReference

class DataCaptureViewManager :
    ScanditViewGroupManager<FrameLayout>(),
    DeserializationLifecycleObserver.Observer {

    init {
        DeserializationLifecycleObserver.attach(this)
    }

    override fun getName(): String = "RNTDataCaptureView"

    private var dataCaptureViewRef: WeakReference<DataCaptureView?> = WeakReference(null)

    override fun createNewInstance(reactContext: ThemedReactContext): FrameLayout =
        FrameLayout(reactContext)

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        return super.createViewInstance(reactContext).also {
            addDataCaptureViewToContainer(it)
        }
    }

    private fun addDataCaptureViewToContainer(container: FrameLayout) {
        dataCaptureViewRef.get()?.let { view ->
            /*
            During hot reloading, DataCaptureViewManager recreates the view instance with
            a createViewInstance() call, without destroying the previous instance (with
            onDropViewInstance() callback). As a result, the DataCaptureViewHandler.dataCaptureView
            still has a parent - we have to remove the reference to the old parent before adding
            DataCaptureViewHandler.dataCaptureView to the newly created container.
            */
            view.parent?.let {
                (it as ViewGroup).removeView(view)
            }
            container.removeAllViews()
            container.addView(view, MATCH_PARENT, MATCH_PARENT)
        }
    }

    override fun onDropViewInstance(view: FrameLayout) {
        super.onDropViewInstance(view)

        currentContainer?.let {
            addDataCaptureViewToContainer(it)
        }
    }

    override fun onDataCaptureViewDeserialized(dataCaptureView: DataCaptureView) {
        dataCaptureView.post {
            // If the view has a parent it means that the view is already added to the container.
            // In this scenario we should not remove and add it again because with trial licenses
            // it's going to show the license popup over and over again.
            dataCaptureView.parent?.let {
                (it as ViewGroup).removeView(dataCaptureView)
            }
            currentContainer?.addView(dataCaptureView, MATCH_PARENT, MATCH_PARENT)
        }
        dataCaptureViewRef = WeakReference(dataCaptureView)
    }
}
