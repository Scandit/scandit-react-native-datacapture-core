require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
version = package["version"]

# Helper to detect React Native version
rn_version_gte = lambda do |min_version|
  begin
    rn_package_path = File.join(__dir__, "..", "react-native", "package.json")
    unless File.exist?(rn_package_path)
      # Try node_modules path for samples/apps
      rn_package_path = File.join(__dir__, "..", "..", "node_modules", "react-native", "package.json")
    end
    return false unless File.exist?(rn_package_path)

    rn_package = JSON.parse(File.read(rn_package_path))
    rn_version = rn_package["version"]
    Gem::Version.new(rn_version) >= Gem::Version.new(min_version)
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
  s.source_files            = "ios/Sources/**/*.{h,m,swift}"
  s.requires_arc            = true
  s.module_name             = "ScanditDataCaptureCore"
  s.header_dir              = "ScanditDataCaptureCore"

  s.dependency "scandit-datacapture-frameworks-core", '= 8.2.0'
  s.dependency "React-Core"

  # New Architecture specific dependencies and compiler flags
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    s.dependency "React-RCTAppDelegate"

    swift_flags = ['-DRCT_NEW_ARCH_ENABLED']
    # RCTReactNativeFactory was introduced in RN 0.78
    if rn_version_gte.call("0.78.0")
      swift_flags << '-DRCT_REACT_NATIVE_FACTORY_AVAILABLE'
    end

    s.pod_target_xcconfig = {
      'OTHER_SWIFT_FLAGS' => swift_flags.join(' ')
    }
  end

  install_modules_dependencies(s)
end
