# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB react_codegen_SRCS CONFIGURE_DEPENDS *.cpp react/renderer/components/ScanditReactNativeDatacaptureCoreSpec/*.cpp)

add_library(
  react_codegen_ScanditReactNativeDatacaptureCoreSpec
  OBJECT
  ${react_codegen_SRCS}
)

target_include_directories(react_codegen_ScanditReactNativeDatacaptureCoreSpec PUBLIC . react/renderer/components/ScanditReactNativeDatacaptureCoreSpec)

target_link_libraries(
  react_codegen_ScanditReactNativeDatacaptureCoreSpec
  fbjni
  jsi
  # We need to link different libraries based on whether we are building rncore or not, that's necessary
  # because we want to break a circular dependency between react_codegen_rncore and reactnative
  reactnative
)

# target_compile_reactnative_options ships with React Native 0.81+. On older
# RN (e.g. 0.78 with New Architecture) the macro is undefined and configure
# fails with "Unknown CMake command". Guard it and fall back to the equivalent
# flags the helper sets, including RN_SERIALIZABLE_STATE on Android (required
# for correct Fabric memory layout in Release builds).
if(COMMAND target_compile_reactnative_options)
  target_compile_reactnative_options(react_codegen_ScanditReactNativeDatacaptureCoreSpec PRIVATE)
else()
  target_compile_options(
    react_codegen_ScanditReactNativeDatacaptureCoreSpec
    PRIVATE
    -DLOG_TAG=\"ReactNative\"
    -fexceptions
    -frtti
    -std=c++20
    -Wall
  )
  if(ANDROID)
    target_compile_definitions(react_codegen_ScanditReactNativeDatacaptureCoreSpec PRIVATE RN_SERIALIZABLE_STATE)
  endif()
endif()
target_compile_options(react_codegen_ScanditReactNativeDatacaptureCoreSpec PRIVATE -Wno-deprecated-declarations)
