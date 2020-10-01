/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation

public struct JSView {
    enum DeserializationError: Error {
        case keyNotFound(String)
    }

    enum CodingKeys: String, CodingKey {
        case moduleName
        case initialProperties
    }

    public let moduleName: String
    public let initialProperties: [String: Any]

    public init(with dictionary: [String: Any]) throws {
        guard
            let moduleName = dictionary[CodingKeys.moduleName.rawValue] as? String else {
                throw DeserializationError.keyNotFound(CodingKeys.moduleName.rawValue)
        }
        self.moduleName = moduleName
        initialProperties = (dictionary[CodingKeys.initialProperties.rawValue] as? [String: Any]) ?? [:]
    }
}
