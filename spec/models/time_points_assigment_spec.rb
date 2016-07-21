require 'rails_helper'

RSpec.describe TimePointsAssigment, :type => :model do
  describe '#points' do
    it 'should return the points for a given time' do
      t = TimePointsAssigment.new Question.new, 30
      expect(t.points).to eq(368)
    end
  end
end
