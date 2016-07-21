class AnswersController < ApplicationController

  def create
    options = if params[:answer][:options].is_a?(Array)
                Set.new params[:answer][:options]
              else
                Set.new [params[:answer][:options]]
              end

    question = current_screen.find_question(params[:answer][:question_id])
    answer = question.answers.create! session_id: session[:id], options: options,
                              took: params[:answer][:took]

    # JSON requests will show more information in the UI, without moving to the next screen
    if !request.format.json?
      session[:current_screen_id] = current_screen.next.id
    end
    session[:points] += answer.points if answer.correct?
    session[:seconds] += answer.took

    if question.last?
      current_session.update_attributes completed: true, points: session[:points], seconds: session[:seconds]
    end

    respond_to do |format|
      format.html do
        redirect_to screen_path(current_screen.next)
      end
      format.json do
        render json: answer.to_json(points: current_session_points, ranking_position: current_session_ranking_position)
      end
      format.js do
        @correct = answer.correct?
        render 'screens/show'
      end
    end
  rescue ActiveRecord::RecordInvalid
    flash[:alert] = 'Please, choose an answer'
    respond_to do |format|
      format.html do
        redirect_to screen_path(current_screen)
      end
      format.json do
        render json: answer.to_json
      end
      format.js do
        render 'screens/show'
      end
    end
  end
end
