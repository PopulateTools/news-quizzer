class SandboxController < ApplicationController
  def index
    @screens = Screen.sorted
  end

  def show
    if current_session.nil?
      reset_session
      redirect_to root_path and return
    end

    screen = Screen.find_by_slug!(params[:slug])
    session[:current_screen_id] = screen.id

    render template: screen.template_path
  end
end
