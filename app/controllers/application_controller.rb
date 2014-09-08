class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def verify_author
    unless current_user && current_user == @story.user
      redirect_to new_user_session_path and return true
    end
  end
end
