def podspec_path_for_pod(pod_name, current_path)
    # the current_path will be always the folder of the Podfile where this function is executed
    archive_dir = File.expand_path(current_path)
    until File.exist?(File.join(archive_dir, 'frameworks'))
        parent_dir = File.expand_path('..', archive_dir)
        break if parent_dir == archive_dir
        archive_dir = parent_dir
    end
    File.join(archive_dir, 'frameworks', 'shared', 'ios', pod_name)
end
