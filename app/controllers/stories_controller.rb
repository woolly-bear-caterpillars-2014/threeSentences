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

  def export
    @story = Story.find(params[:id])
    depth = params[:Column].to_i - 1
    # @story.export_story(depth, params[:filetype])

    send_data @story.export_story(depth, params[:filetype]), :filename => "#{@story.name}.rtf",
                            :type => "application/rtf"
    # redirect_to story_download_path(@story)
    # return '/stories/#{params[:id]}/download'
  end

  def download
    p params
    # @story = Story.find(params[:id])
  end




  private

  def story_params
    params.require(:story).permit(:name, :Column, :filetype)
  end
end
