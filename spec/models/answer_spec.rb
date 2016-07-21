require 'rails_helper'

RSpec.describe Answer, :type => :model do
  before do
    allow_any_instance_of(TimePointsAssigment).to receive(:points).and_return(100)
  end
  describe '#points' do
    it 'should return 0 when there are no assigned points' do
      expect(Answer.new.points).to eq(0)
    end

    it 'should return 0 when only one type of point is assigned' do
      expect(Answer.new(question_points: 100).points).to eq(0)
      expect(Answer.new(time_points: 100).points).to eq(0)
    end

    it 'should return the sum of the two types of points' do
      expect(Answer.new(question_points: 100, time_points: 200).points).to eq(300)
    end
  end

  describe 'Creating an Answer' do
    fixtures :screens, :questions
    let(:session) { Session.create! points: rand(10_000), completed: true, seconds: rand(600), nickname: 'blat', country: ISO3166::Country.all.sample.number, age: rand(100) }

    context 'for single choice questions' do
      let(:question) { questions(:how_many_countries_question) }

      it 'should create an incorrect answer' do
        answer = Answer.create! session: session, question_id: question.id,
                                options: Set.new(['33']), took: 200

        expect(answer).to_not be_new_record
        expect(answer.session).to eq(session)
        expect(answer.question).to eq(question)
        expect(answer.correct).to be_falsey
        expect(answer.question_points).to be_nil
        expect(answer.time_points).to be_nil
      end

      it 'should create a correct answer' do
        answer = Answer.create! session: session, question_id: question.id,
                                options: Set.new(['54']), took: 200

        expect(answer).to_not be_new_record
        expect(answer.session).to eq(session)
        expect(answer.question).to eq(question)
        expect(answer.correct).to be_truthy
        expect(answer.question_points).to eq(question.points)
        expect(answer.time_points).to eq(100)
      end
    end

    context 'for multiple choice questions' do
      let(:question) { questions(:offshore_companies_nigeria_question) }

      it 'should create an incorrect answer' do
        answer = Answer.create! session: session, question_id: question.id,
          options: Set.new(['Bahamas']), took: 200

        expect(answer).to_not be_new_record
        expect(answer.session).to eq(session)
        expect(answer.question).to eq(question)
        expect(answer.correct).to be_falsey
        expect(answer.question_points).to be_nil
        expect(answer.time_points).to be_nil
      end

      it 'should create a correct answer' do
        answer = Answer.create! session: session, question_id: question.id,
          options: Set.new(['Bahamas','Samoa','Dubai']), took: 200

        expect(answer).to_not be_new_record
        expect(answer.session).to eq(session)
        expect(answer.question).to eq(question)
        expect(answer.correct).to be_truthy
        expect(answer.question_points).to eq(question.points)
        expect(answer.time_points).to eq(100)
      end
    end
  end
end
