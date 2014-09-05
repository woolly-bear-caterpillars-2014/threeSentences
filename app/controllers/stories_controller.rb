class StoriesController < ApplicationController
  before_action :authenticate_user!

  def index
    @stories = current_user.stories.all
  end

  def show
    @story = Story.find(params[:id])
    @sentence = Sentence.new
    @user = current_user
    unless current_user == @story.user
      return redirect_to new_user_session_path
    end
  end

  def new
    @story = current_user.stories.new
  end

  def create
    @story = current_user.stories.new(story_params)
    if @story.save
      redirect_to @story
    else
      render :new
    end
  end

  def destroy
    @story = current_user.stories.find(params[:id])
    @story.destroy
    redirect_to root_path
  end

  def test
    @story = Story.find(params[:id])
    @sentence = Sentence.new
    @user = current_user
    unless current_user == @story.user
      return redirect_to new_user_session_path
    end
  end

  private

  def story_params
    params.require(:story).permit(:name)
  end
end
