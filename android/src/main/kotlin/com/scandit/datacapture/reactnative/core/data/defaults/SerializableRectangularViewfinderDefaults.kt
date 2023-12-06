/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.core.ui.viewfinder.RectangularViewfinder
import com.scandit.datacapture.core.ui.viewfinder.RectangularViewfinderStyle
import com.scandit.datacapture.core.ui.viewfinder.serialization.toJson
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.hexString
import com.scandit.datacapture.reactnative.core.utils.writableMap

class SerializableRectangularViewfinderDefaults(
    private val rectangularViewfinder: RectangularViewfinder
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_VIEW_FINDER_DEFAULT_STYLE, rectangularViewfinder.style.toJson())
        putMap(
            FIELD_VIEW_FINDER_STYLES,
            writableMap {
                putMap(
                    RectangularViewfinderStyle.LEGACY.toJson(),
                    createViewfinderDefaults(RectangularViewfinderStyle.LEGACY)
                )
                putMap(
                    RectangularViewfinderStyle.ROUNDED.toJson(),
                    createViewfinderDefaults(RectangularViewfinderStyle.ROUNDED)
                )
                putMap(
                    RectangularViewfinderStyle.SQUARE.toJson(),
                    createViewfinderDefaults(RectangularViewfinderStyle.SQUARE)
                )
            }
        )
    }

    private fun createViewfinderDefaults(
        style: RectangularViewfinderStyle
    ): WritableMap {
        return with(RectangularViewfinder(style)) {
            writableMap {
                putString(FIELD_VIEW_FINDER_SIZE, sizeWithUnitAndAspect.toJson())
                putString(FIELD_VIEW_FINDER_COLOR, color.hexString)
                putString(FIELD_VIEW_FINDER_DISABLED_COLOR, disabledColor.hexString)
                putString(FIELD_VIEW_FINDER_STYLE, style.toJson())
                putString(FIELD_VIEW_FINDER_LINE_STYLE, lineStyle.toJson())
                putDouble(FIELD_VIEW_FINDER_DIMMING, dimming.toDouble())
                putDouble(FIELD_VIEW_FINDER_DISABLED_DIMMING, disabledDimming.toDouble())
                putString(FIELD_VIEW_FINDER_ANIMATION, animation?.toJson())
            }
        }
    }

    companion object {
        private const val FIELD_VIEW_FINDER_DEFAULT_STYLE = "defaultStyle"
        private const val FIELD_VIEW_FINDER_STYLES = "styles"
        private const val FIELD_VIEW_FINDER_SIZE = "size"
        private const val FIELD_VIEW_FINDER_COLOR = "color"
        private const val FIELD_VIEW_FINDER_DISABLED_COLOR = "disabledColor"
        private const val FIELD_VIEW_FINDER_STYLE = "style"
        private const val FIELD_VIEW_FINDER_LINE_STYLE = "lineStyle"
        private const val FIELD_VIEW_FINDER_DIMMING = "dimming"
        private const val FIELD_VIEW_FINDER_DISABLED_DIMMING = "disabledDimming"
        private const val FIELD_VIEW_FINDER_ANIMATION = "animation"
    }
}
