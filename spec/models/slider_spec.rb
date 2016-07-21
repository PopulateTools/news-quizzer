require 'rails_helper'

RSpec.describe Slider, :type => :model do
  describe '#as_json' do
    context 'for small numbers' do
      it 'it should export a json version' do
        question = Slider.new options: [10,3000], right_options: 30
        expect(question.as_json).to eq({:question=>nil, :domain=>[10, 3000], :number_format=>".2s", :values=>[{:label=>"Your guess", :value=>10, :class=>"guess"}]})
      end
    end
    context 'for big numbers' do
      it 'it should export a json version' do
        question = Slider.new options: [10_000_000_000,3_000_000_000_000], right_options: 30_000_000_000
        expect(question.as_json).to eq({:question=>nil, :domain=>[10000000000, 3000000000000], :number_format=>".2s", :values=>[{:label=>"Your guess", :value=>10000000000, :class=>"guess"}]})
      end
    end
  end

  describe '#right_options_check' do
    it 'it should return an array with guess and reality elements' do
      question = Slider.new options: [10,3000], right_options: 30
      expect(question.right_options_check).to eq({:right_options=>[{:label=>"Average guess", :value=>0.0, :class=>"average"}, {:label=>"Reality", :value=>30, :class=>"reality"}]})
    end
  end

  describe '#correct?' do
    it 'it should work with the exact answer' do
      question = Slider.new options: [10,3000], right_options: 30
      expect(question.correct?(Set.new([30]))).to be true
    end

    it 'it should work with an answer in the 10% range' do
      question = Slider.new options: [10,3000], right_options: 30
      expect(question.correct?(Set.new([26]))).to be false
      expect(question.correct?(Set.new([27]))).to be true
      expect(question.correct?(Set.new([28]))).to be true
      expect(question.correct?(Set.new([29]))).to be true
      expect(question.correct?(Set.new([31]))).to be true
      expect(question.correct?(Set.new([32]))).to be true
      expect(question.correct?(Set.new([33]))).to be true
      expect(question.correct?(Set.new([34]))).to be false
    end
  end

end
