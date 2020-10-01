/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditCaptureCore

extension ScanditDataCaptureCore: DataCaptureViewListener {
    public func dataCaptureView(_ view: DataCaptureView,
                                didChange size: CGSize,
                                orientation: UIInterfaceOrientation) {
        let body: [String: Any] = [
            "size": [
                "width": size.width,
                "height": size.height
            ],
            "orientation": orientation.rntsdc_description
        ]
        guard sendEvent(withName: .didChangeSize, body: body) else { return }
    }
}
