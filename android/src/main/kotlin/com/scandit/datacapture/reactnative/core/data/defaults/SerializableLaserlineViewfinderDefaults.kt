/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.core.common.geometry.toJson
import com.scandit.datacapture.core.ui.viewfinder.LaserlineViewfinder
import com.scandit.datacapture.core.ui.viewfinder.LaserlineViewfinderStyle
import com.scandit.datacapture.core.ui.viewfinder.serialization.toJson
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.hexString
import com.scandit.datacapture.reactnative.core.utils.writableMap

class SerializableLaserlineViewfinderDefaults(
    private val viewFinder: LaserlineViewfinder
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_VIEW_FINDER_DEFAULT_STYLE, viewFinder.style.toJson())
        putMap(
            FIELD_VIEW_FINDER_STYLES,
            writableMap {
                putMap(
                    LaserlineViewfinderStyle.ANIMATED.toJson(),
                    createViewfinderDefaults(LaserlineViewfinderStyle.ANIMATED)
                )
                putMap(
                    LaserlineViewfinderStyle.LEGACY.toJson(),
                    createViewfinderDefaults(LaserlineViewfinderStyle.LEGACY)
                )
            }
        )
    }

    private fun createViewfinderDefaults(
        style: LaserlineViewfinderStyle
    ): WritableMap {
        return with(LaserlineViewfinder(style)) {
            writableMap {
                putString(FIELD_VIEW_FINDER_WIDTH, width.toJson())
                putString(FIELD_VIEW_FINDER_ENABLED_COLOR, enabledColor.hexString)
                putString(FIELD_VIEW_FINDER_DISABLED_COLOR, disabledColor.hexString)
                putString(FIELD_VIEW_FINDER_STYLE, style.toJson())
            }
        }
    }

    companion object {
        private const val FIELD_VIEW_FINDER_DEFAULT_STYLE = "defaultStyle"
        private const val FIELD_VIEW_FINDER_STYLES = "styles"
        private const val FIELD_VIEW_FINDER_WIDTH = "width"
        private const val FIELD_VIEW_FINDER_ENABLED_COLOR = "enabledColor"
        private const val FIELD_VIEW_FINDER_DISABLED_COLOR = "disabledColor"
        private const val FIELD_VIEW_FINDER_STYLE = "style"
    }
}
