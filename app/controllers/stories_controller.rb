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
    @sentence = Sentence.new
  end

  def new
    @story = Story.new
  end

  def create
    @story = Story.new(story_params)
    if @story.save
      redirect_to @story
    else
      render :new
    end
  end

  private

  def story_params
    params.require(:story).permit(:name)
  end

end
