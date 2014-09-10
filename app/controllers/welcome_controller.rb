class WelcomeController < ApplicationController

  def index
    if current_user
      render 'users/show'
    else
      render 'index'
    end
  end

end
