/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core

import androidx.annotation.VisibleForTesting
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.core.capture.DataCaptureContext
import com.scandit.datacapture.core.capture.DataCaptureContextListener
import com.scandit.datacapture.core.capture.DataCaptureVersion
import com.scandit.datacapture.core.common.feedback.Feedback
import com.scandit.datacapture.core.common.geometry.*
import com.scandit.datacapture.core.data.FrameData
import com.scandit.datacapture.core.data.toJson
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.core.source.*
import com.scandit.datacapture.core.source.serialization.FrameSourceDeserializer
import com.scandit.datacapture.core.source.serialization.FrameSourceDeserializerListener
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.core.ui.DataCaptureViewListener
import com.scandit.datacapture.core.ui.style.Brush
import com.scandit.datacapture.core.ui.viewfinder.AimerViewfinder
import com.scandit.datacapture.core.ui.viewfinder.LaserlineViewfinder
import com.scandit.datacapture.core.ui.viewfinder.RectangularViewfinder
import com.scandit.datacapture.core.ui.viewfinder.SpotlightViewfinder
import com.scandit.datacapture.reactnative.core.data.defaults.*
import com.scandit.datacapture.reactnative.core.deserializers.Deserializers
import com.scandit.datacapture.reactnative.core.deserializers.TreeLifecycleObserver
import com.scandit.datacapture.reactnative.core.handler.DataCaptureViewHandler
import com.scandit.datacapture.reactnative.core.listener.RCTDataCaptureContextListener
import com.scandit.datacapture.reactnative.core.listener.RCTDataCaptureViewListener
import com.scandit.datacapture.reactnative.core.listener.RCTFrameSourceListener
import com.scandit.datacapture.reactnative.core.utils.Error
import com.scandit.datacapture.reactnative.core.utils.LazyEventEmitter
import com.scandit.datacapture.reactnative.core.utils.hexString
import com.scandit.datacapture.reactnative.core.utils.reject
import org.json.JSONException

