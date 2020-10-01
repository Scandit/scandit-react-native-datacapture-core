/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditCaptureCore

extension ScanditDataCaptureCore {
    public override func constantsToExport() -> [AnyHashable: Any]! {
        return ["Defaults": defaults,
                "Version": DataCaptureVersion.version()]
    }

    var defaults: [String: Any?] {
        return ["Camera": cameraDefaults,
                "DataCaptureView": dataCaptureViewDefaults,
                "LaserlineViewfinder": laserlineViewfinderDefaults,
                "RectangularViewfinder": rectangularViewfinderDefaults,
                "SpotlightViewfinder": spotlightViewfinderDefaults,
                "Brush": brushDefaults,
                "deviceID": DataCaptureContext.deviceID
        ]
    }

    var cameraDefaults: [String: Any?] {
        let defaultPosition = Camera.default?.position.jsonString

        return ["Settings": cameraSettingsDefaults,
                "defaultPosition": defaultPosition,
                "availablePositions": availableCameraPositions]
    }

    var cameraSettingsDefaults: [AnyHashable: Any] {
        let defaultCameraSettings = CameraSettings()
        return defaultCameraSettings.rntsdc_dictionary
    }

    var availableCameraPositions: [String] {
        return [CameraPosition.userFacing,
                CameraPosition.worldFacing,
                CameraPosition.unspecified]
            .compactMap { Camera(position: $0) }
            .map {$0.position.jsonString}
    }

    var dataCaptureViewDefaults: [String: Any] {
        return ["scanAreaMargins": DataCaptureView.defaultScanAreaMargins.jsonString,
                "pointOfInterest": DataCaptureView.defaultPointOfInterest.jsonString,
                "logoAnchor": DataCaptureView.defaultLogoAnchor.jsonString,
                "logoOffset": DataCaptureView.defaultLogoOffset.jsonString ]
    }

    var laserlineViewfinderDefaults: [String: Any] {
        let laserlineViewfinder = LaserlineViewfinder()
        return ["width": laserlineViewfinder.width.jsonString,
                "enabledColor": laserlineViewfinder.enabledColor.sdcHexString,
                "disabledColor": laserlineViewfinder.disabledColor.sdcHexString]
    }

    var rectangularViewfinderDefaults: [String: Any] {
        let rectangularViewfinder = RectangularViewfinder()
        return ["size": rectangularViewfinder.sizeWithUnitAndAspect.jsonString,
                "color": rectangularViewfinder.color.sdcHexString]
    }

    var spotlightViewfinderDefaults: [String: Any] {
        let spotlightViewfinder = SpotlightViewfinder()
        return ["size": spotlightViewfinder.sizeWithUnitAndAspect.jsonString,
                "enabledBorderColor": spotlightViewfinder.enabledBorderColor.sdcHexString,
                "disabledBorderColor": spotlightViewfinder.disabledBorderColor.sdcHexString,
                "backgroundColor": spotlightViewfinder.backgroundColor.sdcHexString]
    }

    var brushDefaults: [String: Any] {
        let brush = Brush()
        return ["fillColor": brush.fillColor.sdcHexString,
                "strokeColor": brush.strokeColor.sdcHexString,
                "strokeWidth": brush.strokeWidth]
    }
}
