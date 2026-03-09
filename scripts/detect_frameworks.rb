require 'pathname'

def podspec_path_for_pod(pod_name, current_path)
    podfile_dir = File.expand_path(current_path)
    current_dir = podfile_dir

    while current_dir != '/' do
        parent_dir = File.dirname(current_dir)

        react_native_core_path = File.join(parent_dir, 'scandit-react-native-datacapture-core')
        if Dir.exist?(react_native_core_path)
            frameworks_path = File.join(parent_dir, 'frameworks', 'shared', 'ios', pod_name)
            podspec_file = File.join(frameworks_path, "#{pod_name}.podspec")

            if File.exist?(podspec_file)
                relative_path = Pathname.new(frameworks_path).relative_path_from(Pathname.new(podfile_dir))
                return relative_path.to_s
            end

            grandparent_dir = File.dirname(parent_dir)
            if File.basename(parent_dir) == 'react-native'
                frameworks_path = File.join(grandparent_dir, 'shared', 'ios', pod_name)
                podspec_file = File.join(frameworks_path, "#{pod_name}.podspec")

                if File.exist?(podspec_file)
                    relative_path = Pathname.new(frameworks_path).relative_path_from(Pathname.new(podfile_dir))
                    return relative_path.to_s
                end
            end
        end

        current_dir = parent_dir
    end

    raise "Could not find podspec for '#{pod_name}'. Searched from: #{podfile_dir}"
end