class ScanditDataCaptureCoreModule(
    private val reactContext: ReactApplicationContext,
    eventEmitter: RCTDeviceEventEmitter = LazyEventEmitter(reactContext),
    private val dataCaptureContextListener: RCTDataCaptureContextListener =
        RCTDataCaptureContextListener(eventEmitter),
    private val frameSourceListener: RCTFrameSourceListener = RCTFrameSourceListener(eventEmitter),
    private val dataCaptureViewListener: RCTDataCaptureViewListener =
        RCTDataCaptureViewListener(eventEmitter)
) : ReactContextBaseJavaModule(reactContext),
    FrameSourceDeserializerListener,
    DataCaptureContextListener by dataCaptureContextListener,
    FrameSourceListener by frameSourceListener,
    DataCaptureViewListener by dataCaptureViewListener {

    companion object {
        private const val VERSION_KEY = "Version"
        private const val DEFAULTS_KEY = "Defaults"

        private val ERROR_DESERIALIZATION_FAILED = Error(1, "Unable to deserialize a valid object.")
        private val ERROR_NULL_VIEW = Error(2, "DataCaptureView is null")
        private val ERROR_CAMERA_NOT_READY = Error(3, "Camera has yet not been instantiated.")
        private val ERROR_WRONG_CAMERA_POSITION = Error(
            4,
            "CameraPosition argument does not " +
                "match the position of the currently used camera."
        )
        private val ERROR_NULL_FRAME = Error(5, "Frame is null, it might've been reused already.")

        var lastFrame: FrameData? = null
    }

    @get:VisibleForTesting
    var dataCaptureContext: DataCaptureContext? = null
        private set(value) {
            field?.removeListener(this)
            field?.release()
            field = value?.also { it.addListener(this) }
        }

    private var camera: Camera? = null
        private set(value) {
            field?.removeListener(this)
            field = value?.also { it.addListener(this) }
        }

    private var latestFeedback: Feedback? = null

    private val defaults: SerializableCoreDefaults by lazy {
        val cameraSettings = CameraSettings()
        val dataCaptureView = DataCaptureView.newInstance(reactContext, null)
        val laserViewfinder = LaserlineViewfinder()
        val rectangularViewfinder = RectangularViewfinder()
        val spotlightViewfinder = SpotlightViewfinder()
        val aimerViewfinder = AimerViewfinder()
        val brush = Brush.transparent()
        val availableCameraPositions = listOfNotNull(
            Camera.getCamera(CameraPosition.USER_FACING)?.position,
            Camera.getCamera(CameraPosition.WORLD_FACING)?.position
        )

        SerializableCoreDefaults(
            deviceId = DataCaptureContext.DEVICE_ID,
            cameraDefaults = SerializableCameraDefaults(
                cameraSettingsDefaults = SerializableCameraSettingsDefaults(
                    settings = cameraSettings
                ),
                availablePositions = availableCameraPositions,
                defaultPosition = Camera.getDefaultCamera()?.position?.toJson()
            ),
            dataCaptureViewDefaults = SerializableDataCaptureViewDefaults(dataCaptureView),
            laserlineViewfinderDefaults = SerializableLaserlineViewfinderDefaults(
                laserViewfinder
            ),
            rectangularViewfinderDefaults = SerializableRectangularViewfinderDefaults(
                rectangularViewfinder
            ),
            spotlightViewfinderDefaults = SerializableSpotlightViewfinderDefaults(
                size = spotlightViewfinder.sizeWithUnitAndAspect.toJson(),
                enabledBorderColor = spotlightViewfinder.enabledBorderColor.hexString,
                disabledBorderColor = spotlightViewfinder.disabledBorderColor.hexString,
                backgroundColor = spotlightViewfinder.backgroundColor.hexString
            ),
            aimerViewfinderDefaults = SerializableAimerViewfinderDefaults(
                frameColor = aimerViewfinder.frameColor.hexString,
                dotColor = aimerViewfinder.dotColor.hexString
            ),
            brushDefaults = SerializableBrushDefaults(
                brush = brush
            )
        )
    }

    private val deserializers: Deserializers by lazy {
        Deserializers.Factory.create(reactContext, this)
    }

    override fun onCatalystInstanceDestroy() {
        dispose()
    }

    override fun getName(): String = "ScanditDataCaptureCore"

    override fun getConstants(): MutableMap<String, Any> = mutableMapOf(
        VERSION_KEY to DataCaptureVersion.VERSION_STRING,
        DEFAULTS_KEY to defaults.toWritableMap()
    )

    @ReactMethod
    fun registerListenerForEvents() {
        dataCaptureContextListener.hasNativeListeners.set(true)
    }

    @ReactMethod
    fun unregisterListenerForEvents() {
        dataCaptureContextListener.hasNativeListeners.set(false)
    }

    @ReactMethod
    fun registerListenerForCameraEvents() {
        frameSourceListener.hasNativeListeners.set(true)
    }

    @ReactMethod
    fun unregisterListenerForCameraEvents() {
        frameSourceListener.hasNativeListeners.set(false)
    }

    @ReactMethod
    fun registerListenerForViewEvents() {
        dataCaptureViewListener.hasNativeListeners.set(true)
    }

    @ReactMethod
    fun unregisterListenerForViewEvents() {
        dataCaptureViewListener.hasNativeListeners.set(false)
    }

    @ReactMethod
    fun contextFromJSON(json: String, promise: Promise) {
        dispose()

        try {
            val result = deserializers.dataCaptureContextDeserializer.contextFromJson(json)

            dataCaptureContext = result.dataCaptureContext

            DataCaptureViewHandler.dataCaptureView = result.view?.also {
                it.addListener(this)
            }

            TreeLifecycleObserver.dispatchTreeCreated(result.dataCaptureContext)

            promise.resolve(null)
        } catch (e: AssertionError) {
            promise.reject(e)
        } catch (e: JSONException) {
            promise.reject(e)
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            promise.reject(e)
        }
    }

    @ReactMethod
    fun updateContextFromJSON(json: String, promise: Promise) {
        dataCaptureContext?.let { dataCaptureContext ->
            withRnViewsRemovedOnUiThread(json) { newJson ->
                // Parsers are re-created during the update. Avoid keeping stale ones.
                TreeLifecycleObserver.dispatchParsersRemoved()

                val result = deserializers.dataCaptureContextDeserializer.updateContextFromJson(
                    dataCaptureContext,
                    DataCaptureViewHandler.dataCaptureView,
                    emptyList(),
                    newJson
                )

                DataCaptureViewHandler.dataCaptureView?.removeListener(this)

                DataCaptureViewHandler.dataCaptureView = result.view?.also {
                    it.addListener(this)
                }
            }

            promise.resolve(null)
            return
        }

        // Since dataCaptureContext is null, initialize it instead of updating it.
        contextFromJSON(json, promise)
    }

    @ReactMethod
    fun getLastFrame(promise: Promise) {
        val lastFrame = ScanditDataCaptureCoreModule.lastFrame

        if (lastFrame == null) {
            promise.reject(ERROR_NULL_FRAME)
            return
        }

        promise.resolve(lastFrame.toJson())
    }

    @ReactMethod
    fun dispose() {
        TreeLifecycleObserver.dispatchTreeDestroyed()

        dataCaptureContext?.release()
        dataCaptureContext = null
        camera = null

        DataCaptureViewHandler.dataCaptureView?.removeListener(this)
        DataCaptureViewHandler.dataCaptureView = null
    }

    @ReactMethod
    fun emitFeedback(json: String, promise: Promise) {
        try {
            val feedback = Feedback.fromJson(json)
            latestFeedback?.release()
            feedback.emit()
            latestFeedback = feedback

            promise.resolve(null)
        } catch (e: JSONException) {
            promise.reject(e)
        } catch (e: RuntimeException) { // TODO [SDC-1851] - fine-catch deserializer exceptions
            promise.reject(e)
        }
    }

    @ReactMethod
    fun viewPointForFramePoint(json: String, promise: Promise) {
        val view = DataCaptureViewHandler.dataCaptureView ?: run {
            promise.reject(ERROR_NULL_VIEW)
            return
        }

        try {
            val mappedPoint = view.mapFramePointToView(
                PointDeserializer.fromJson(json)
            ).densityIndependent
            promise.resolve(mappedPoint.toJson())
        } catch (e: JSONException) {
            println(e)
            promise.reject(ERROR_DESERIALIZATION_FAILED)
        }
    }

    @ReactMethod
    fun viewQuadrilateralForFrameQuadrilateral(json: String, promise: Promise) {
        val view = DataCaptureViewHandler.dataCaptureView ?: run {
            promise.reject(ERROR_NULL_VIEW)
            return
        }

        try {
            val mappedQuadrilateral = view.mapFrameQuadrilateralToView(
                QuadrilateralDeserializer.fromJson(json)
            ).densityIndependent
            promise.resolve(mappedQuadrilateral.toJson())
        } catch (e: JSONException) {
            println(e)
            promise.reject(ERROR_DESERIALIZATION_FAILED)
        }
    }

    private val Quadrilateral.densityIndependent: Quadrilateral
        get() = Quadrilateral(
            topLeft.densityIndependent,
            topRight.densityIndependent,
            bottomRight.densityIndependent,
            bottomLeft.densityIndependent
        )

    private val Point.densityIndependent: Point
        get() {
            val density = reactContext.resources.displayMetrics.density
            return Point(x / density, y / density)
        }

    @ReactMethod
    fun getCurrentCameraState(cameraPosition: String, promise: Promise) {
        try {
            @Suppress("UseCheckOrError") // Explicit exception for readability.
            camera
                ?.takeIf { it.position == CameraPositionDeserializer.fromJson(cameraPosition) }
                ?.let { promise.resolve(it.currentState.toJson()) }
                ?: throw IllegalStateException(
                    "Camera at $cameraPosition has yet not been instantiated."
                )
        } catch (e: IllegalStateException) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun isTorchAvailable(cameraPosition: String, promise: Promise) {
        val camera = camera ?: run {
            promise.reject(ERROR_CAMERA_NOT_READY)
            return
        }

        if (camera.position != CameraPositionDeserializer.fromJson(cameraPosition)) {
            promise.reject(ERROR_WRONG_CAMERA_POSITION)
            return
        }

        promise.resolve(camera.isTorchAvailable)
    }

    override fun onFrameSourceDeserializationFinished(
        deserializer: FrameSourceDeserializer,
        frameSource: FrameSource,
        json: JsonValue
    ) {
        camera = frameSource as? Camera ?: return

        camera?.let {
            if (json.contains("desiredTorchState")) {
                it.desiredTorchState = TorchStateDeserializer.fromJson(
                    json.requireByKeyAsString("desiredTorchState")
                )
            }

            if (json.contains("desiredState")) {
                it.switchToDesiredState(
                    FrameSourceStateDeserializer.fromJson(
                        json.requireByKeyAsString("desiredState")
                    )
                )
            }
        }
    }
}
