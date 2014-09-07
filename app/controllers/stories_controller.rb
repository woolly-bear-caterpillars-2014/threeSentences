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
    cookies['fileDownload'] = 'true'
    @story = Story.find(params[:id])
    depth = params[:Column].to_i - 1
    test = @story.export_story(depth, params[:filetype])
    render json: { url: test }.to_json
  end

  def download
    file = File.open("tmp/#{params[:file]}.#{params[:filetype]}", 'r')

    mime_type = case params[:filetype]
                when 'rtf' then 'text/richtext; charset=UTF-8'
                when 'pdf' then 'application/pdf; charset=UTF-8'
                when 'md' then 'text/x-markdown; charset=UTF-8'
                end
    send_file file,
        :type => mime_type,
        :disposition => "attachment; filename=#{params[:file]}.#{params[:filetype]}"

  end
  private

  def story_params
    params.require(:story).permit(:name, :Column, :filetype)
  end
end
