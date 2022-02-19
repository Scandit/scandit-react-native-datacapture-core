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
                "AimerViewfinder": aimerViewfinderDefaults,
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
        var view: DataCaptureView!
        DispatchQueue.main.sync {
            view = DataCaptureView(frame: .zero)
        }
        return ["scanAreaMargins": DataCaptureView.defaultScanAreaMargins.jsonString,
                "pointOfInterest": DataCaptureView.defaultPointOfInterest.jsonString,
                "logoAnchor": DataCaptureView.defaultLogoAnchor.jsonString,
                "logoOffset": DataCaptureView.defaultLogoOffset.jsonString,
                "focusGesture": view.focusGesture?.jsonString,
                "zoomGesture": view.zoomGesture?.jsonString,
                "logoStyle": view.logoStyle.jsonString]
    }

    var laserlineViewfinderDefaults: [String: Any] {
        func createViewfinderDefaults(style: LaserlineViewfinderStyle) -> [String: Any] {
            let viewfinder = LaserlineViewfinder(style: style)
            let defaults = [
                "style": viewfinder.style.jsonString,
                "width": viewfinder.width.jsonString,
                "enabledColor": viewfinder.enabledColor.sdcHexString,
                "disabledColor": viewfinder.disabledColor.sdcHexString
            ]
            return defaults
        }

        return [
            "defaultStyle": LaserlineViewfinder().style.jsonString,
            "styles": [
                LaserlineViewfinderStyle.animated.jsonString: createViewfinderDefaults(style: .animated),
                LaserlineViewfinderStyle.legacy.jsonString: createViewfinderDefaults(style: .legacy)
            ]
        ]
    }

    var rectangularViewfinderDefaults: [String: Any] {
        func createViewfinderDefaults(style: RectangularViewfinderStyle) -> [String: Any] {
            let viewfinder = RectangularViewfinder(style: style)
            let defaults = [
                "style": viewfinder.style.jsonString,
                "size": viewfinder.sizeWithUnitAndAspect.jsonString,
                "color": viewfinder.color.sdcHexString,
                "disabledColor": viewfinder.disabledColor.sdcHexString,
                "lineStyle": viewfinder.lineStyle.jsonString,
                "dimming": viewfinder.dimming,
                "disabledDimming": viewfinder.disabledDimming,
                "animation": viewfinder.animation?.jsonString as Any
            ]
            return defaults
        }

        return [
            "defaultStyle": RectangularViewfinder().style.jsonString,
            "styles": [
                RectangularViewfinderStyle.square.jsonString: createViewfinderDefaults(style: .square),
                RectangularViewfinderStyle.rounded.jsonString: createViewfinderDefaults(style: .rounded),
                RectangularViewfinderStyle.legacy.jsonString: createViewfinderDefaults(style: .legacy)
            ]
        ]
    }

    var spotlightViewfinderDefaults: [String: Any] {
        let spotlightViewfinder = SpotlightViewfinder()
        return ["size": spotlightViewfinder.sizeWithUnitAndAspect.jsonString,
                "enabledBorderColor": spotlightViewfinder.enabledBorderColor.sdcHexString,
                "disabledBorderColor": spotlightViewfinder.disabledBorderColor.sdcHexString,
                "backgroundColor": spotlightViewfinder.backgroundColor.sdcHexString]
    }

    var aimerViewfinderDefaults: [String: Any] {
        let aimerViewfinder = AimerViewfinder()
        return ["frameColor": aimerViewfinder.frameColor.sdcHexString,
                "dotColor": aimerViewfinder.dotColor.sdcHexString]
    }

    var brushDefaults: [String: Any] {
        let brush = Brush()
        return ["fillColor": brush.fillColor.sdcHexString,
                "strokeColor": brush.strokeColor.sdcHexString,
                "strokeWidth": brush.strokeWidth]
    }
}
