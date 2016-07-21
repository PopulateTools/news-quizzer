class SessionsController < ApplicationController
  def create
    if params[:session]
      s = Session.create session_params
      if s.invalid?
        flash.now[:alert] = s.errors.full_messages.to_sentence
      else
        session[:id] = s.id
        session[:current_screen_id] = current_screen.next.id
        session[:seconds] = 0
        session[:points] = 0
      end
    else
      session[:current_screen_id] = current_screen.next.id
    end

    respond_to do |format|
      format.js do
        render 'screens/show'
      end
    end
  end

  def update
    session[:current_screen_id] = current_screen.next.id

    respond_to do |format|
      format.js do
        render 'screens/show'
      end
      format.html {
        redirect_to screen_path(current_screen.next)
      }
    end
  end

  def destroy
    reset_session
    redirect_to root_path and return
  end

  private

  def session_params
    params.require(:session).permit(:age, :nickname, :country)
  end
end
