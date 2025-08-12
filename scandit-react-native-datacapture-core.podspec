require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
version = package["version"]

Pod::Spec.new do |s|
  s.name                    = package["name"]
  s.version                 = version
  s.summary                 = package["description"]
  s.homepage                = package["homepage"]
  s.license                 = package["license"]
  s.authors                 = { package["author"]["name"] => package["author"]["email"] }
  s.platforms               = { :ios => "14.0" }
  s.source                  = { :git => package["homepage"] + ".git", :tag => "#{s.version}" }
  s.swift_version           = '5.0'
  s.source_files            = "ios/Sources/**/*.{h,m,swift}"
  s.requires_arc            = true
  s.module_name             = "ScanditDataCaptureCore"
  s.header_dir              = "ScanditDataCaptureCore"

  s.dependency "scandit-datacapture-frameworks-core", '= 7.5.0'
  s.dependency "React"

  # Check if new architecture is enabled
  is_new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

  # New Architecture specific dependencies
  if is_new_arch_enabled
    s.dependency "React-RCTAppDelegate"
  end

  # Set compiler flags for architecture detection (informational only)
  if is_new_arch_enabled
    s.compiler_flags = '-DRCT_NEW_ARCH_ENABLED=1'
    s.pod_target_xcconfig = {
      'SWIFT_ACTIVE_COMPILATION_CONDITIONS' => 'RCT_NEW_ARCH_ENABLED',
      'OTHER_CPLUSPLUSFLAGS' => '-DRCT_NEW_ARCH_ENABLED=1',
      'OTHER_CFLAGS' => '-DRCT_NEW_ARCH_ENABLED=1'
    }
  else
    s.compiler_flags = '-DRCT_NEW_ARCH_ENABLED=0'
    s.pod_target_xcconfig = {
      'OTHER_CPLUSPLUSFLAGS' => '-DRCT_NEW_ARCH_ENABLED=0',
      'OTHER_CFLAGS' => '-DRCT_NEW_ARCH_ENABLED=0'
    }
  end
end
