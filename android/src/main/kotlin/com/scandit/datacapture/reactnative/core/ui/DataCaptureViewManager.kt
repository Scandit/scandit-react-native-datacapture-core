/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import android.view.ViewGroup
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import com.facebook.react.bridge.Promise
import com.facebook.react.uimanager.ThemedReactContext
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.errors.ModuleNotStartedError
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.reactnative.core.data.ViewCreationRequest
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult

class DataCaptureViewManager(
    private val serviceLocator: ServiceLocator<FrameworkModule>,
) : ScanditViewGroupManager<FrameLayout>() {
    override fun getName(): String = "RNTDataCaptureView"

    private val cachedCreationRequests = mutableMapOf<Int, ViewCreationRequest>()

    override fun createNewInstance(reactContext: ThemedReactContext): FrameLayout =
        FrameLayout(reactContext)

    override fun onAfterUpdateTransaction(view: FrameLayout) {
        super.onAfterUpdateTransaction(view)
        // This is the point where the ReactNative Id on JS side (findNodeHandle) matches
        // the id of the container created on native side. If createDataCaptureView was called
        // before the creation of the instance of the native container, we add an item to
        // cachedCreationRequests so that, after the creation the view is added to the just
        // created container.
        val item = cachedCreationRequests.remove(view.id)

        if (item != null) {
            coreModule.createDataCaptureView(item.viewJson, ReactNativeResult(item.promise))?.let {
                addDataCaptureViewToContainer(it, view)
            }
        }
    }

    override fun onDropViewInstance(view: FrameLayout) {
        // remove current DCView from core cache
        coreModule.dataCaptureViewDisposed(view.id)
        super.onDropViewInstance(view)
    }

    fun createDataCaptureView(viewJson: String, promise: Promise) {
        val viewId = viewJson.getViewId()
        if (viewId == -1) {
            promise.reject(VIEW_ID_NOT_FOUND_IN_JSON_ERROR)
            return
        }

        val container = containers.firstOrNull { it.id == viewId }

        if (container == null) {
            cachedCreationRequests[viewId] = ViewCreationRequest(viewId, viewJson, promise)
            return
        }

        coreModule.createDataCaptureView(viewJson, ReactNativeResult(promise))?.let {
            addDataCaptureViewToContainer(it, container)
        }
    }

    private fun addDataCaptureViewToContainer(
        dataCaptureView: DataCaptureView,
        container: FrameLayout
    ) {
        container.post {
            if (container.childCount > 0 && container.getChildAt(0) === dataCaptureView) {
                // Same instance already attached. No need to detach and attach it again because
                // it will trigger some overlay cleanup that we don't want.
                return@post
            }

            /*
              During hot reloading, DataCaptureViewManager recreates the view instance with
              a createViewInstance() call, without destroying the previous instance (with
              onDropViewInstance() callback). As a result, the
              DataCaptureViewHandler.dataCaptureView still has a parent - we have to
              remove the reference to the old parent before adding
              DataCaptureViewHandler.dataCaptureView to the newly created container.
             */
            dataCaptureView.parent?.let {
                (it as ViewGroup).removeView(dataCaptureView)
            }
            container.addView(dataCaptureView, MATCH_PARENT, MATCH_PARENT)
        }
    }

    private val coreModule: CoreModule
        get() {
            return serviceLocator.resolve(CoreModule::class.java.name) as? CoreModule?
                ?: throw ModuleNotStartedError(DataCaptureViewManager::class.java.simpleName)
        }

    companion object {
        private val VIEW_ID_NOT_FOUND_IN_JSON_ERROR = Error(
            "Unable to add the DataCaptureView with the provided json. " +
                "The json doesn't contain the viewId field."
        )
    }
}

fun String.getViewId(): Int =
    JsonValue(this).getByKeyAsInt("viewId", -1)
