class WelcomeController < ApplicationController

  def index
    if current_user
      render 'users/show'
    else
      @home = true
      render 'index'
    end
  end

end
