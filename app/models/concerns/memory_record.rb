module MemoryRecord
  extend ActiveSupport::Concern

  class_methods do
    def first
      @first ||= cached_collection_by_position.first
    end

    def last
      @last ||= cached_collection_by_position.last
    end

    def find_by_slug!(slug)
      cached_collection_by_slug[slug] || raise(ActiveRecord::RecordNotFound)
    end

    def find_by_position(position)
      cached_collection_by_position[position]
    end

    def find_by_id(id)
      cached_collection_by_id[id]
    end

    def cached_collection_by_position
      @cached_collection_by_position ||= self.order(position: :asc).all
    end

    def cached_collection_by_slug
      @cached_collection_by_slug ||= Hash[self.all.map{|i| [i.slug, i]}]
    end

    def cached_collection_by_id
      @cached_collection_by_id ||= Hash[self.all.map{|i| [i.id, i]}]
    end

    def cached_count
      cached_collection_by_id.size
    end
  end

  def next
    @next ||= self.class.cached_collection_by_position[self.position + 1]
  end
end
