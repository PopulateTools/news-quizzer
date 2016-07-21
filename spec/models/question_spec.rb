require 'rails_helper'

RSpec.describe Question, :type => :model do
  it 'should serialize options as an Array' do
    q = Question.new options: [1,2,3]
    expect(q.options.class).to be(Array)
    expect(q.options).to eq([1,2,3])
  end

  it 'should serialize right_options as a Set' do
    q = Question.new right_options: [1,2,3]
    expect(q.right_options.class).to be(Set)
    expect(q.right_options).to include(1)
    expect(q.right_options).to include(2)
    expect(q.right_options).to include(3)
  end

  describe '#correct?' do
    context 'when answer options is a number' do
      it 'should detect if the options are the same' do
        question = Question.new options: [1,2,3], right_options: 1
        expect(question.correct?(Set.new(['1']))).to be true
        expect(question.correct?(Set.new([1]))).to be true
        expect(question.correct?(Set.new([2]))).to be false
      end
    end
    context 'when answer options is a string' do
      it 'should detect if the options are the same' do
        question = Question.new options: ['$1 billion', '$2 billion'], right_options: '$2 billion'
        expect(question.correct?(Set.new(['$1 billion']))).to be false
        expect(question.correct?(Set.new(['$2 billion']))).to be true
      end
    end
  end
end
