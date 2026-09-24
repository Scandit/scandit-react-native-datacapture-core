/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditCaptureCore

extension CameraSettings {
    public var rntsdc_dictionary: [String: Any] {
        return ["preferredResolution": preferredResolution.jsonString,
                "zoomFactor": zoomFactor,
                "focusRange": focusRange.jsonString,
                "shouldPreferSmoothAutoFocus": shouldPreferSmoothAutoFocus,
                "zoomGestureZoomFactor": zoomGestureZoomFactor,
                "focusGestureStrategy": focusGestureStrategy.jsonString]
    }
}
