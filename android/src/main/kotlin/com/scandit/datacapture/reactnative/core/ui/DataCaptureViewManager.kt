/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.ui

import android.view.ViewGroup
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.errors.ModuleNotStartedError
import com.scandit.datacapture.frameworks.core.handlers.DataCaptureViewHandler
import com.scandit.datacapture.frameworks.core.handlers.DefaultDataCaptureViewHandler
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.frameworks.core.result.NoopFrameworksResult

class DataCaptureViewManager(
    private val serviceLocator: ServiceLocator<FrameworkModule>,
    private val dataCaptureViewHandler: DataCaptureViewHandler =
        DefaultDataCaptureViewHandler.getInstance()
) : ScanditViewGroupManager<FrameLayout>() {

    override fun getName(): String = "RNTDataCaptureView"

    override fun createNewInstance(reactContext: ThemedReactContext): FrameLayout =
        FrameLayout(reactContext)

    override fun onDropViewInstance(view: FrameLayout) {
        // remove current DCView from core cache
        for (i in 0 until view.childCount) {
            val child = view.getChildAt(i)
            if (child is DataCaptureView) { // it should always be a DCView but you never know
                coreModule.dataCaptureViewDisposed(child)
            }
        }

        super.onDropViewInstance(view)

        currentContainer?.let { container ->
            dataCaptureViewHandler.topmostDataCaptureView?.let { view ->
                addDataCaptureViewToContainer(view, container)
            }
        }
    }

    override fun getCommandsMap(): MutableMap<String, Int> = mutableMapOf(
        CREATE_FRAGMENT_COMMAND to CREATE_FRAGMENT_COMMAND_INDEX
    )

    override fun receiveCommand(root: FrameLayout, commandId: String?, args: ReadableArray?) {
        if (commandId == CREATE_FRAGMENT_COMMAND) {
            val viewJson = args?.getString(0) ?: return

            coreModule.createDataCaptureView(viewJson, NoopFrameworksResult())?.let {
                currentContainer?.let { container ->
                    addDataCaptureViewToContainer(it, container)
                }
            }
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
        private const val CREATE_FRAGMENT_COMMAND_INDEX = 1
        private const val CREATE_FRAGMENT_COMMAND = "createDataCaptureView"
    }
}
