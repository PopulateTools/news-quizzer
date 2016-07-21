require 'rails_helper'

RSpec.describe Screen, :type => :model do
  fixtures :screens

  describe '.first' do
    it 'should return the screens at position 0' do
      expect(self.described_class.first.position).to eq(0)
    end
  end

  describe '.find_by_slug' do
    it 'should return the screens with a given slug' do
      slug = 'start'
      screens = self.described_class.find_by_slug!(slug)
      expect(screens).to be_present
      expect(screens.slug).to eq(slug)
    end

    it 'should raise an error if the slug does not exist' do
      slug = 'startxxx'
      expect {
        self.described_class.find_by_slug!(slug)
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe '.find_by_position' do
    it 'should return the screens in a given position' do
      screens = self.described_class.find_by_position(0)
      expect(screens).to be_present
      expect(screens.position).to eq(0)
    end

    it 'return nil if there is no screens in such position' do
      expect(self.described_class.find_by_position(99)).to be_nil
    end
  end

  describe '.find_by_id' do
    it 'should return the screens by id' do
      screens = self.described_class.find_by_id(1)
      expect(screens).to be_present
      expect(screens.id).to eq(1)
    end

    it 'return nil if there is no screens in such id' do
      expect(self.described_class.find_by_id(99)).to be_nil
    end
  end

  describe '#next' do
    it 'should return the next screens by position' do
      screens = self.described_class.find_by_position(0)
      expect(screens.next.position).to eq(1)
    end
  end
end
