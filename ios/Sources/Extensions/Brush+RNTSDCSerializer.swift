/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditCaptureCore

extension Brush {
    public var rntsdcDictionary: [String: Any] {
        [
            "fillColor": fillColor.sdcHexString,
            "strokeColor": strokeColor.sdcHexString,
            "strokeWidth": strokeWidth,
        ]
    }
}
