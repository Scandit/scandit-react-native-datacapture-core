/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation

public class CallbackLock<ResultType> {

    enum Condition: Int {
        case noResult
        case result
    }

    private let name: String
    private var result: ResultType?

    let condition = NSCondition()
    var isCallbackFinished = true

    public init(name: String) {
        self.name = name
    }

    public func wait(default: ResultType? = nil, afterDoing block: () -> Bool) -> ResultType? {
        let timeout = 2.0
        let timeoutDate = Date(timeIntervalSinceNow: timeout)

        result = `default`

        isCallbackFinished = false

        guard block() else {
            isCallbackFinished = true
            return result
        }

        condition.lock()
        while !isCallbackFinished {
            if !condition.wait(until: timeoutDate) {
                LogWarn("Waited for \(name) to finish for \(timeout) seconds")
                isCallbackFinished = true
            }
        }
        condition.unlock()

        return result
    }

    public func unlock(value: ResultType?) {
        result = value
        release()
    }

    public func reset() {
        release()
    }

    private func release() {
        isCallbackFinished = true
        condition.signal()
    }
}
