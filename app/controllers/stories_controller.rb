class StoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :get_story, only: [:show, :destroy, :export]
  before_action :verify_author, only: [:show, :destroy, :export]

  def index
    @stories = current_user.stories.all
  end

  def show
    @sentence = Sentence.new
    @user = current_user
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
    @story.destroy
    redirect_to root_path
  end

  def export
    cookies['fileDownload'] = 'true'
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

  def delete_export
    file = "tmp/#{params[:file]}.#{params[:filetype]}"
    File.delete(file) if File.exist?(file)
    respond_to do |format|
      format.json {render :json => "200".to_json}
    end
  end

  private

  def story_params
    params.require(:story).permit(:name, :Column, :filetype)
  end

  def get_story
    @story = Story.find(params[:id])
  end
end
