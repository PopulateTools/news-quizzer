class ScreensController < ApplicationController
  def show
    if current_session? && current_session.nil?
      reset_session
    end

    respond_to do |format|
      format.html do
        if request.post?
          reset_session
          redirect_to root_path and return
        else
          render template: current_screen.template_path
        end
      end
      format.js
    end
  end

end
