/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2025- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data

import com.facebook.react.bridge.Promise

data class ViewCreationRequest(val viewId: Int, val viewJson: String, val promise: Promise)
