class SentencesController < ApplicationController
  before_action :authenticate_user!

  def new

  end

  def create
    @story = Story.find(params[:story_id])

    unless current_user == @story.user
      return redirect_to new_user_session_path
    end

    @sentence = @story.sentences.build(sentence_params)
    if @sentence.save
      redirect_to @story
    else
      redirect_to @story, alert: "Error!"
    end
  end

  private

  def sentence_params
    params.require(:sentence).permit(:depth, :position, :content, :parent_id)
  end
end
