require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
version = package["version"]

# Helper to detect React Native version.
# Walks up the directory tree from the podspec location looking for
# node_modules/react-native/package.json, mirroring Node module resolution.
# This works regardless of whether dependencies are installed via file:, workspace:*,
# or any other layout (flat, hoisted, nested).
rn_version_gte = lambda do |min_version|
  begin
    dir = __dir__
    rn_package_path = nil
    until dir == File.dirname(dir) # stop at filesystem root
      candidate = File.join(dir, "node_modules", "react-native", "package.json")
      if File.exist?(candidate)
        rn_package_path = candidate
        break
      end
      dir = File.dirname(dir)
    end
    return false unless rn_package_path

    rn_package = JSON.parse(File.read(rn_package_path))
    Gem::Version.new(rn_package["version"]) >= Gem::Version.new(min_version)
  rescue
    false
  end
end

Pod::Spec.new do |s|
  s.name                    = package["name"]
  s.version                 = version
  s.summary                 = package["description"]
  s.homepage                = package["homepage"]
  s.license                 = package["license"]
  s.authors                 = { package["author"]["name"] => package["author"]["email"] }
  s.platforms               = { :ios => "15.0" }
  s.source                  = { :git => package["homepage"] + ".git", :tag => "#{s.version}" }
  s.swift_version           = '5.0'
  s.requires_arc            = true
  s.module_name             = "ScanditDataCaptureCore"
  s.header_dir              = "ScanditDataCaptureCore"

  is_new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

  # RCTReactNativeFactory was introduced in RN 0.78
  is_factory_available = rn_version_gte.call("0.78.0")

  if is_new_arch_enabled
    s.source_files = "ios/Sources/**/*.{h,m,mm,swift}", "ios/generated/**/*.{h,m,mm,cpp}"
    s.private_header_files = "ios/generated/**/*.h"
    s.exclude_files = "ios/Sources/OldArch/**/*"
    s.dependency "React-RCTAppDelegate"

    swift_flags = ['-DRCT_NEW_ARCH_ENABLED']
    if is_factory_available
      swift_flags << '-DRCT_REACT_NATIVE_FACTORY_AVAILABLE'
    end

    s.pod_target_xcconfig = {
      'OTHER_SWIFT_FLAGS' => swift_flags.join(' '),
      'HEADER_SEARCH_PATHS' => '"$(PODS_TARGET_SRCROOT)/ios/generated" "$(OBJROOT)/Pods.build/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)/$(TARGET_NAME).build/Objects-normal/$(CURRENT_ARCH)" "$(OBJROOT)/Pods.build/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)/$(TARGET_NAME).build/DerivedSources"'
    }
  else
    s.source_files = "ios/Sources/**/*.{h,m,mm,swift}"
    s.exclude_files = "ios/Sources/NewArch/**/*"
    s.dependency "React-RCTAppDelegate"

    swift_flags = []
    if is_factory_available
      swift_flags << '-DRCT_REACT_NATIVE_FACTORY_AVAILABLE'
    end

    unless swift_flags.empty?
      s.pod_target_xcconfig = {
        'OTHER_SWIFT_FLAGS' => swift_flags.join(' ')
      }
    end
  end

  s.dependency "scandit-datacapture-frameworks-core", '= 8.4.1'

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
