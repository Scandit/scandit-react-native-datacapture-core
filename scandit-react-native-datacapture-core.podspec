require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name                    = package["name"]
  s.version                 = package["version"]
  s.summary                 = package["description"]
  s.homepage                = package["homepage"]
  s.license                 = package["license"]
  s.authors                 = { package["author"]["name"] => package["author"]["email"] }
  s.platforms               = { :ios => "11.0" }
  s.source                  = { :git => package["homepage"] + ".git", :tag => "#{s.version}" }
  s.swift_version           = '4.0'
  s.source_files            = "ios/Sources/**/*.{h,m,swift}"
  s.requires_arc            = true
  s.module_name             = "ScanditDataCaptureCore"
  s.header_dir              = "ScanditDataCaptureCore"
  s.dependency 'ScanditCaptureCore', '= 6.13.1'

  s.dependency "React"
end
