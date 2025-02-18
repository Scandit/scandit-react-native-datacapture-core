/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import React
import ScanditFrameworksCore

public class ReactNativeResult: FrameworksResult {
    private let resolve: RCTPromiseResolveBlock
    private let rejecter: RCTPromiseRejectBlock
    private var resolved: Bool = false

    public init(_ resolve: @escaping RCTPromiseResolveBlock,
                _ reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.rejecter = reject
    }

    public func success(result object: Any?) {
        if let resultDict = object as? [String: Any] {
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: resultDict, options: [])
                if let jsonString = String(data: jsonData, encoding: .utf8) {
                    resolve(jsonString)
                }
            } catch let error {
                reject(code: "JSON_ERROR", message: "Failed to convert to JSON", details: error)
            }
            return
        }
        resolved = true
        resolve(object)
    }

    public func reject(code: String, message: String?, details: Any?) {
        self.rejecter(code, message, nil)
    }

    public func reject(error: Error) {
        self.rejecter(String(error._code), error.localizedDescription, error as NSError)
    }

    public func isResolved() -> Bool {
        resolved
    }
}

public extension FrameworksResult where Self == ReactNativeResult {
    static func create(_ resolve: @escaping RCTPromiseResolveBlock,
                       _ reject: @escaping RCTPromiseRejectBlock) -> Self {
        .init(resolve, reject)
    }
}
