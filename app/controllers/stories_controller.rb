class StoriesController < ApplicationController

  def index
    @stories = Story.all
    p params
    puts "********************************************************************"
    if user_signed_in?
      @user = current_user
    end

  end

  def show
    @story = Story.find(params[:id])
  end


  private

  def story_params
    params.require(:story).permit(:name)
  end

end
