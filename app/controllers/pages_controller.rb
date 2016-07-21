class PagesController < ApplicationController

  def show
    render template: "pages/#{params[:page]}", layout: (params[:page] == 'embed' ? false : 'application')
  rescue ActionView::MissingTemplate
    render_404 and return
  end

end
