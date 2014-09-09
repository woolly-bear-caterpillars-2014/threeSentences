class StoriesController < ApplicationController
  require 'digest'

  before_action :authenticate_user!
  before_action :get_story, only: [:show, :destroy, :export, :update]
  before_action :verify_author, only: [:show, :destroy, :export, :update]

  def index
    @stories = current_user.stories.all
  end

  def show
    @sentence = Sentence.new
    @user = current_user
    @shared = false
  end

  def share
    @user = current_user if current_user
    @story = Story.find(params[:id])
    share_url = Digest::SHA1.hexdigest(@story.name)[0..6]
    @shared = true

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

  def update
    if @story.update(story_params)
      render json: @story.to_json
    else
      render json: @story.errors.full_messages.to_json
    end
  end

  def destroy
    @story.destroy
    redirect_to root_path
  end

  def export
    cookies['fileDownload'] = 'true'
    file_link = @story.export_story(params[:filetype])
    render json: { url: file_link }.to_json
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

  def delete_export
    file = "tmp/#{params[:file]}.#{params[:filetype]}"
    File.delete(file) if File.exist?(file)
    respond_to do |format|
      format.json {render :json => "200".to_json}
    end
  end

  def demo
    @story = Story.new
  end

  private

  def story_params
    params.require(:story).permit(:name, :filetype)
  end

  def get_story
    @story = Story.find(params[:id])
  end



end
