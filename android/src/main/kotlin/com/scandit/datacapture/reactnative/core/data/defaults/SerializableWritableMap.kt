/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2021- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import org.json.JSONArray
import org.json.JSONObject

class SerializableWritableMap(
    private val json: JSONObject
) : SerializableData {

    override fun toWritableMap(): WritableMap = convertJsonToMap(json)

    private fun convertJsonToMap(jsonObject: JSONObject): WritableMap {
        val map: WritableMap = WritableNativeMap()
        val iterator = jsonObject.keys()
        while (iterator.hasNext()) {
            val key = iterator.next()
            when (val value = jsonObject[key]) {
                is JSONObject -> map.putMap(key, convertJsonToMap(value))
                is JSONArray -> {
                    map.putArray(key, convertJsonToArray(value))
                    if ("option_values" == key) {
                        map.putArray("options", convertJsonToArray(value))
                    }
                }
                is Boolean -> map.putBoolean(key, value)
                is Int -> map.putInt(key, value)
                is Double -> map.putDouble(key, value)
                is String -> map.putString(key, value)
                else -> map.putString(key, value.toString())
            }
        }
        return map
    }

    private fun convertJsonToArray(jsonArray: JSONArray): WritableArray {
        val array: WritableArray = WritableNativeArray()
        for (i in 0 until jsonArray.length()) {
            when (val value = jsonArray[i]) {
                is JSONObject -> array.pushMap(convertJsonToMap(value))
                is JSONArray -> array.pushArray(convertJsonToArray(value))
                is Boolean -> array.pushBoolean(value)
                is Int -> array.pushInt(value)
                is Double -> array.pushDouble(value)
                is String -> array.pushString(value)
                else -> array.pushString(value.toString())
            }
        }
        return array
    }
}
