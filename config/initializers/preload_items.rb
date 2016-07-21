if !Rails.env.test? && ActiveRecord::Base.connection.table_exists?('screens')
  Screen.cached_collection_by_slug
  Screen.cached_collection_by_position
  Screen.questions_cache
end
