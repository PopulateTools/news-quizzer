class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  # skip_before_action :verify_authenticity_token

  helper_method :current_session, :current_session?,
                :current_session_points, :current_session_ranking_position,
                :current_screen, :total_ranking_elements


  def current_session
    @current_session ||= if (session_id = session[:id])
                           Session.find_by(id: session_id)
                         end
  end

  def current_session?
    session[:id].present?
  end

  def current_session_points
    session[:points]
  end

  def current_session_ranking_position
    if current_session?
      sql = "select count(*) as rank from sessions as s1 join sessions as s2 on #{current_session_points} < s2.points where s1.id = #{session[:id]}"
      results = ActiveRecord::Base.connection.execute sql
      results.first.first + 1
    else
    end
  end

  def total_ranking_elements
    Session.completed.count + 1
  end

  def current_screen
    if session[:current_screen_id].present?
      Screen.find_by_id(session[:current_screen_id])
    else
      Screen.first
    end
  end

end
