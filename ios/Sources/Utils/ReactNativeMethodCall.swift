/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2025- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditFrameworksCore

public class ReactNativeMethodCall: FrameworksMethodCall {

    private let data: [String: Any]

    public init(_ data: [String: Any]) {
        self.data = data
    }

    public func argument<T>(key: String) -> T? {
        guard let value = data[key] else {
            return nil
        }

        if let result = value as? T {
            return result
        }

        if T.self == Int.self || T.self == Int?.self {
            if let intValue = convertToInt(value) {
                return unsafeBitCast(intValue, to: T.self)
            }
        }

        if T.self == Int64.self || T.self == Int64?.self {
            if let longValue = convertToLong(value) {
                return unsafeBitCast(longValue, to: T.self)
            }
        }

        if T.self == Double.self || T.self == Double?.self {
            if let doubleValue = convertToDouble(value) {
                return unsafeBitCast(doubleValue, to: T.self)
            }
        }

        if T.self == Bool.self || T.self == Bool?.self {
            if let boolValue = convertToBool(value) {
                return unsafeBitCast(boolValue, to: T.self)
            }
        }

        return value as? T
    }

    public func arguments() -> [String: Any] {
        data
    }

    public var method: String {
        data["methodName"] as? String ?? "unknown"
    }

    public func hasArgument(key: String) -> Bool {
        data.keys.contains(key)
    }

    public func arguments() -> [String: Any?] {
        data
    }

    private func convertToInt(_ value: Any) -> Int? {
        switch value {
        case let intValue as Int:
            return intValue
        case let doubleValue as Double:
            if doubleValue.truncatingRemainder(dividingBy: 1.0) == 0.0 && doubleValue >= Double(Int.min)
                && doubleValue <= Double(Int.max)
            {
                return Int(doubleValue)
            }
            return nil
        case let floatValue as Float:
            return Int(floatValue.rounded())
        case let cgFloatValue as CGFloat:
            return Int(cgFloatValue.rounded())
        case let nsNumberValue as NSNumber:
            return nsNumberValue.intValue
        case let stringValue as String:
            return Int(stringValue)
        default:
            return nil
        }
    }

    private func convertToLong(_ value: Any) -> Int64? {
        switch value {
        case let intValue as Int:
            return Int64(intValue)
        case let int64Value as Int64:
            return int64Value
        case let doubleValue as Double:
            if doubleValue.truncatingRemainder(dividingBy: 1.0) == 0.0 {
                return Int64(doubleValue)
            }
            return nil
        case let floatValue as Float:
            return Int64(floatValue.rounded())
        case let cgFloatValue as CGFloat:
            return Int64(cgFloatValue.rounded())
        case let nsNumberValue as NSNumber:
            return nsNumberValue.int64Value
        case let stringValue as String:
            return Int64(stringValue)
        default:
            return nil
        }
    }

    private func convertToDouble(_ value: Any) -> Double? {
        switch value {
        case let doubleValue as Double:
            return doubleValue
        case let floatValue as Float:
            return Double(floatValue)
        case let cgFloatValue as CGFloat:
            return Double(cgFloatValue)
        case let intValue as Int:
            return Double(intValue)
        case let int64Value as Int64:
            return Double(int64Value)
        case let nsNumberValue as NSNumber:
            return nsNumberValue.doubleValue
        case let stringValue as String:
            return Double(stringValue)
        default:
            return nil
        }
    }

    private func convertToBool(_ value: Any) -> Bool? {
        switch value {
        case let boolValue as Bool:
            return boolValue
        case let nsNumberValue as NSNumber:
            return nsNumberValue.boolValue
        case let intValue as Int:
            return intValue != 0
        case let stringValue as String:
            let lowercased = stringValue.lowercased()
            if lowercased == "true" || lowercased == "1" {
                return true
            } else if lowercased == "false" || lowercased == "0" {
                return false
            }
            return nil
        default:
            return nil
        }
    }
}
